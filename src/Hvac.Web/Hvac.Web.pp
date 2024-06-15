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

type
    TSettings = record
        ApiUrl: string;
        ApiKey: string;
    end;

var
    Settings: TSettings;

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
    url := Settings.ApiUrl + '/state';
    options := new(['headers', new(['X-Api-Key', Settings.ApiKey])]);

    Window.Fetch(url, options)._then(
        function(response: JSValue): JSValue begin OnLoaded(response) end,
        function(response: JSValue): JSValue begin OnError(response) end
    );
end;

procedure InitControls();
var
    mode: THvacMode;
    selectElement: TJSHtmlSelectElement;
    optionElement: TJSHtmlOptionElement;
    item: TJSObject;
begin
    selectElement := TJSHtmlSelectElement(
        Document.GetElementById('mode')
    );
    selectElement.InnerHtml := '';

    optionElement := TJSHtmlOptionElement(Document.CreateElement('option'));
    item := new(['value', '0', 'text', 'Auto']);
    optionElement.Value := IntToStr(Ord(THvacMode.mdAuto));
    optionElement.Text := JS.ToString(item['text']);
    selectElement.AppendChild(optionElement);
end;

begin
    Settings.ApiUrl := 'https://lazyjones.ddns.net/hvac/api/v1';
    Settings.ApiKey := 'cd26c1f8-92e5-4460-b79b-ca707e5d4cef-9ad54c9c-63da-450f-a69a-05da0ef9d304';

    InitControls();
    Document.GetElementById('btnRefresh').AddEventListener('click', @Refresh);
end.
