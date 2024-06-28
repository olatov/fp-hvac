unit Hvac.Web.Core;

{$mode objfpc}
{$modeswitch AdvancedRecords}

interface

type
    TUITabIndex = (
        tabControls,
        tabSettings,
        tabAbout
    );

    TSettings = record
        Theme: string;
        ApiUrl: string;
        ApiKey: string;
    end;

    TOption = record
        Value: string;
        Text: string;
        constructor Create(AValue: string; AText: string);
    end;

implementation

{ TOption }

constructor TOption.Create(AValue: string; AText: string);
begin
    Value := AValue;
    Text := AText;
end;

end.TApiSettings