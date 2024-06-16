program Hvac.Web;

{$mode objfpc}
{$modeswitch AdvancedRecords}
{$LongStrings on}

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

    TOption = record
        Value: string;
        Text: string;

        constructor Create(AValue: string; AText: string);
    end;

    TOptions = array of TOption;

var
    Settings: TSettings;

constructor TOption.Create(AValue: string; AText: string);
begin
    Value := AValue;
    Text := AText;
end;

procedure OnLoaded(AValue: JSValue); async;
var
    response: TJSResponse;
    content: string;

    dto: THvacStateDto;
begin
    response := TJSResponse(AValue);
    content := Await(response.text());

    dto := THvacStateDto.FromJson(content);

    document.getElementById('indoorTemperature').InnerText := FloatToStr(dto.IndoorTemperature);
    // TODO...
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

procedure PopulateSelect(selectId: string; options: TOptions);
var
    selectElement: TJSHtmlSelectElement;
    optionElement: TJSHtmlOptionElement;
    item: TOption;
begin
    selectElement := TJSHtmlSelectElement(
        Document.GetElementById(selectId)
    );
    selectElement.InnerHtml := string.Empty;

    for item in options do
    begin
        optionElement := TJSHtmlOptionElement(Document.CreateElement('option'));
        optionElement.Value := item.Value;
        optionElement.Text := item.Text;
        selectElement.AppendChild(optionElement);
    end;
end;


procedure InitControls();
begin
    PopulateSelect(
        'mode',
        [
            TOption.Create(Str(THvacMode.mdAuto), 'Auto'),
            TOption.Create(Str(THvacMode.mdCool), 'Cool'),
            TOption.Create(Str(THvacMode.mdDry), 'Dry'),
            TOption.Create(Str(THvacMode.mdFan), 'Fan'),
            TOption.Create(Str(THvacMode.mdHeat), 'Heat')
        ]
    );

    PopulateSelect(
        'temperatureScale',
        [
            TOption.Create(Str(TTemperatureScale.tsCelsius), 'C'),
            TOption.Create(Str(TTemperatureScale.tsFahrenheit), 'F')
        ]
    );

    PopulateSelect(
        'fanSpeed',
        [
            TOption.Create(Str(TFanSpeed.fsAuto), 'Auto'),
            TOption.Create(Str(TFanSpeed.fsLevel1), 'Level 1'),
            TOption.Create(Str(TFanSpeed.fsLevel2), 'Level 2'),
            TOption.Create(Str(TFanSpeed.fsLevel3), 'Level 3'),
            TOption.Create(Str(TFanSpeed.fsLevel4), 'Level 4'),
            TOption.Create(Str(TFanSpeed.fsLevel5), 'Level 5'),
            TOption.Create(Str(TFanSpeed.fsLevel6), 'Level 6')
        ]
    );

    PopulateSelect(
        'horizontalFlow',
        [
            TOption.Create(Str(THorizontalFlowMode.hfmStop), 'Stop'),
            TOption.Create(Str(THorizontalFlowMode.hfmSwing), 'Swing'),
            TOption.Create(Str(THorizontalFlowMode.hfmLeft), 'Left'),
            TOption.Create(Str(THorizontalFlowMode.hfmLeftCenter), 'Left / Center'),
            TOption.Create(Str(THorizontalFlowMode.hfmCenter), 'Center'),
            TOption.Create(Str(THorizontalFlowMode.hfmRightCenter), 'Right / Center'),
            TOption.Create(Str(THorizontalFlowMode.hfmRight), 'Right'),
            TOption.Create(Str(THorizontalFlowMode.hfmLeftRight), 'Left / Right'),
            TOption.Create(Str(THorizontalFlowMode.hfmSwingWide), 'Swing / Wide')
        ]
    );

    PopulateSelect(
        'verticalFlow',
        [
            TOption.Create(Str(TVerticalFlowMode.vfmStop), 'Stop'),
            TOption.Create(Str(TVerticalFlowMode.vfmSwing), 'Swing'),
            TOption.Create(Str(TVerticalFlowMode.vfmTop), 'Top'),
            TOption.Create(Str(TVerticalFlowMode.vfmTopCenter), 'Top / Center'),
            TOption.Create(Str(TVerticalFlowMode.vfmCenter), 'Center'),
            TOption.Create(Str(TVerticalFlowMode.vfmBottomCenter), 'Bottom / Center'),
            TOption.Create(Str(TVerticalFlowMode.vfmBottom), 'Bottom')
        ]
    );

    Document.GetElementById('btnRefresh').AddEventListener('click', @Refresh);
end;

procedure LoadSettings();
begin
    try
        Settings.ApiUrl := Window.LocalStorage.GetItem('ApiUrl');
    except
        Settings.ApiUrl := string.Empty;
    end;

    try
        Settings.ApiKey := Window.LocalStorage.GetItem('ApiKey');
    except
        Settings.ApiKey := string.Empty;
    end;

    if Settings.ApiUrl = string.Empty then
    begin
        Document.GetElementById('settingsSection').ClassList.Remove('is-hidden');
    end;
end;

begin
    //Settings.ApiUrl := 'https://lazyjones.ddns.net/hvac/api/v1';
    //Settings.ApiKey := 'cd26c1f8-92e5-4460-b79b-ca707e5d4cef-9ad54c9c-63da-450f-a69a-05da0ef9d304';

    InitControls();
    LoadSettings();
end.
