unit Hvac.Web.Core;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

type
  TUITabIndex = (tabControls, tabSettings, tabAbout);

  TSettings = record
    Theme: String;
    ApiUrl: String;
    ApiKey: String;
  end;

  TOption = record
    Value: String;
    Text: String;
    constructor Create(AValue, AText: String);
  end;

implementation

{ TOption }

constructor TOption.Create(AValue, AText: String);
begin
  Value := AValue;
  Text := AText;
end;

end.
