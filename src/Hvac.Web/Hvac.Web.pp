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
    Hvac.Models.Dto,
    Hvac.Web.UI;

var
    Settings: TSettings;
    UI: TUIState;

procedure OnError(response: JSValue);
begin
    UI.ShowErrorMessage('Error!');
    UI.HideProgressBar();
    UI.EnableControls();
end;

procedure OnStateLoaded(AResponse: TJSResponse); async;
var
    content: string;

    state: THvacState;
begin
    if not AResponse.Ok then
    begin
        OnError(JSValue(AResponse));
        exit;
    end;

    state := THvacStateDto
        .FromJson(Await(AResponse.text()))
        .ToHvacState();

    UI.SetState(state);
    UI.EnableControls();
    UI.HideProgressBar();
end;

procedure LoadState();
var
    options: TJSObject;
    url: string;
begin
    UI.DisableControls();
    UI.ShowProgressBar();
    UI.HideErrorMessage();

    url := Settings.ApiUrl + '/state';
    options := new(['headers', new(['X-Api-Key', Settings.ApiKey])]);

    Window.Fetch(url, options)._then(
        function(response: JSValue): JSValue begin OnStateLoaded(TJSResponse(response)) end,
        function(response: JSValue): JSValue begin OnError(TJSResponse(response)) end
    ).catch(
        function(response: JSValue): JSValue begin OnError(TJSResponse(response)) end
    );
end;

procedure SaveState();
var
    state: THvacState;
    options: TJSObject;
begin
    UI.ShowProgressBar();
    UI.DisableControls();
    UI.HideErrorMessage();

    state := UI.GetState();
    options := new([
        'method', 'PUT',
        'headers', new([
            'X-Api-Key', Settings.ApiKey,
            'Content-Type', 'application/json']),
        'body', THvacStateDto.FromHvacState(state).ToJson()
    ]);

    Window.Fetch(Format('%s/%s', [Settings.ApiUrl, 'state']), options)._then(
        function(response: JSValue): JSValue begin LoadState() end,
        function(response: JSValue): JSValue begin OnError(TJSResponse(response)) end
    ).catch(
        function(response: JSValue): JSValue begin OnError(TJSResponse(response)) end
    );
end;

procedure OpenSettings();
begin
    UI.SettingsApiUrl.Value := Settings.ApiUrl;
    UI.SettingsApiKey.Value := Settings.ApiKey;

    UI.HideMainSection();
    UI.ShowSettingsSection();
end;

procedure SaveSettings();
var
    apiKeyElement: TJSHtmlInputElement;
begin
    Settings.ApiUrl := UI.SettingsApiUrl.Value;
    Settings.ApiKey := UI.SettingsApiKey.Value;

    Window.LocalStorage.SetItem('ApiUrl', Settings.ApiUrl);
    Window.LocalStorage.SetItem('ApiKey', Settings.ApiKey);

    UI.ActiveTab := tabControls;
    LoadState();
end;

procedure LoadSettings();
begin
    Settings.ApiUrl := Window.LocalStorage.GetItem('ApiUrl');
    Settings.ApiKey := Window.LocalStorage.GetItem('ApiKey');

    UI.SettingsApiUrl.Value := Settings.ApiUrl;
    UI.SettingsApiKey.Value := Settings.ApiKey;
end;

function OnStateChange(AEvent: TEventListenerEvent): boolean;
begin
    SaveState();
    result := true;
end;

begin
    UI := TUIState.Create(Document);
    UI.ButtonReload.AddEventListener('click', @LoadState);
    UI.SettingsButtonSave.AddEventListener('click', @SaveSettings);
    UI.OnChange := @OnStateChange;

    LoadSettings();

    if (Assigned(Settings.ApiUrl)) and (not string.IsNullOrWhiteSpace(Settings.ApiUrl)) then
    begin
        UI.ActiveTab := tabControls;
        LoadState();
    end else
        UI.ActiveTab := tabSettings;
end.
