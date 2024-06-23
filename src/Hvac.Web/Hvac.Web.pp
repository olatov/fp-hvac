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
    Hvac.Models.Domain,
    Hvac.Models.Dto,
    Hvac.Web.Core,
    Hvac.Web.UI;

var
    Settings: TSettings;
    UI: TUIState;

procedure OnError(AData: JSValue);
var
    msg: string;
begin
    if AData is TJSResponse then
        msg := TJSResponse(AData).StatusText
    else if AData is TJSError then
        msg := TJSError(AData).Message
    else
        msg := 'Unknown error';

    UI.ShowErrorMessage(msg);
    UI.HideProgressBar();
    UI.EnableControls();
end;

procedure OnStateLoaded(AResponse: TJSResponse); async;
var
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
const
    endpoint = 'state';
begin
    UI.DisableControls();
    UI.ShowProgressBar();
    UI.HideErrorMessage();

    options := new(['headers', new(['X-Api-Key', Settings.ApiKey])]);

    Window.Fetch(Format('%s/%s', [Settings.ApiUrl, endpoint]), options)._then(
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
const
    endpoint = 'state';
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

    Window.Fetch(Format('%s/%s', [Settings.ApiUrl, endpoint]), options)._then(
        function(response: JSValue): JSValue begin OnStateLoaded(TJSResponse(response)) end,
        function(response: JSValue): JSValue begin OnError(TJSResponse(response)) end
    ).catch(
        function(response: JSValue): JSValue begin OnError(TJSResponse(response)) end
    );
end;

function OnStateChange(AEvent: TEventListenerEvent): boolean;
begin
    SaveState();
    result := true;
end;

begin
    UI := TUIState.Create(Document);

    UI.SettingsForm.ThemeSwitcher.AddTheme('☀️', 'theme-light');
    UI.SettingsForm.ThemeSwitcher.AddTheme('🌙', 'theme-dark');

    UI.ReloadButton.AddEventListener('click', @LoadState);
    UI.OnChange := @OnStateChange;

    UI.SettingsForm.OnSave :=
        function(AEvent: TEventListenerEvent): boolean
        begin
            Settings := UI.SettingsForm.Settings;
            UI.ChangeTab(tabControls);
            LoadState();
        end;

    Settings := UI.SettingsForm.Settings;

    if (Assigned(Settings.ApiUrl)) and (not string.IsNullOrWhiteSpace(Settings.ApiUrl)) then
        LoadState()
    else
        UI.ChangeTab(tabSettings);
end.
