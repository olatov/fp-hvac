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
    content: string;

    state: THvacState;
begin
    state := THvacStateDto
        .FromJson(Await(TJSResponse(AValue).text()))
        .ToHvacState();

    TJSHtmlInputElement(Document.GetElementById('powerOn')).Checked := state.Power;
    TJSHtmlInputElement(Document.GetElementById('powerOff')).Checked := not state.Power;
    TJSHtmlSelectElement(Document.GetElementById('mode')).Value := Str(state.Mode);
    TJSHtmlSelectElement(Document.GetElementById('fanSpeed')).Value := Str(state.FanSpeed);
    TJSHtmlSelectElement(Document.GetElementById('temperatureScale')).Value := Str(state.TemperatureScale);
    TJSHtmlSelectElement(Document.GetElementById('horizontalFlow')).Value := Str(state.HorizontalFlowMode);
    TJSHtmlSelectElement(Document.GetElementById('verticalFlow')).Value := Str(state.VerticalFlowMode);

    TJSHtmlInputElement(Document.GetElementById('desiredTemperature')).Value := Str(state.DesiredTemperature);
    Document.GetElementById('indoorTemperature').InnerText := FloatToStr(state.IndoorTemperature);

    TJSHtmlInputElement(Document.GetElementById('turbo')).Checked := state.Turbo;
    TJSHtmlInputElement(Document.GetElementById('quiet')).Checked := state.Quiet;
    TJSHtmlInputElement(Document.GetElementById('display')).Checked := state.Display;
    TJSHtmlInputElement(Document.GetElementById('health')).Checked := state.Health;
    TJSHtmlInputElement(Document.GetElementById('drying')).Checked := state.Drying;
    TJSHtmlInputElement(Document.GetElementById('sleep')).Checked := state.Sleep;
    TJSHtmlInputElement(Document.GetElementById('eco')).Checked := state.Eco;

    Document.GetElementById('controls').ClassList.Remove('is-hidden');
    Document.GetElementById('progressBar').ClassList.Add('is-hidden');
end;

procedure OnError(response: JSValue);
begin
    Writeln('Error');
    Document.GetElementById('controls').ClassList.Remove('is-hidden');
    Document.GetElementById('progressBar').ClassList.Add('is-hidden');
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

    Document.GetElementById('controls').ClassList.Add('is-hidden');
    Document.GetElementById('progressBar').ClassList.Remove('is-hidden');
end;

procedure OpenSettings();
begin
    TJSHtmlInputElement(Document.GetElementById('apiUrl')).Value := Settings.ApiUrl;
    TJSHtmlInputElement(Document.GetElementById('apiKey')).Value := Settings.ApiKey;

    Document.GetElementById('controlsSection').ClassList.Add('is-hidden');
    Document.GetElementById('settingsSection').ClassList.Remove('is-hidden');
end;

procedure CloseSettings();
begin
    Document.GetElementById('controlsSection').ClassList.Remove('is-hidden');
    Document.GetElementById('settingsSection').ClassList.Add('is-hidden');
end;

procedure SaveSettings();
var
    apiKeyElement: TJSHtmlInputElement;
begin
    Settings.ApiUrl := TJSHtmlInputElement(Document.GetElementById('apiUrl')).Value;

    apiKeyElement := TJSHtmlInputElement(Document.GetElementById('apiKey'));
    Settings.ApiKey := apiKeyElement.Value;
    apiKeyElement.Value := string.Empty;

    Window.LocalStorage.SetItem('ApiUrl', Settings.ApiUrl);
    Window.LocalStorage.SetItem('ApiKey', Settings.ApiKey);

    CloseSettings();
    Refresh();
end;

procedure CancelSettings();
begin
    CloseSettings();
end;

procedure LoadSettings();
begin
    Settings.ApiUrl := Window.LocalStorage.GetItem('ApiUrl');
    Settings.ApiKey := Window.LocalStorage.GetItem('ApiKey');
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
            TOption.Create(Str(TTemperatureScale.tsCelsius), '°C'),
            TOption.Create(Str(TTemperatureScale.tsFahrenheit), '°F')
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

    Document.GetElementById('btnOpenSettings').AddEventListener('click', @OpenSettings);
    Document.GetElementById('btnRefresh').AddEventListener('click', @Refresh);

    Document.GetElementById('btnSettingsSave').AddEventListener('click', @SaveSettings);
    Document.GetElementById('btnSettingsCancel').AddEventListener('click', @CancelSettings);
end;

begin
    //Settings.ApiUrl := 'https://lazyjones.ddns.net/hvac/api/v1';
    //Settings.ApiKey := 'cd26c1f8-92e5-4460-b79b-ca707e5d4cef-9ad54c9c-63da-450f-a69a-05da0ef9d304';

    InitControls();
    LoadSettings();

    if (Assigned(Settings.ApiUrl)) and (not string.IsNullOrWhiteSpace(Settings.ApiUrl)) then
        Refresh()
    else
        OpenSettings();
end.
