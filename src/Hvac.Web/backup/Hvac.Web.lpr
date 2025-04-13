program Hvac.Web;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}
{$codepage UTF8}

uses
  SysUtils, Web, JS, FPJson, FPJsonJs,
  Hvac.Models.Domain,
  Hvac.Models.Dto,
  Hvac.Web.Core,
  Hvac.Web.UI;

var
  Settings: TSettings;
  UI: TUIState;

procedure OnError(AData: JSValue);
var
  Msg: String;
begin
  if AData is TJSResponse then
    Msg := TJSResponse(AData).StatusText
  else if AData is TJSError then
    Msg := TJSError(AData).Message
  else
    Msg := 'Unknown error';

  UI.ShowErrorMessage(Msg);
  UI.HideProgressBar;
  UI.EnableControls;
end;

procedure OnStateLoaded(AResponse: TJSResponse); async;
var
  State: THvacState;
begin
  if not AResponse.Ok then
  begin
    OnError(JSValue(AResponse));
    Exit;
  end;

  State := THvacStateDto.FromJson(Await(AResponse.Text)).ToHvacState;
  UI.SetState(State);
  UI.EnableControls;
  UI.HideProgressBar;
end;

procedure LoadState;
var
  Options: TJSObject;
const
  Endpoint = 'state';
begin
  UI.DisableControls;
  UI.ShowProgressBar;
  UI.HideErrorMessage;

  Options := new(['headers', new(['X-Api-Key', Settings.ApiKey])]);

  Window.Fetch(Format('%s/%s', [Settings.ApiUrl, Endpoint]), Options)._then(
    function(AResponse: JSValue): JSValue
    begin
      OnStateLoaded(TJSResponse(AResponse))
    end,
    function(AResponse: JSValue): JSValue
    begin
      OnError(TJSResponse(AResponse))
    end
  ).catch(
    function(AResponse: JSValue): JSValue
    begin
      OnError(TJSResponse(AResponse))
    end
  );
end;

procedure SaveState;
var
  State: THvacState;
  Options: TJSObject;
const
  Endpoint = 'state';
begin
  UI.ShowProgressBar;
  UI.DisableControls;
  UI.HideErrorMessage;

  State := UI.GetState;
  Options := new([
    'method', 'PUT',
    'headers', new([
      'X-Api-Key', Settings.ApiKey,
      'Content-Type', 'application/json']),
    'body', THvacStateDto.FromHvacState(state).ToJson
  ]);

  Window.Fetch(Format('%s/%s', [Settings.ApiUrl, Endpoint]), Options)._then(
    function(AResponse: JSValue): JSValue
    begin
      OnStateLoaded(TJSResponse(AResponse))
    end,
    function(AResponse: JSValue): JSValue
    begin
      OnError(TJSResponse(AResponse))
    end
  ).catch(
    function(AResponse: JSValue): JSValue
    begin
      OnError(TJSResponse(AResponse))
    end
  );
end;

function OnStateChange(AEvent: TEventListenerEvent): Boolean;
begin
  SaveState;
  Result := True;
end;

begin
  UI := TUIState.Create(Document);

  UI.SettingsForm.ThemeSwitcher.AddTheme('☀️', 'theme-light');
  UI.SettingsForm.ThemeSwitcher.AddTheme('🌙', 'theme-dark');

  UI.ReloadButton.AddEventListener('click', @LoadState);
  UI.OnChange := @OnStateChange;

  UI.SettingsForm.OnSave :=
    function(AEvent: TEventListenerEvent): Boolean
    begin
      Settings := UI.SettingsForm.Settings;
      UI.ChangeTab(tabControls);
      LoadState;
    end;

    Settings := UI.SettingsForm.Settings;

    if not Settings.ApiUrl.IsEmpty then
      LoadState
    else
      UI.ChangeTab(tabSettings);
end.
