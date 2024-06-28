unit Hvac.Web.Components.Tabs;

{$mode objfpc}
{$LongStrings on}

interface

uses
    Web,
    Hvac.Web.Components.UIComponent;

type
    TTab = record
        Title: string;
        Element: TJSElement;
    end;

    TTabArray = array of TTab;

    TTabs = class(TUIComponent)
        protected
            FTabs: TTabArray;
            FTab: TTab;
            FTemplate: TJSHtmlTemplateElement;
            FItemTemplate: TJSHtmlTemplateElement;
            FTabsElement: TJSHtmlElement;

        public
            constructor Create(
                AContainer: TJSElement;
                ATemplate: TJSHtmlTemplateElement;
                AItemTemplate: TJSHtmlTemplateElement);
            property Container: TJSElement read FContainer;
            property Tabs: TTabArray read FTabs;
            property Tab: TTab read FTab;
            procedure ChangeTab(AIndex: integer);
            procedure AddTab(const ATitle: string; const AElement: TJSElement);
            procedure AddTab(const ATab: TTab);
    end;

implementation

uses
    SysUtils;

{ TTabs }

constructor TTabs.Create(
    AContainer: TJSElement;
    ATemplate: TJSHtmlTemplateElement;
    AItemTemplate: TJSHtmlTemplateElement);
begin
    inherited Create(AContainer);

    FTemplate := ATemplate;
    FItemTemplate := AItemTemplate;

    FTabsElement := TJSHtmlElement(FTemplate.Content.CloneNode(True).ChildNodes[1]);
    AContainer.AppendChild(FTabsElement);
end;

procedure TTabs.AddTab(const ATab: TTab);
var
    item, link: TJSHtmlElement;
begin
    SetLength(FTabs, Length(FTabs) + 1);
    FTabs[High(FTabs)] := ATab;

    item := TJSHtmlElement(FItemTemplate.Content.CloneNode(True).ChildNodes[1]);
    item.QuerySelector('span').InnerText := ATab.Title;

    link := TJSHtmlElement(item.QuerySelector('a'));
    link.SetAttribute('data-tab-index', IntToStr(High(FTabs)));
    link.OnClick := function(AEvent: TJSMouseEvent): boolean
        var
            tabIndex: integer;
        begin
            tabIndex := StrToInt(TJSElement(AEvent.CurrentTarget).GetAttribute('data-tab-index'));
            ChangeTab(tabIndex);
            result := true;
        end;

    FTabsElement.QuerySelector('ul').AppendChild(item);
    
    if Length(FTabs) = 1 then
        ChangeTab(0);
end;

procedure TTabs.AddTab(const ATitle: string; const AElement: TJSElement);
var
    tab: TTab;
begin
    tab.Title := ATitle;
    tab.Element := AElement;
    AddTab(tab);
end;

procedure TTabs.ChangeTab(AIndex: integer);
var
    item: TJSElement;
begin
    if (AIndex < 0) or (AIndex > High(FTabs)) then
        exit;

    if Assigned(FTab.Element) then
        FTab.Element.ClassList.Add('is-hidden');

    FTab := FTabs[AIndex];
    FTab.Element.ClassList.Remove('is-hidden');

    item := FTabsElement.QuerySelector('.is-active');
    if Assigned(item) then
        item.ClassList.Remove('is-active');

    FTabsElement.QuerySelector(
        Format('ul li:nth-child(%d)', [AIndex + 1])
    ).ClassList.Add('is-active');
end;


end.
