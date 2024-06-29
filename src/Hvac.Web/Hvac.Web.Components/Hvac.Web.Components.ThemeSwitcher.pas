unit Hvac.Web.Components.ThemeSwitcher;

{$mode objfpc}
{$LongStrings on}

interface

uses
    Web,
    Hvac.Web.Components.UIComponent;

type
    TUITheme = record
        Title: string;
        ClassName: string;
    end;

    TUIThemeArray = array of TUITheme;

    TThemeSwitcher = class(TUIComponent)
    private
        FSwitcherElement: TJSHtmlElement;
        FTheme: TUITheme;
        FThemes: TUIThemeArray;
        FTargetElement: TJSElement;
        FItemTemplate: TJSHtmlTemplateElement;
        FStorage: TJSStorage;
        procedure ChangeTheme(AIndex: integer);

    public
        property SwitcherElement: TJSHtmlElement read FSwitcherElement;
        property Themes: TUIThemeArray read FThemes;
        property Theme: TUITheme read FTheme;
        procedure AddTheme(ATheme: TUITheme); overload;
        procedure AddTheme(ATitle: string; AClassName: string); overload;
        constructor Create(
            AContainer: TJSElement;
            ATargetElement: TJSElement;
            ATemplate: TJSHtmlTemplateElement;
            AItemTemplate: TJSHtmlTemplateElement;
            AStorage: TJSStorage = nil);
    end;

implementation

uses
    SysUtils;

{ TThemeSwitcher }

constructor TThemeSwitcher.Create(
    AContainer: TJSElement;
    ATargetElement: TJSElement;
    ATemplate: TJSHtmlTemplateElement;
    AItemTemplate: TJSHtmlTemplateElement;
    AStorage: TJSStorage = nil);
begin
    inherited Create(AContainer);

    FStorage := AStorage;
    FTargetElement := ATargetElement;
    FItemTemplate := AItemTemplate;

    FSwitcherElement := TJSHtmlElement(ATemplate.Content.CloneNode(True).ChildNodes[1]);
    AContainer.AppendChild(FSwitcherElement);
end;

procedure TThemeSwitcher.AddTheme(ATheme: TUITheme);
var
    item, link: TJSHtmlElement;
begin
    SetLength(FThemes, Length(FThemes) + 1);
    FThemes[High(FThemes)] := ATheme;

    item := TJSHtmlElement(FItemTemplate.Content.CloneNode(True).ChildNodes[1]);
    item.QuerySelector('span').InnerText := ATheme.Title;

    link := TJSHtmlElement(item.QuerySelector('a'));
    link.SetAttribute('data-theme-index', IntToStr(High(FThemes)));

    link.OnClick := 
        function(AEvent: TJSMouseEvent): boolean
        var
            themeIndex: integer;
        begin
            themeIndex := StrToInt(TJSElement(AEvent.CurrentTarget).GetAttribute('data-theme-index'));
            ChangeTheme(themeIndex);

            if Assigned(FStorage) then
                FStorage.SetItem('Theme', FThemes[themeIndex].ClassName);

            result := true;
        end;

    FSwitcherElement.QuerySelector('ul').AppendChild(item);

    if Assigned(FStorage) and (FStorage.GetItem('Theme') = ATheme.ClassName) then
        ChangeTheme(High(FThemes))
    
    else if Length(FThemes) = 1 then
        ChangeTheme(0);
end;

procedure TThemeSwitcher.AddTheme(ATitle: string; AClassName: string);
var
    theme: TUITheme;
begin
    theme.Title := ATitle;
    theme.ClassName := AClassName;
    AddTheme(theme);
end;

procedure TThemeSwitcher.ChangeTheme(AIndex: integer);
var
    item: TJSElement;
begin
    if (AIndex < 0) or (AIndex > High(FThemes)) then
        exit;

    FTheme := FThemes[AIndex];
    FTargetElement.ClassName := FTheme.ClassName;

    item := FSwitcherElement.QuerySelector('.is-active');
    if Assigned(item) then
        item.ClassList.Remove('is-active');

    FSwitcherElement.QuerySelector(
        Format('ul li:nth-child(%d)', [AIndex + 1])
    ).ClassList.Add('is-active');
end;

end.
