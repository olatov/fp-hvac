unit Hvac.Web.UI;

{$mode objfpc}
{$LongStrings on}
{$modeswitch AdvancedRecords}

interface

uses
    Classes,
    Web,
    Hvac.Types.Core,
    Hvac.Models.Domain,
    Hvac.Web.Core,
    Hvac.Web.Components.SettingsForm,
    Hvac.Web.Components.Tabs;

type
    TUIState = class
    private
        FPower: boolean;
        FTabs: TTabs;
        FDocument: TJSDocument;
        FSettingsForm: TSettingsForm;
        FPowerButton: TJSHtmlButtonElement;
        FSettingsSection: TJSHtmlDivElement;
        FMainSection: TJSHtmlDivElement;
        FAboutSection: TJSHtmlDivElement;
        FErrorSection: TJSHtmlDivElement;
        FControls: TJSHtmlDivElement;
        FIndoorTemperature: TJSHtmlDivElement;
        FDesiredTemperature: TJSHtmlInputElement;
        FMode: TJSHtmlSelectElement;
        FTemperatureScale: TJSHtmlSelectElement;
        FFanSpeed: TJSHtmlSelectElement;
        FHorizontalFlow: TJSHtmlSelectElement;
        FVerticalFlow: TJSHtmlSelectElement;
        FTurbo: TJSHtmlInputElement;
        FQuiet: TJSHtmlInputElement;
        FDisplay: TJSHtmlInputElement;
        FHealth: TJSHtmlInputElement;
        FDrying: TJSHtmlInputElement;
        FSleep: TJSHtmlInputElement;
        FEco: TJSHtmlInputElement;
        FReloadButton: TJSHtmlButtonElement;
        FPorgressBar: TJSHtmlDivElement;
        FOnChange: TJSEventHandler;
        property Document: TJSDocument read FDocument write FDocument;
        procedure BindControls();
        procedure InitControls();
        procedure HookControlEventListeners();
        procedure UpdatePowerButton();            
        function OnStateChange(AEvent: TEventListenerEvent): boolean;

    public
        property Tabs: TTabs read FTabs write FTabs;
        property SettingsSection: TJSHtmlDivElement read FSettingsSection write FSettingsSection;
        property MainSection: TJSHtmlDivElement read FMainSection write FMainSection;
        property AboutSection: TJSHtmlDivElement read FAboutSection write FAboutSection;
        property ErrorSection: TJSHtmlDivElement read FErrorSection write FErrorSection;
        property Controls: TJSHtmlDivElement read FControls write FControls;
        property SettingsForm: TSettingsForm read FSettingsForm write FSettingsForm;
        property PowerButton: TJSHtmlButtonElement read FPowerButton write FPowerButton;
        property IndoorTemperature: TJSHtmlDivElement read FIndoorTemperature write FIndoorTemperature;
        property DesiredTemperature: TJSHtmlInputElement read FDesiredTemperature write FDesiredTemperature;
        property Mode: TJSHtmlSelectElement read FMode write FMode;
        property TemperatureScale: TJSHtmlSelectElement read FTemperatureScale write FTemperatureScale;
        property FanSpeed: TJSHtmlSelectElement read FFanSpeed write FFanSpeed;
        property HorizontalFlow: TJSHtmlSelectElement read FHorizontalFlow write FHorizontalFlow;
        property VerticalFlow: TJSHtmlSelectElement read FVerticalFlow write FVerticalFlow;
        property Turbo: TJSHtmlInputElement read FTurbo write FTurbo;
        property Quiet: TJSHtmlInputElement read FQuiet write FQuiet;
        property Display: TJSHtmlInputElement read FDisplay write FDisplay;
        property Health: TJSHtmlInputElement read FHealth write FHealth;
        property Drying: TJSHtmlInputElement read FDrying write FDrying;
        property Sleep: TJSHtmlInputElement read FSleep write FSleep;
        property Eco: TJSHtmlInputElement read FEco write FEco;
        property ReloadButton: TJSHtmlButtonElement read FReloadButton write FReloadButton;
        property ProgressBar: TJSHtmlDivElement read FPorgressBar write FPorgressBar;
        property OnChange: TJSEventHandler read FOnChange write FOnChange;
        procedure ChangeTab(ATabIndex: TUITabIndex);
        procedure SetState(AState: THvacState);
        function GetState(): THvacState;
        procedure EnableControls();
        procedure DisableControls();
        procedure ShowProgressBar();
        procedure HideProgressBar();
        procedure ShowErrorMessage(AError: string);
        procedure HideErrorMessage();
        constructor Create(ADocument: TJSDocument);
    end;

