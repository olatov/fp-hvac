unit Hvac.Models.Domain;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses 
    Hvac.Models.Core;

type
    THvacState = record
        Power: boolean;
        Mode: THvacMode;
        IndoorTemperature: double;
        DesiredTemperature: integer;
        Turbo: boolean;
        FanSpeed: TFanSpeed;
        HorizontalFlowMode: THorizontalFlowMode;
        VerticalFlowMode: TVerticalFlowMode;
        TemperatureScale: TTemperatureScale;
        Quiet: boolean;
        Display: boolean;
        Health: boolean;
        Drying: boolean;
        Sleep: boolean;
        Eco: boolean;
    end;

implementation

end.
