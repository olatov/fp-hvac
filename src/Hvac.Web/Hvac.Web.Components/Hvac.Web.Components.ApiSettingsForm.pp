unit Hvac.Web.Components.ApiSettingsForm;

{$mode objfpc}
{$LongStrings on}

interface

uses
    Web,
    Hvac.Web.Core,
    Hvac.Web.Components.UIComponent;

type
    TApiSettingsForm = class(TUIComponent)
        private
            FElement: TJSHtmlElement;
            FUrlInput: TJSHTMLInputElement;
            FKeyInput: TJSHTMLInputElement;
            FSaveButton: TJSHTMLButtonElement;
            FStorage: TJSStorage;
            FOnSave: TJSEventHandler;
            function GetApiSettings(): TApiSettings;

        public
            property Element: TJSHtmlElement read FElement;
            property UrlInput: TJSHTMLInputElement read FUrlInput;
            property KeyInput: TJSHTMLInputElement read FKeyInput;
            property SaveButton: TJSHTMLButtonElement read FSaveButton;
            property OnSave: TJSEventHandler read FOnSave write FOnSave;
            property ApiSettings: TApiSettings read GetApiSettings;
            constructor Create(
                AContainer: TJSElement;
                ATemplate: TJSHtmlTemplateElement;
                AStorage: TJSStorage = nil);
    end;

implementation

{ TApiSettingsForm }

constructor TApiSettingsForm.Create(
    AContainer: TJSElement;
    ATemplate: TJSHtmlTemplateElement;
    AStorage: TJSStorage = nil);
begin
    inherited Create(AContainer);

    FStorage := AStorage;

    FElement := TJSHtmlElement(ATemplate.Content.CloneNode(True).ChildNodes[1]);
    FUrlInput := TJSHTMLInputElement(FElement.QuerySelector('.input-api-url'));
    FKeyInput := TJSHTMLInputElement(FElement.QuerySelector('.input-api-key'));
    FSaveButton := TJSHTMLButtonElement(FElement.QuerySelector('.button-api-save'));
    AContainer.AppendChild(FElement);

    if Assigned(FStorage) then
    begin
        FUrlInput.Value := FStorage.getItem('ApiUrl');
        FKeyInput.Value := FStorage.getItem('ApiKey');
    end;

    FSaveButton.OnClick := 
        function(AEvent: TJSMouseEvent): boolean
        begin
            if Assigned(FStorage) then
            begin
                FStorage.setItem('ApiUrl', FUrlInput.Value);
                FStorage.setItem('ApiKey', FKeyInput.Value);
            end;

            if Assigned(FOnSave) then
                FOnSave(TEventListenerEvent.New('save'));
        end;
end;

function TApiSettingsForm.GetApiSettings(): TApiSettings;
begin
    result.Url := FUrlInput.Value;
    result.Key := FKeyInput.Value;
end;

end.