implementation

uses
    SysUtils,
    StrUtils,
    TypInfo;

{ TUIState }

constructor TUIState.Create(ADocument: TJSDocument);
begin
    Document := ADocument;
    BindControls();
    InitControls();
    HookControlEventListeners();
end;

procedure TUIState.BindControls();
begin
    SettingsSection := TJSHtmlDivElement(Document.GetElementById('settingsSection'));
    MainSection := TJSHtmlDivElement(Document.GetElementById('mainSection'));
    AboutSection := TJSHtmlDivElement(Document.GetElementById('aboutSection'));
    ErrorSection := TJSHtmlDivElement(Document.GetElementById('errorSection'));
    Controls := TJSHtmlDivElement(Document.GetElementById('controls'));
    ProgressBar := TJSHtmlDivElement(Document.GetElementById('progressBar'));

    ReloadButton := TJSHtmlButtonElement(Document.GetElementById('btnReload'));
    PowerButton := TJSHtmlButtonElement(Document.GetElementById('btnPower'));    

    SettingsForm := TSettingsForm.Create(
        SettingsSection,
        TJSHtmlTemplateElement(Document.GetElementById('settingsFormTemplate')),
        Window.LocalStorage);

    IndoorTemperature := TJSHtmlDivElement(Document.GetElementById('indoorTemperature'));
    Mode := TJSHtmlSelectElement(Document.GetElementById('mode'));
    TemperatureScale := TJSHtmlSelectElement(Document.GetElementById('temperatureScale'));
    FanSpeed := TJSHtmlSelectElement(Document.GetElementById('fanSpeed'));
    HorizontalFlow := TJSHtmlSelectElement(Document.GetElementById('horizontalFlow'));
    VerticalFlow := TJSHtmlSelectElement(Document.GetElementById('verticalFlow'));
    DesiredTemperature := TJSHtmlInputElement(Document.GetElementById('desiredTemperature'));
    Turbo := TJSHtmlInputElement(Document.GetElementById('turbo'));
    Quiet := TJSHtmlInputElement(Document.GetElementById('quiet'));
    Display := TJSHtmlInputElement(Document.GetElementById('display'));
    Health := TJSHtmlInputElement(Document.GetElementById('health'));
    Drying := TJSHtmlInputElement(Document.GetElementById('drying'));
    Sleep := TJSHtmlInputElement(Document.GetElementById('sleep'));
    Eco := TJSHtmlInputElement(Document.GetElementById('eco'));

    Tabs := TTabs.Create(
        Document.GetElementById('tabs'),
        TJSHTMLTemplateElement(Document.GetElementById('tabsTemplate')),
        TJSHTMLTemplateElement(Document.GetElementById('tabItemTemplate')));
end;

procedure TUIState.InitControls();
    procedure PopulateSelect(ASelect: TJSHtmlSelectElement; AOptions: array of TOption);
    var
        optionElement: TJSHtmlOptionElement;
        item: TOption;
    begin
        ASelect.InnerHtml := string.Empty;

        for item in AOptions do
        begin
            optionElement := TJSHtmlOptionElement(Document.CreateElement('option'));
            optionElement.Value := item.Value;
            optionElement.Text := item.Text;
            ASelect.AppendChild(optionElement);
        end;
    end;

