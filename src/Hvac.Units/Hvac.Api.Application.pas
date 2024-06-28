unit Hvac.Api.Application;

{$mode objfpc}
{$H+}

interface

uses
    Classes,
    HttpDefs,
    HttpRoute,
    FPJson,
    FPHttpApp,
    CustHttpApp,
    EventLog,
    Hvac.Cqrs,
    Hvac.Commands.Dispatcher;

type
    THvacApiApplication = class(THttpApplication)
        const JsonMimeType = 'application/json';
        private
            FApiKey: string;
            FAllowOrigin: string;
            FLogger: TEventLog;
            FHvacHost: string;
            FHvacPort: word;
            FCommandDispatcher: ICommandDispatcher;
            property Logger: TEventLog read FLogger;
            property CommandDispatcher: ICommandDispatcher read FCommandDispatcher write FCommandDispatcher;
            property HvacHost: string read FHvacHost write FHvacHost;
            property HvacPort: word read FHvacPort write FHvacPort;
            function GetPrettyParam(request: TRequest):   boolean;
            procedure GetStateHandler(request: TRequest; response: TResponse);
            procedure OptionsStateHandler(request: TRequest; response: TResponse);   
            procedure PutStateHandler(request: TRequest; response: TResponse);                     
            procedure GetEnumsHandler(request: TRequest; response: TResponse);
            procedure OptionsEnumsHandler(request: TRequest; response: TResponse);
            function VerifyApiKey(request: TRequest): boolean;
            procedure RegisterRoutes(AHttpRouter: THttpRouter);
            procedure SetCorsHeader(var AResponse: TResponse);
            function GetErrorResponse(message: string): TJsonObject;

        public
            const Version = '1';
            const DefaultConnectionString = 'localhost:12416';
            const DefaultPort = 9090;
            property ApiKey: string read FApiKey write FApiKey;
            property AllowOrigin: string read FAllowOrigin write FAllowOrigin;
            procedure Initialize(); override;
            procedure Run();
            constructor Create(
                ALogger: TEventLog;
                AHttpRouter: THttpRouter;
                APort: word = DefaultPort;
                AHvacConnectionString: string = DefaultConnectionString;
                AOwner: TComponent = Nil);
            destructor Destroy(); override;
    end;

implementation

uses
    SysUtils,
    StrUtils,
    Hvac.Helpers.Enums,
    Hvac.Types.Core,
    Hvac.Models.Domain,
    Hvac.Models.Dto,

    Hvac.Commands.GetEnums.Query,
    Hvac.Commands.GetEnums.Result,

    Hvac.Commands.GetState.Query,
    Hvac.Commands.GetState.Result,

    Hvac.Commands.SetState.Command,
    Hvac.Commands.SetState.Result;

{ THvacApiApplication }

constructor THvacApiApplication.Create(
    ALogger: TEventLog;
    AHttpRouter: THttpRouter;
    APort: word = DefaultPort;
    AHvacConnectionString: string = DefaultConnectionString;
    AOwner: TComponent = Nil);
var
    elems: array of string;
begin
    inherited Create(AOwner);
    FLogger := ALogger;
    Port := APort;

    try
        elems := AHvacConnectionString.Split(':');
        if Length(elems) <> 2 then
            raise Exception.Create('Invalid connection string');

        HvacHost := elems[0];
        HvacPort := StrToInt(elems[1]);

    except
        raise Exception.Create('Invalid connection string');

    end;

    RegisterRoutes(AHttpRouter);
    CommandDispatcher := TCommandDispatcher.Create(Logger);
end;

destructor THvacApiApplication.Destroy();
begin
    Logger.Info('API is shutting down...');

    inherited;
end;

procedure THvacApiApplication.Initialize();
begin
    inherited;

    Logger.Info('Hvac connection configured to %s:%d', [HvacHost, HvacPort]);    

    if string.IsNullOrWhiteSpace(ApiKey) then
        Logger.Warning('API key not set!');

    if not string.IsNullOrWhiteSpace(AllowOrigin) then
        Logger.Info('Allow origin: %s', [AllowOrigin]);
