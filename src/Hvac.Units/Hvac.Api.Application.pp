unit Hvac.Api.Application;

{$mode objfpc}
{$H+}

interface

uses
    Classes,
    HttpDefs,
    HttpRoute,
    FPHttpApp,
    CustHttpApp,
    EventLog,
    Hvac.Connection;

type
    THvacApiApplication = class(THttpApplication)
        private
            FApiKey: string;
            FAllowOrigin: string;
            FJsonMimeType: string;
            FHvacConnection: THvacConnection;
            FHvacConnectionString: string;
            FLogger: TEventLog;
            property Logger: TEventLog read FLogger;
            property JsonMimeType: string read FJsonMimeType write FJsonMimeType;
            property HvacConnection: THvacConnection read FHvacConnection write FHvacConnection;
            property HvacConnectionString: string read FHvacConnectionString write FHvacConnectionString;
            function GetPrettyParam(request: TRequest):   boolean;
            procedure GetStateHandler(request: TRequest; response: TResponse);
            procedure OptionsStateHandler(request: TRequest; response: TResponse);   
            procedure PutStateHandler(request: TRequest; response: TResponse);                     
            procedure GetEnumsHandler(request: TRequest; response: TResponse);
            procedure OptionsEnumsHandler(request: TRequest; response: TResponse);
            function VerifyApiKey(request: TRequest): boolean;
            procedure RegisterRoutes(AHttpRouter: THttpRouter);
            procedure SetCorsHeader(var AResponse: TResponse);

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
                APort: integer = DefaultPort;
                AHvacConnectionString: string = DefaultConnectionString;
                AOwner: TComponent = Nil);
            destructor Destroy(); override;
    end;

implementation

uses
    SysUtils,
    StrUtils,
    FPJson,
    FPMimeTypes,
    Hvac.Helpers.Enums,
    Hvac.Models.Core,
    Hvac.Models.Domain,
    Hvac.Models.Dto;

{ THvacApiApplication }

constructor THvacApiApplication.Create(
    ALogger: TEventLog;
    AHttpRouter: THttpRouter;
    APort: integer = DefaultPort;
    AHvacConnectionString: string = DefaultConnectionString;
    AOwner: TComponent = Nil);
begin
    inherited Create(AOwner);
    FLogger := ALogger;

    Port := APort;
    HvacConnectionString := AHvacConnectionString;    

    with TFPMimeTypes.Create(nil) do begin
        try
            LoadKnownTypes();
            self.JsonMimeType := GetMimeType('json');
        finally
            Free();
        end;
    end;
    
    JsonMimeType := IfThen(string.IsNullOrWhiteSpace(JsonMimeType), 'application/json', JsonMimeType);

    RegisterRoutes(AHttpRouter);
end;

destructor THvacApiApplication.Destroy();
begin
    Logger.Info('API is shutting down...');

    inherited;
end;

procedure THvacApiApplication.Initialize();
begin
    inherited;

    Logger.Info('Using connection string: %s', [HvacConnectionString]);
    HvacConnection := THvacConnection.Create(HvacConnectionString, Logger);

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

procedure THvacApiApplication.GetStateHandler(request: TRequest; response: TResponse);
var 
    hvacStateDto: THvacStateDto;
    hvacState: THvacState;
    pretty: boolean;
begin
    Logger.Debug('GET state');
    SetCorsHeader(response);

    if not VerifyApiKey(request) then
        begin
            response.Code := 401;
            Exit();
        end;

    try
        hvacState := HvacConnection.GetState();
        if hvacState.TemperatureScale = TTemperatureScale.tsFahrenheit then
        begin
            hvacState.IndoorTemperature := Round(hvacState.IndoorTemperature * 1.8) + 32;
            hvacState.DesiredTemperature := Round(hvacState.DesiredTemperature * 1.8) + 32;
        end;

        hvacStateDto := THvacStateDto.FromHvacState(hvacState);
        pretty := GetPrettyParam(request);
        response.Content := hvacStateDto.ToJson(pretty);

    except
        response.Content := '{"error": "Error getting state"}';
        response.Code := 500;
    end;

    response.ContentType := JsonMimeType;
end;

procedure THvacApiApplication.OptionsStateHandler(request: TRequest; response: TResponse);
begin
    Logger.Debug('OPTIONS state');
    SetCorsHeader(response);
    Response.SetFieldByName('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    Response.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
    response.Code := 204;
end;

procedure THvacApiApplication.PutStateHandler(request: TRequest; response: TResponse);
var 
    hvacStateDto: THvacStateDto;
    hvacState: THvacState;
begin
    Logger.Debug('PUT state');
    SetCorsHeader(response);

    if not VerifyApiKey(request) then
        begin
            response.Code := 401;
            Exit();
        end;

    if not request.ContentType.StartsWith(JsonMimeType) then
        begin
            response.Code := 415;
            response.Content := 'A JSON is required.';
            Exit();
        end;

    try
        hvacStateDto := THvacStateDto.FromJson(request.Content);
        hvacState := hvacStateDto.ToHvacState();

        if (hvacState.TemperatureScale = TTemperatureScale.tsFahrenheit)
            and (hvacState.DesiredTemperature >= 50) then
                hvacState.DesiredTemperature := Round((hvacState.DesiredTemperature - 32) / 1.8);

        HvacConnection.SetState(hvacState);
        response.Code := 204;

    except
        response.Content := '{"error": "Error setting state"}';
        response.ContentType := JsonMimeType;
        response.Code := 500;
    end;
end;

procedure THvacApiApplication.GetEnumsHandler(request: TRequest; response: TResponse);
var 
    json: TJsonObject;
begin
    Logger.Debug('GET enums');
    SetCorsHeader(response);

    if not VerifyApiKey(request) then
        begin
            response.Code := 401;
            Exit();
        end;

    json := TJsonObject.Create();
    try
        json.Arrays['mode'] := specialize EnumToJsonArray<THvacMode>();
        json.Arrays['fanSpeed'] := specialize EnumToJsonArray<TFanSpeed>();
        json.Arrays['horizontalFlowMode'] := specialize EnumToJsonArray<THorizontalFlowMode>();
        json.Arrays['verticalFlowMode'] := specialize EnumToJsonArray<TVerticalFlowMode>();
        json.Arrays['temperatureScale'] := specialize EnumToJsonArray<TTemperatureScale>();

        json.CompressedJson := true;

        if GetPrettyParam(request) then
            response.Content := json.FormatJson
        else
            response.Content := json.AsJson;

        response.ContentType := JsonMimeType;

    finally
        json.Free();

    end;
end;

procedure THvacApiApplication.OptionsEnumsHandler(request: TRequest; response: TResponse);
begin
    Logger.Debug('OPTIONS enums');
    SetCorsHeader(response);

    if not VerifyApiKey(request) then
    begin
        response.Code := 401;
        Exit();
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
        Logger.Warning('API key check skipped because the key isn''t set up!');
        exit(true);
    end;

    result := request.GetFieldByName('X-Api-Key') = ApiKey;
end;

procedure THvacApiApplication.SetCorsHeader(var AResponse: TResponse);
begin
    if not string.IsNullOrWhiteSpace(AllowOrigin) then
        AResponse.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
end;

end.