begin
    Tabs.AddTab('Controls', MainSection);
    Tabs.AddTab('Settings', SettingsSection);
    Tabs.AddTab('About', AboutSection);

    PopulateSelect(
        Mode,
        [
            TOption.Create(Str(THvacMode.mdAuto), 'Auto'),
            TOption.Create(Str(THvacMode.mdCool), 'Cool'),
            TOption.Create(Str(THvacMode.mdDry), 'Dry'),
            TOption.Create(Str(THvacMode.mdFan), 'Fan'),
            TOption.Create(Str(THvacMode.mdHeat), 'Heat')
        ]
    );

    PopulateSelect(
        TemperatureScale,
        [
            TOption.Create(Str(TTemperatureScale.tsCelsius), '°C'),
            TOption.Create(Str(TTemperatureScale.tsFahrenheit), '°F')
        ]
    );

    PopulateSelect(
        FanSpeed,
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
        HorizontalFlow,
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
        VerticalFlow,
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
end;

procedure TUIState.HookControlEventListeners();
begin
    Controls.QuerySelectorAll('input, select').ForEach(
        procedure(ANode: TJSNode; AIndex: NativeInt; ANodeList: TJSNodeList)
        begin
            if ANode is TJSElement then
                TJSElement(ANode).AddEventListener('change', @OnStateChange);
        end
    );

    PowerButton.AddEventListener('click',
        function(AEvent: TJSMouseEvent): boolean
        begin
            FPower := not FPower;
            UpdatePowerButton();
            OnStateChange(AEvent);
        end);
end;

procedure TUIState.SetState(AState: THvacState);
begin
    FPower := AState.Power;
    UpdatePowerButton();
    
    IndoorTemperature.InnerText := Format(
        '%.1f %s',
        [
            AState.IndoorTemperature,
            IfThen(AState.TemperatureScale = TTemperatureScale.tsCelsius, '°C', '°F')
        ]
    );

    DesiredTemperature.Value := Str(AState.DesiredTemperature);
    Mode.Value := Str(AState.Mode);
    TemperatureScale.Value := Str(AState.TemperatureScale);
    FanSpeed.Value := Str(AState.FanSpeed);
    HorizontalFlow.Value := Str(AState.HorizontalFlowMode);
    VerticalFlow.Value := Str(AState.VerticalFlowMode);
    
    Turbo.Checked := AState.Turbo;
    Quiet.Checked := AState.Quiet;
    Display.Checked := AState.Display;
    Health.Checked := AState.Health;
    Drying.Checked := AState.Drying;
    Sleep.Checked := AState.Sleep;
    Eco.Checked := AState.Eco;
end;

function TUIState.GetState(): THvacState;
begin
    result.Power := FPower;
    result.DesiredTemperature := StrToInt(DesiredTemperature.Value);

    result.Mode := THvacMode(
        GetEnumValue(TypeInfo(THvacMode), Mode.Value));

    result.TemperatureScale := TTemperatureScale(
        GetEnumValue(TypeInfo(TTemperatureScale), TemperatureScale.Value));

    result.FanSpeed := TFanSpeed(
        GetEnumValue(TypeInfo(TFanSpeed), FanSpeed.Value));

    result.HorizontalFlowMode := THorizontalFlowMode(
        GetEnumValue(TypeInfo(THorizontalFlowMode), HorizontalFlow.Value));

    result.VerticalFlowMode := TVerticalFlowMode(
        GetEnumValue(TypeInfo(TVerticalFlowMode), VerticalFlow.Value));
    
    result.Turbo := Turbo.Checked;
    result.Quiet := Quiet.Checked;
    result.Display := Display.Checked;
    result.Health := Health.Checked;
    result.Drying := Drying.Checked;
    result.Sleep := Sleep.Checked;
    result.Eco := Eco.Checked;
end;

procedure TUIState.ShowProgressBar();
begin
    ProgressBar.ClassList.Remove('is-hidden');
end;

procedure TUIState.HideProgressBar();
begin
    ProgressBar.ClassList.Add('is-hidden');
end;

procedure TUIState.EnableControls();
begin
    Controls.QuerySelectorAll('input, select, button').ForEach(
        procedure(ANode: TJSNode; AIndex: NativeInt; ANodeList: TJSNodeList)
        begin
            if ANode is TJSElement then
                TJSElement(ANode).RemoveAttribute('disabled');
        end
    );
end;

procedure TUIState.DisableControls();
begin
    Controls.QuerySelectorAll('input, select, button').ForEach(
        procedure(ANode: TJSNode; AIndex: NativeInt; ANodeList: TJSNodeList)
        begin
            if ANode is TJSElement then
                TJSElement(ANode).SetAttribute('disabled', 'true');
        end
    );

    IndoorTemperature.InnerText := '--';
end;

function TUIState.OnStateChange(AEvent: TEventListenerEvent): boolean;
begin
    if Assigned(OnChange) then
        OnChange(AEvent);

    result := true;
end;

procedure TUIState.ShowErrorMessage(AError: string);
begin
    ErrorSection.QuerySelector('.message-body').InnerText := AError;
    ErrorSection.ClassList.Remove('is-hidden');
end;

procedure TUIState.HideErrorMessage();
begin
    ErrorSection.QuerySelector('.message-body').InnerText := string.Empty;
    ErrorSection.ClassList.Add('is-hidden');
end;

procedure TUIState.ChangeTab(ATabIndex: TUITabIndex);
begin
    Tabs.ChangeTab(Ord(ATabIndex));
end;

procedure TUIState.UpdatePowerButton();
const
    CssClass = 'is-link';
begin
    if FPower then
        PowerButton.ClassList.Add(CssClass)
    else
        PowerButton.ClassList.Remove(CssClass);
end;

end.