end;

procedure THvacApiApplication.Run();
begin
    Logger.Info('Starting API, listening port %d', [Port]);

    inherited;
end;

function THvacApiApplication.GetPrettyParam(request: TRequest):   boolean;
var 
    prettyParam:   string;
begin
    prettyParam := request.QueryFields.Values['pretty'].ToLower();
    result := (not string.IsNullOrWhiteSpace(prettyParam))
              and (prettyParam <> '0')
              and (prettyParam <> 'false');
end;

// GET /state
procedure THvacApiApplication.GetStateHandler(request: TRequest; response: TResponse);
var 
    hvacStateDto: THvacStateDto;
    errorResponse: TJsonObject;
    pretty: boolean;
    cqrsQuery: IGetStateQuery;
    cqrsResult: IGetStateResult;
begin
    Logger.Debug('GET state');
    SetCorsHeader(response);
    response.ContentType := JsonMimeType;

    if not VerifyApiKey(request) then
        begin
            response.Code := 401;
            errorResponse := GetErrorResponse('Unauthorized');
            response.Content := errorResponse.AsJson;
            errorResponse.Free();
            exit;
        end;

    try
        cqrsQuery := TGetStateQuery.Create(HvacHost, HvacPort);
        cqrsResult := CommandDispatcher.Execute(cqrsQuery);
        if not cqrsResult.IsSuccess then
            raise Exception.Create('Failed to get state');

        hvacStateDto := THvacStateDto.FromHvacState(cqrsResult.Result);
        pretty := GetPrettyParam(request);
        response.Content := hvacStateDto.ToJson(pretty);

    except
        on E: Exception do
          begin
            errorResponse := GetErrorResponse(E.Message);
            response.Content := errorResponse.AsJson;
            errorResponse.Free();
            response.Code := 500;
          end;
    end;

    Logger.Debug('Status %d', [response.Code]);
end;

