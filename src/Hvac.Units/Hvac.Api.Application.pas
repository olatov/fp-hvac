unit Hvac.Api.Application;

{$mode objfpc}{$H+}

interface

uses
  Classes,
  HttpDefs,
  HttpRoute,
  FPJson,
  FPHttpApp,
  CustHttpApp,
  EventLog,
  Hvac.Types.Generic,
  Hvac.Cqrs,
  Hvac.Cqrs.Dispatcher;

type

{ THvacApiApplication }

THvacApiApplication = class(THttpApplication)
  const JsonMimeType = 'application/json';
  private
    FApiKey: String;
    FAllowOrigin: String;
    FLogger: TEventLog;
    FHvacHost: String;
    FHvacPort: Word;
    FCommandDispatcher: ICommandDispatcher;
    property Logger: TEventLog read FLogger;
    property CommandDispatcher: ICommandDispatcher read FCommandDispatcher write FCommandDispatcher;
    property HvacHost: String read FHvacHost write FHvacHost;
    property HvacPort: Word read FHvacPort write FHvacPort;
    function GetPrettyParam(ARequest: TRequest): Boolean;
    procedure AuthInterceptor(ARequest: TRequest; AResponse: TResponse; var AContinue: Boolean);
    procedure GetStateHandler(ARequest: TRequest; AResponse: TResponse);
    procedure OptionsStateHandler(ARequest: TRequest; AResponse: TResponse);   
    procedure PutStateHandler(ARequest: TRequest; AResponse: TResponse);                     
    procedure GetEnumsHandler(ARequest: TRequest; AResponse: TResponse);
    procedure OptionsEnumsHandler(ARequest: TRequest; AResponse: TResponse);
    function VerifyApiKey(ARequest: TRequest): Boolean;
    procedure RegisterRoutes(AHttpRouter: THttpRouter);
    procedure SetCorsHeader(var AResponse: TResponse);
    procedure SendError(AResponse: TResponse; const AMessage: String; Code: LongInt = 500);

    public
      const Version = '1';
      const DefaultConnectionString = 'localhost:12416';
      const DefaultPort = 9090;
      property ApiKey: String read FApiKey write FApiKey;
      property AllowOrigin: String read FAllowOrigin write FAllowOrigin;
      procedure Initialize; override;
      procedure Run;
      constructor Create(
        ALogger: TEventLog;
        AHttpRouter: THttpRouter;
        APort: word = DefaultPort;
        AHvacConnectionString: String = DefaultConnectionString;
        AOwner: TComponent = Nil); reintroduce;
      destructor Destroy; override;
    end;

implementation

uses
  SysUtils,
  Hvac.Models.Dto,
  Hvac.Cqrs.Commands.GetEnums,
  Hvac.Cqrs.Commands.GetState,
  Hvac.Cqrs.Commands.SetState;

{ THvacApiApplication }

constructor THvacApiApplication.Create(ALogger: TEventLog;
  AHttpRouter: THttpRouter; APort: word; AHvacConnectionString: String;
  AOwner: TComponent);
var
  Elems: array of String;
begin
    inherited Create(AOwner);
    FLogger := ALogger;
    Port := APort;

    try
      Elems := AHvacConnectionString.Split(':');
      if Length(elems) <> 2 then
        raise Exception.Create('Invalid connection string');

      HvacHost := Elems[0];
      HvacPort := Elems[1].ToInteger;

    except
      raise Exception.Create('Invalid connection string');

    end;

    RegisterRoutes(AHttpRouter);
    CommandDispatcher := TCommandDispatcher.Create(Logger);
end;

destructor THvacApiApplication.Destroy;
begin
  Logger.Info('API is shutting down...');

  inherited;
end;

procedure THvacApiApplication.Initialize;
begin
  inherited;

  Logger.Info('Hvac connection configured to %s:%d', [HvacHost, HvacPort]);    

  if ApiKey.IsEmpty then
    Logger.Warning('API key not set!');

  if not AllowOrigin.IsEmpty then
    Logger.Info('Allow origin: %s', [AllowOrigin]);
end;

procedure THvacApiApplication.Run;
begin
  Logger.Info('Starting API, listening port %d', [Port]);

  inherited;
end;

procedure THvacApiApplication.AuthInterceptor(ARequest: TRequest; AResponse: TResponse; var AContinue: Boolean);
begin
  if not VerifyApiKey(ARequest) then
  begin
    SendError(AResponse, 'Unauthorized', 401);
    AContinue := False;
  end;
end;

function THvacApiApplication.GetPrettyParam(ARequest: TRequest): Boolean;
var 
  PrettyParam: String;
begin
  PrettyParam := ARequest.QueryFields.Values['pretty'].ToLower;
  Result := (not PrettyParam.IsEmpty)
            and (PrettyParam <> '0')
            and (PrettyParam <> 'false');
end;

// GET /state
procedure THvacApiApplication.GetStateHandler(ARequest: TRequest; AResponse: TResponse);
var 
  HvacStateDto: THvacStateDto;
  Pretty: Boolean;
  CqrsQuery: IGetStateQuery;
  CqrsResult: IGetStateResult;
begin
  Logger.Debug('GET state');
  SetCorsHeader(AResponse);
  AResponse.ContentType := JsonMimeType;

  try
    CqrsQuery := TGetStateQuery.Create(HvacHost, HvacPort);
    CqrsResult := CommandDispatcher.Execute(CqrsQuery);
    if not CqrsResult.Success then
      raise Exception.Create('Failed to get state');

    HvacStateDto := THvacStateDto.FromHvacState(CqrsResult.Result);
    Pretty := GetPrettyParam(ARequest);
    AResponse.Content := HvacStateDto.ToJson(Pretty);

  except
    on E: Exception do
      SendError(AResponse, E.Message);
  end;

  Logger.Debug('Status %d', [AResponse.Code]);
