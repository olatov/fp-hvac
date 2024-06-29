unit Hvac.Web.Components.SettingsForm;

{$mode objfpc}
{$LongStrings on}

interface

uses
    Web,
    Hvac.Web.Core,
    Hvac.Web.Components.UIComponent,
    Hvac.Web.Components.ThemeSwitcher;

type
    TSettingsForm = class(TUIComponent)
    private
        FElement: TJSHtmlElement;
        FApiUrlInput: TJSHTMLInputElement;
        FApiKeyInput: TJSHTMLInputElement;
        FSaveButton: TJSHTMLButtonElement;
        FStorage: TJSStorage;
        FThemeSwitcher: TThemeSwitcher;
        FOnSave: TJSEventHandler;
        function GetSettings(): TSettings;

    public
        property Element: TJSHtmlElement read FElement;
        property ApiUrlInput: TJSHTMLInputElement read FApiUrlInput;
        property ApiKeyInput: TJSHTMLInputElement read FApiKeyInput;
        property ThemeSwitcher: TThemeSwitcher read FThemeSwitcher;
        property SaveButton: TJSHTMLButtonElement read FSaveButton;
        property OnSave: TJSEventHandler read FOnSave write FOnSave;
        property Settings: TSettings read GetSettings;
        constructor Create(
            AContainer: TJSElement;
            ATemplate: TJSHtmlTemplateElement;
            AStorage: TJSStorage = nil);
    end;

implementation

{ TSettingsForm }

constructor TSettingsForm.Create(
    AContainer: TJSElement;
    ATemplate: TJSHtmlTemplateElement;
    AStorage: TJSStorage = nil);
begin
    inherited Create(AContainer);

    FStorage := AStorage;

    FElement := TJSHtmlElement(ATemplate.Content.CloneNode(True).ChildNodes[1]);
    FApiUrlInput := TJSHTMLInputElement(FElement.QuerySelector('.input-api-url'));
    FApiKeyInput := TJSHTMLInputElement(FElement.QuerySelector('.input-api-key'));
    FSaveButton := TJSHTMLButtonElement(FElement.QuerySelector('.button-api-save'));

    FThemeSwitcher := TThemeSwitcher.Create(
        FElement.QuerySelector('.theme-switcher'),
        Document.QuerySelector('html'),
        TJSHTMLTemplateElement(Document.GetElementById('themeSwitcherTemplate')),
        TJSHtmlTemplateElement(Document.GetElementById('themeSwitcherItemTemplate')),
        Window.LocalStorage);    

    AContainer.AppendChild(FElement);

    if Assigned(FStorage) then
    begin
        FApiUrlInput.Value := FStorage.getItem('ApiUrl');
        FApiKeyInput.Value := FStorage.getItem('ApiKey');
    end;

    FSaveButton.OnClick := 
        function(AEvent: TJSMouseEvent): boolean
        begin
            if Assigned(FStorage) then
            begin
                FStorage.setItem('ApiUrl', FApiUrlInput.Value);
                FStorage.setItem('ApiKey', FApiKeyInput.Value);
            end;

            if Assigned(FOnSave) then
                FOnSave(TEventListenerEvent.New('save'));
        end;
end;

function TSettingsForm.GetSettings(): TSettings;
begin
    result.ApiUrl := FApiUrlInput.Value;
    result.ApiKey := FApiKeyInput.Value;
end;

end.
