
program HvacApi;

{$mode objfpc}{$H+}
{$modeswitch TypeHelpers}

uses 
  {$ifdef UNIX}
cthreads, cmem,
  {$endif}
Classes,
fpHttpApp,
httpDefs,
httpRoute,
fpJson,
fpMimeTypes,
SysUtils,
StrUtils,

EnumHelpers,
HvacModels,
HvacConnection;

const 
    ApiVersion =   1;
    DefaultPort =   9090;
    ConnectionString:   string =   'localhost:12416';

var 
    Connection:   THvacConnection;
    Value:   string;
    JsonMimeType:   string;
    MimeTypeProvider:   TFPMimeTypes;
    AllowOrigin:   string;

function GetPrettyParam(request: TRequest):   boolean;

var 
    prettyParam:   string;
begin
    prettyParam := request.QueryFields.Values['pretty'].ToLower();
    result := (not string.IsNullOrWhiteSpace(prettyParam))
              and (prettyParam <> '0')
              and (prettyParam <> 'false');
end;

procedure GetStateHandler(request: TRequest; response: TResponse);

var 
    dto:   THvacStateDto;
    state:   THvacState;
    pretty:   boolean;
begin
    state := connection.GetState();
    dto := THvacStateDto.FromHvacState(state);

    pretty := GetPrettyParam(request);

    response.Content := dto.ToJson(pretty);
    response.ContentType := 'application/json';
    Response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
end;

procedure OptionsStateHandler(request: TRequest; response: TResponse);
begin
    response.Code := 204;
    Response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
    Response.SetFieldByName('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    Response.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
end;

procedure PutStateHandler(request: TRequest; response: TResponse);

var 
    dto:   THvacStateDto;
    state:   THvacState;
begin
    if not request.ContentType.ToLower().StartsWith('application/json') then
        begin
            response.Code := 415;
            response.Content := 'A JSON is required.';
            Exit();
        end;

    dto := THvacStateDto.FromJson(request.Content);
    state := dto.ToHvacState();
    connection.SetState(state);

    response.Code := 204;
    Response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
end;

procedure GetEnumsHandler(request: TRequest; response: TResponse);

var 
    json:   TJsonObject;
begin
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
        Response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);

    finally
        json.Free();

end;
end;

procedure OptionsEnumsHandler(request: TRequest; response: TResponse);
begin
    response.Code := 204;
    Response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
    Response.SetFieldByName('Access-Control-Allow-Methods', 'GET, OPTIONS');
    Response.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
end;

procedure RegisterRoutes();

var 
    prefix, path:   string;

begin
    prefix := '/api/v' + IntToStr(ApiVersion);

    path := prefix + '/state';
    HttpRouter.RegisterRoute(path, rmGet, @GetStateHandler);
    HttpRouter.RegisterRoute(path, rmPut, @PutStateHandler);
    HttpRouter.RegisterRoute(path, rmOptions, @OptionsStateHandler);

    path := prefix + '/enums';
    HttpRouter.RegisterRoute(path, rmGet, @GetEnumsHandler);
    HttpRouter.RegisterRoute(path, rmOptions, @OptionsEnumsHandler);
end;

begin
    MimeTypeProvider := TFPMimeTypes.Create(nil);
    try
        MimeTypeProvider.LoadKnownTypes();
        JsonMimeType := MimeTypeProvider.GetMimeType('json');
    finally
        FreeAndNil(MimeTypeProvider);
end;
JsonMimeType := IfThen(string.IsNullOrWhiteSpace(JsonMimeType), 'application/json', JsonMimeType);

AllowOrigin := GetEnvironmentVariable('ALLOW_ORIGIN');

value := GetEnvironmentVariable('HVAC_CONNECTION_STRING');
ConnectionString := IfThen(string.IsNullOrWhiteSpace(value), ConnectionString, value);
Writeln(Format('Using connection string: %s', [connectionString]));

connection := THvacConnection.Create(ConnectionString);

Application.Port := StrToIntDef(GetEnvironmentVariable('LISTEN_PORT'), DefaultPort);
Application.Threaded := false;
Writeln(Format('Listening port %d', [Application.Port]));

RegisterRoutes();

Application.Initialize();
Application.Run();
end.
