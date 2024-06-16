unit Hvac.Web.UI;

{$mode objfpc}
{$LongStrings on}
{$modeswitch AdvancedRecords}

interface

uses
    Classes,
    JS,
    Web,
    SysUtils,
    StrUtils,
    TypInfo,
    Hvac.Models.Core,
    Hvac.Models.Domain;

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

    TUITab = (
        tabNone,
        tabControls,
        tabSettings,
        tabAbout
    );

    TUIState = class
        private
            FActiveTab: TUITab;
            FTabControls: TJSHtmlElement;
            FTabSettings: TJSHtmlElement;
            FTabAbout: TJSHtmlElement;
            FDocument: TJSDocument;
            FPowerOn: TJSHtmlInputElement;
            FPowerOff: TJSHtmlInputElement;
            FSettingsSection: TJSHtmlDivElement;
            FMainSection: TJSHtmlDivElement;
            FAboutSection: TJSHtmlDivElement;
            FControls: TJSHtmlDivElement;
            FSettingsApiUrl: TJSHtmlInputElement;
            FSettingsApiKey: TJSHtmlInputElement;
            FSettingsButtonSave: TJSHtmlButtonElement;
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
            FButtonReload: TJSHtmlButtonElement;
            FPorgressBar: TJSHtmlDivElement;
            FErrorMessage: TJSHtmlDivElement;
            FOnChange: TJSEventHandler;
            property Document: TJSDocument read FDocument write FDocument;
            procedure BindControls();
            procedure InitControls();
            procedure HookControlEventListeners();
            procedure SetActiveTab(AValue: TUITab);
            function OnStateChange(AEvent: TEventListenerEvent): boolean;

        public
            property ActiveTab: TUITab read FActiveTab write SetActiveTab;
            property TabControls: TJSHtmlElement read FTabControls write FTabControls;
            property TabSettings: TJSHtmlElement read FTabSettings write FTabSettings;
            property TabAbout: TJSHtmlElement read FTabAbout write FTabAbout;
            property SettingsSection: TJSHtmlDivElement read FSettingsSection write FSettingsSection;
            property MainSection: TJSHtmlDivElement read FMainSection write FMainSection;
            property AboutSection: TJSHtmlDivElement read FAboutSection write FAboutSection;
            property Controls: TJSHtmlDivElement read FControls write FControls;
            property SettingsApiUrl: TJSHtmlInputElement read FSettingsApiUrl write FSettingsApiUrl;
            property SettingsApiKey: TJSHtmlInputElement read FSettingsApiKey write FSettingsApiKey;
            property SettingsButtonSave: TJSHtmlButtonElement read FSettingsButtonSave write FSettingsButtonSave;
            property PowerOn: TJSHtmlInputElement read FPowerOn write FPowerOn;
            property PowerOff: TJSHtmlInputElement read FPowerOff write FPowerOff;
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
            property ButtonReload: TJSHtmlButtonElement read FButtonReload write FButtonReload;
            property ProgressBar: TJSHtmlDivElement read FPorgressBar write FPorgressBar;
            property ErrorMessage: TJSHtmlDivElement read FErrorMessage write FErrorMessage;
            property OnChange: TJSEventHandler read FOnChange write FOnChange;
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

{ TOption }

constructor TOption.Create(AValue: string; AText: string);
begin
    Value := AValue;
    Text := AText;
end;

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
    Controls := TJSHtmlDivElement(Document.GetElementById('controls'));
    ProgressBar := TJSHtmlDivElement(Document.GetElementById('progressBar'));
    ErrorMessage := TJSHtmlDivElement(Document.GetElementById('errorMessage'));

    SettingsApiUrl := TJSHtmlInputElement(Document.GetElementById('settingsApiUrl'));
    SettingsApiKey := TJSHtmlInputElement(Document.GetElementById('settingsApiKey'));
    SettingsButtonSave := TJSHtmlButtonElement(Document.GetElementById('btnSettingsSave'));

    PowerOn := TJSHtmlInputElement(Document.GetElementById('powerOn'));
    PowerOff := TJSHtmlInputElement(Document.GetElementById('powerOff'));
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

    ButtonReload := TJSHtmlButtonElement(Document.GetElementById('btnReload'));

    TabSettings := TJSHtmlElement(Document.GetElementById('tabSettings'));
    TabControls := TJSHtmlElement(Document.GetElementById('tabControls'));
    TabAbout := TJSHtmlElement(Document.GetElementById('tabAbout'));
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

    TabControls.QuerySelectorAll('a').ForEach(
        procedure(ANode: TJSNode; AIndex: NativeInt; ANodeList: TJSNodeList)
        begin
            if ANode is TJSHtmlElement then
                TJSHtmlElement(ANode).OnClick := 
                    function(AEvent: TJSMouseEvent): boolean
                    begin
                        ActiveTab := TUITab.TabControls;
                    end;
        end
    );

    TabSettings.QuerySelectorAll('a').ForEach(
        procedure(ANode: TJSNode; AIndex: NativeInt; ANodeList: TJSNodeList)
        begin
            if ANode is TJSHtmlElement then
                TJSHtmlElement(ANode).OnClick :=
                    function(AEvent: TJSMouseEvent): boolean
                    begin
                        ActiveTab := TUITab.tabSettings;
                    end
        end
    );

    TabAbout.QuerySelectorAll('a').ForEach(
        procedure(ANode: TJSNode; AIndex: NativeInt; ANodeList: TJSNodeList)
        begin
            if ANode is TJSHtmlElement then
                TJSHtmlElement(ANode).OnClick :=
                    function(AEvent: TJSMouseEvent): boolean
                    begin
                        ActiveTab := TUITab.tabAbout;
                    end
        end
    );     
end;

procedure TUIState.SetState(AState: THvacState);
begin
    PowerOn.Checked := AState.Power;
    PowerOff.Checked := not AState.Power;
    
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
    result.Power := PowerOn.Checked;
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
    ErrorMessage.InnerText := AError;
end;

procedure TUIState.HideErrorMessage();
begin
    ErrorMessage.InnerText := string.Empty;
end;

procedure TUIState.SetActiveTab(AValue: TUITab);
    procedure HideSections();
    var
        item: JSValue;
    begin
        for item in TJSArray._of(MainSection, SettingsSection, AboutSection) do
            if item is TJSHtmlElement then
                TJSHtmlElement(item).ClassList.Add('is-hidden');
    end;

    procedure DeactivateTabs();
    var
        item: JSValue;
    begin
        for item in TJSArray._of(TabControls, TabSettings, TabAbout) do
            if item is TJSHtmlElement then
                TJSHtmlElement(item).ClassList.Remove('is-active');
    end;
begin
    if FActiveTab = AValue then
        exit;

    FActiveTab := AValue;

    HideSections();
    DeactivateTabs();    

    case ActiveTab of
        TUITab.tabControls:
            begin
                MainSection.ClassList.Remove('is-hidden');
                TabControls.ClassList.Add('is-active');
            end;

        TUITab.tabSettings:
            begin
                SettingsSection.ClassList.Remove('is-hidden');
                TabSettings.ClassList.Add('is-active');
            end;

        TUITab.tabAbout:
            begin
                AboutSection.ClassList.Remove('is-hidden');
                TabAbout.ClassList.Add('is-active');
            end;
    end;
end;

end.