// OPTIONS /state
procedure THvacApiApplication.OptionsStateHandler(request: TRequest; response: TResponse);
begin
    Logger.Debug('OPTIONS /state');
    SetCorsHeader(response);
    Response.SetFieldByName('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    Response.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
    response.Code := 204;
    Logger.Debug('Status %d', [response.Code]);
end;

// PUT /state
procedure THvacApiApplication.PutStateHandler(request: TRequest; response: TResponse);
var 
    hvacStateDto: THvacStateDto;
    errorResponse: TJsonObject;
    pretty: boolean;
    cqrsCommand: ISetStateCommand;
    cqrsResult: ISetStateResult;
begin
    Logger.Debug('PUT /state');
    SetCorsHeader(response);
    response.ContentType := JsonMimeType;

    if not VerifyApiKey(request) then
        begin
            response.Code := 401;
            errorResponse := GetErrorResponse('Unauthorized');
            response.Content := errorResponse.AsJson;
            errorResponse.Free();
            Logger.Debug('Status %d', [response.Code]);
            exit;
        end;

    if not request.ContentType.StartsWith(JsonMimeType) then
        begin
            response.Code := 415;
            errorResponse :=GetErrorResponse('JSON is required.');
            response.Content := errorResponse.AsJson;
            errorResponse.Free();
            Logger.Debug('Status %d', [response.Code]);
            exit;
        end;

    try
        hvacStateDto := THvacStateDto.FromJson(request.Content);
        cqrsCommand := TSetStateCommand.Create(hvacStateDto.ToHvacState(), HvacHost, HvacPort);
        cqrsResult := CommandDispatcher.Execute(cqrsCommand);

        if not cqrsResult.IsSuccess then
            begin
                errorResponse := GetErrorResponse(cqrsResult.Errors[0]);
                response.Content := errorResponse.AsJson;
                response.Code := 500;
                FreeAndNil(errorResponse);
                exit;
            end;

        pretty := GetPrettyParam(request);
        response.Content := hvacStateDto.FromHvacState(cqrsResult.Result).ToJson(pretty);
        response.Code := 200;

    except
        on E: Exception do
            begin
                errorResponse := GetErrorResponse(E.Message);
                response.Content := errorResponse.AsJson;
                FreeAndNil(errorResponse);
                response.ContentType := JsonMimeType;
                response.Code := 500;
            end;
    end;

    Logger.Debug('Status %d', [response.Code]);
end;

// GET /enums
procedure THvacApiApplication.GetEnumsHandler(request: TRequest; response: TResponse);
var 
    errorResponse: TJsonObject;
    cqrsQuery: IGetEnumsQuery;
    cqrsResult: IGetEnumsResult;
    json: TJsonObject;
    jsonArray: TJsonArray;
    enumValue: string;
    i: integer;
begin
    Logger.Debug('GET /enums');
    SetCorsHeader(response);
    response.ContentType := JsonMimeType;

    if not VerifyApiKey(request) then
        begin
            response.Code := 401;
            errorResponse := GetErrorResponse('Unauthorized');
            response.Content := errorResponse.AsJson;
            FreeAndNil(errorResponse);
            exit;
        end;

    cqrsQuery := TGetEnumsQuery.Create();
    cqrsResult := CommandDispatcher.Execute(cqrsQuery);

    if not cqrsResult.IsSuccess then
    begin
        errorResponse := GetErrorResponse(cqrsResult.Errors[0]);
        response.Content := errorResponse.AsJson;
        response.Code := 500;
        FreeAndNil(errorResponse);
        exit;
    end;

    json := TJsonObject.Create();
    try
        for i := 0 to (cqrsResult.Result.Count - 1) do
        begin
            jsonArray := TJsonArray.Create();
            for enumValue in cqrsResult.Result.data[i] do
                jsonArray.Add(enumValue);

            json.Arrays[cqrsResult.Result.keys[i]] := jsonArray;
        end;

        json.CompressedJson := true;
        if GetPrettyParam(request) then
            response.Content := json.FormatJson
        else
            response.Content := json.AsJson;

    finally
        FreeAndNil(json);
    end;

    response.ContentType := JsonMimeType;

    Logger.Debug('Status %d', [response.Code]);
end;

// OPTIONS /enums
procedure THvacApiApplication.OptionsEnumsHandler(request: TRequest; response: TResponse);
var
    errorResponse: TJsonObject;
begin
    Logger.Debug('OPTIONS enums');
    SetCorsHeader(response);
    response.ContentType := JsonMimeType;

    if not VerifyApiKey(request) then
    begin
        response.Code := 401;
        errorResponse := GetErrorResponse('Unauthorized');
        response.Content := errorResponse.AsJson;
        errorResponse.Free();
        exit;
    end;

    Response.SetFieldByName('Access-Control-Allow-Methods', 'GET, OPTIONS');
    Response.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
    response.Code := 204;
end;

procedure THvacApiApplication.RegisterRoutes(AHttpRouter: THttpRouter);
var 
    prefix, path: string;
begin
    prefix := '/api/v' + Version;

    path := prefix + '/state';
    AHttpRouter.RegisterRoute(path, rmGet, @GetStateHandler);
    AHttpRouter.RegisterRoute(path, rmPut, @PutStateHandler);
    AHttpRouter.RegisterRoute(path, rmOptions, @OptionsStateHandler);

    path := prefix + '/enums';
    AHttpRouter.RegisterRoute(path, rmGet, @GetEnumsHandler);
    AHttpRouter.RegisterRoute(path, rmOptions, @OptionsEnumsHandler);
end;

function THvacApiApplication.VerifyApiKey(request: TRequest): boolean;
begin
    if ApiKey = string.Empty then
    begin
        Logger.Warning('API key check skipped because the key is not set!');
        exit(true);
    end;

    result := request.GetFieldByName('X-Api-Key') = ApiKey;
end;

procedure THvacApiApplication.SetCorsHeader(var AResponse: TResponse);
begin
    if not string.IsNullOrWhiteSpace(AllowOrigin) then
        AResponse.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
end;

function THvacApiApplication.GetErrorResponse(message: string): TJsonObject;
begin
    result := TJsonObject.Create([
        'error', StringToJsonString(message)
    ]);
end;

end.