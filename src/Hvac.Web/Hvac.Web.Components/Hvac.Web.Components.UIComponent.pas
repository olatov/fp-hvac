unit Hvac.Web.Components.UIComponent;

{$mode objfpc}
{$LongStrings on}

interface

uses
    Web;

type
    TUIComponent = class
    protected
        FContainer: TJSElement;

    public
        constructor Create(const AContainer: TJSElement);
        property Container: TJSElement read FContainer;
    end;

implementation

{ TUIComponent }

constructor TUIComponent.Create(const AContainer: TJSElement);
begin
    FContainer := AContainer;
end;

end.