end;

// OPTIONS /state
procedure THvacApiApplication.OptionsStateHandler(ARequest: TRequest; AResponse: TResponse);
begin
  Logger.Debug('OPTIONS /state');
  SetCorsHeader(AResponse);
  AResponse.SetFieldByName('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  AResponse.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
  AResponse.Code := 204;
  Logger.Debug('Status %d', [AResponse.Code]);
end;

// PUT /state
procedure THvacApiApplication.PutStateHandler(ARequest: TRequest; AResponse: TResponse);
var 
  HvacStateDto: THvacStateDto;
  Pretty: Boolean;
  CqrsCommand: ISetStateCommand;
  CqrsResult: ISetStateResult;
begin
  Logger.Debug('PUT /state');
  SetCorsHeader(AResponse);
  AResponse.ContentType := JsonMimeType;

  if not ARequest.ContentType.StartsWith(JsonMimeType, True) then
  begin
    SendError(AResponse, 'JSON is required.', 415);
    Exit;
  end;

  try
    HvacStateDto := THvacStateDto.FromJson(ARequest.Content);
    CqrsCommand := TSetStateCommand.Create(HvacStateDto.ToHvacState, HvacHost, HvacPort);
    CqrsResult := CommandDispatcher.Execute(cqrsCommand);

    if not CqrsResult.Success then
    begin
      SendError(AResponse, CqrsResult.Errors[0]);
      Exit;
    end;

    Pretty := GetPrettyParam(ARequest);
    AResponse.Content := hvacStateDto.FromHvacState(CqrsResult.Result).ToJson(Pretty);
    AResponse.Code := 200;

  except
    on E: Exception do
      SendError(AResponse, E.Message);
  end;

  Logger.Debug('Status %d', [AResponse.Code]);
end;

// GET /enums
procedure THvacApiApplication.GetEnumsHandler(ARequest: TRequest; AResponse: TResponse);
var 
  CqrsQuery: IGetEnumsQuery;
  CqrsResult: IGetEnumsResult;
  Json: TJsonObject;
  EnumValue: String;
  DictItem: TStringArrayMap.TDictionaryPair;
begin
  Logger.Debug('GET /enums');
  SetCorsHeader(AResponse);
  AResponse.ContentType := JsonMimeType;

  CqrsQuery := TGetEnumsQuery.Create;
  CqrsResult := CommandDispatcher.Execute(CqrsQuery);

  if not CqrsResult.Success then
  begin
    SendError(AResponse, CqrsResult.Errors[0]);
    Exit;
  end;

  Json := TJsonObject.Create;
  try
    for DictItem in CqrsResult.Result do
    begin
      Json.Arrays[DictItem.Key] := TJsonArray.Create;
      for EnumValue in DictItem.Value do
        Json.Arrays[DictItem.Key].Add(EnumValue);
    end;

    Json.CompressedJson := True;
    if GetPrettyParam(ARequest) then
      AResponse.Content := Json.FormatJson
    else
      AResponse.Content := Json.AsJson;

  finally
    FreeAndNil(Json);
  end;

  AResponse.ContentType := JsonMimeType;

  Logger.Debug('Status %d', [AResponse.Code]);
end;

// OPTIONS /enums
procedure THvacApiApplication.OptionsEnumsHandler(ARequest: TRequest; AResponse: TResponse);
begin
  Logger.Debug('OPTIONS /enums');
  SetCorsHeader(AResponse);
  AResponse.ContentType := JsonMimeType;
  AResponse.SetFieldByName('Access-Control-Allow-Methods', 'GET, OPTIONS');
  AResponse.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
  AResponse.Code := 204;
  Logger.Debug('Status %d', [AResponse.Code]);
end;

procedure THvacApiApplication.RegisterRoutes(AHttpRouter: THttpRouter);
var 
  Prefix, Path: String;
begin
  Prefix := '/api/v' + Version;

  Path := Prefix + '/state';
  AHttpRouter.RegisterRoute(Path, rmGet, @GetStateHandler);
  AHttpRouter.RegisterRoute(Path, rmPut, @PutStateHandler);
  AHttpRouter.RegisterRoute(Path, rmOptions, @OptionsStateHandler);

  Path := Prefix + '/enums';
  AHttpRouter.RegisterRoute(Path, rmGet, @GetEnumsHandler);
  AHttpRouter.RegisterRoute(Path, rmOptions, @OptionsEnumsHandler);

  AHttpRouter.RegisterInterceptor('auth', @AuthInterceptor);
end;

function THvacApiApplication.VerifyApiKey(ARequest: TRequest): Boolean;
begin
  if ApiKey.IsEmpty then
  begin
    Logger.Warning('API key check skipped because the key is not set!');
    Exit(True);
  end;

  Result := ARequest.GetFieldByName('X-Api-Key').Equals(ApiKey);
end;

procedure THvacApiApplication.SetCorsHeader(var AResponse: TResponse);
begin
  if AllowOrigin.IsEmpty then Exit;
  AResponse.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
end;

procedure THvacApiApplication.SendError(
  AResponse: TResponse;
  const AMessage: String;
  Code: LongInt = 500);
var
  Content: TJsonObject;
begin
  Content := TJsonObject.Create([
    'error', StringToJsonString(AMessage)
  ]);
  AResponse.Content := Content.AsJson;
  FreeAndNil(Content);
  AResponse.ContentType := JsonMimeType;
  AResponse.Code := Code;
end;

end.
