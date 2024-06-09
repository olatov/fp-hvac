unit HvacApi;

{$mode objfpc}
{$H+}

interface

uses
    httpDefs,
    httpRoute,
    HvacConnection;

type
    THvacApi = class
        private
            FAllowOrigin:   string;
            FJsonMimeType:   string;
            FHvacConnection:   THvacConnection;
            property AllowOrigin:   string read FAllowOrigin write FAllowOrigin;
            property JsonMimeType:   string read FJsonMimeType write FJsonMimeType;
            property HvacConnection:   THvacConnection read FHvacConnection write FHvacConnection;
            function GetPrettyParam(request: TRequest):   boolean;
            procedure GetStateHandler(request: TRequest; response: TResponse);
            procedure OptionsStateHandler(request: TRequest; response: TResponse);   
            procedure PutStateHandler(request: TRequest; response: TResponse);                     
            procedure GetEnumsHandler(request: TRequest; response: TResponse);
            procedure OptionsEnumsHandler(request: TRequest; response: TResponse);

        public
            const Version = 1;
            procedure RegisterRoutes(AHttpRouter: THttpRouter);
            constructor Create(AHvacConnectionString: string = 'localhost:12416'; AAllowOrigin: string = '');
            destructor Free();
    end;

implementation

uses
    fpJson,
    fpMimeTypes,
    SysUtils,
    StrUtils,
    EnumHelpers,
    HvacModels;

{ THvacApi }

constructor THvacApi.Create(AHvacConnectionString: string = 'localhost:12416'; AAllowOrigin: string = '');
var
    MimeTypeProvider:   TFPMimeTypes;
begin
    Writeln(Format('Using connection string: %s', [AHvacConnectionString]));
    HvacConnection := THvacConnection.Create(AHvacConnectionString);

    AllowOrigin := AAllowOrigin;

    MimeTypeProvider := TFPMimeTypes.Create(nil);
    try
        MimeTypeProvider.LoadKnownTypes();
        JsonMimeType := MimeTypeProvider.GetMimeType('json');
    finally
        FreeAndNil(MimeTypeProvider);
    end;
    
    JsonMimeType := IfThen(string.IsNullOrWhiteSpace(JsonMimeType), 'application/json', JsonMimeType);
end;

destructor THvacApi.Free();
begin
    FreeAndNil(FHvacConnection);
    inherited;
end;

function THvacApi.GetPrettyParam(request: TRequest):   boolean;
var 
    prettyParam:   string;
begin
    prettyParam := request.QueryFields.Values['pretty'].ToLower();
    result := (not string.IsNullOrWhiteSpace(prettyParam))
              and (prettyParam <> '0')
              and (prettyParam <> 'false');
end;

procedure THvacApi.GetStateHandler(request: TRequest; response: TResponse);
var 
    hvacStwteDto:   THvacStateDto;
    hvacState:   THvacState;
    pretty:   boolean;
begin
    hvacState := HvacConnection.GetState();
    hvacStwteDto := THvacStateDto.FromHvacState(hvacState);
    pretty := GetPrettyParam(request);

    response.Content := hvacStwteDto.ToJson(pretty);
    response.ContentType := JsonMimeType;
    response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
end;

procedure THvacApi.OptionsStateHandler(request: TRequest; response: TResponse);
begin
    response.Code := 204;
    Response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
    Response.SetFieldByName('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    Response.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
end;

procedure THvacApi.PutStateHandler(request: TRequest; response: TResponse);
var 
    hvacStateDto:   THvacStateDto;
    hvacState:   THvacState;
begin
    if request.ContentType <> JsonMimeType then
        begin
            response.Code := 415;
            response.Content := 'A JSON is required.';
            Exit();
        end;

    hvacStateDto := THvacStateDto.FromJson(request.Content);
    hvacState := hvacStateDto.ToHvacState();
    HvacConnection.SetState(hvacState);

    response.Code := 204;
    response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
end;

procedure THvacApi.GetEnumsHandler(request: TRequest; response: TResponse);
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

procedure THvacApi.OptionsEnumsHandler(request: TRequest; response: TResponse);
begin
    response.Code := 204;
    Response.SetFieldByName('Access-Control-Allow-Origin', AllowOrigin);
    Response.SetFieldByName('Access-Control-Allow-Methods', 'GET, OPTIONS');
    Response.SetFieldByName('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key');
end;

procedure THvacApi.RegisterRoutes(AHttpRouter: THttpRouter);
var 
    prefix, path:   string;
begin
    prefix := '/api/v' + IntToStr(Version);

    path := prefix + '/state';
    AHttpRouter.RegisterRoute(path, rmGet, @GetStateHandler);
    AHttpRouter.RegisterRoute(path, rmPut, @PutStateHandler);
    AHttpRouter.RegisterRoute(path, rmOptions, @OptionsStateHandler);

    path := prefix + '/enums';
    AHttpRouter.RegisterRoute(path, rmGet, @GetEnumsHandler);
    AHttpRouter.RegisterRoute(path, rmOptions, @OptionsEnumsHandler);
end;

end.