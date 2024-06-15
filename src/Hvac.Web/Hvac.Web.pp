program Hvac.Web;

{$mode objfpc}{$H+}

uses
    JS,
    FPJson,
    FPJsonJs,
    SysUtils,
    Web,
    Hvac.Models.Core,
    Hvac.Models.Domain,
    Hvac.Models.Dto;

const
    ApiUrl: string = 'https://lazyjones.ddns.net/hvac/api/v1';
    ApiKey: string = 'cd26c1f8-92e5-4460-b79b-ca707e5d4cef-9ad54c9c-63da-450f-a69a-05da0ef9d304';

procedure OnLoaded(AValue: JSValue); async;
var
    response: TJSResponse;
    content: string;

    dto: THvacStateDto;
begin
    response := TJSResponse(AValue);
    content := Await(response.text());
    Writeln('Loaded');
    Writeln(content);

    dto := THvacStateDto.FromJson(content);

    Writeln(dto.IndoorTemperature);
    Writeln(dto.Mode);

    document.getElementById('indoorTemperature').innerText := FloatToStr(dto.IndoorTemperature);

end;

procedure OnError(response: JSValue);
begin
    Writeln('Error');
end;

procedure Refresh();
var
    headers, options: TJSObject;
    url: string;
begin
    headers := TJSObject.New();
    headers['X-Api-Key'] := ApiKey;

    options := TJSObject.New();
    options['headers'] := Headers;

    url := ApiUrl + '/state';
    Window.Fetch(url, options)._then(
        function(response: JSValue): JSValue begin OnLoaded(response) end,
        function(response: JSValue): JSValue begin OnError(response) end
    );
end;

begin
    Writeln('Started');
    Document.GetElementById('btnRefresh').AddEventListener('click', @Refresh);
end.
