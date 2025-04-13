unit Hvac.Models.Domain;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses 
    Hvac.Types.Core;

type
  THvacState = record
    Power: Boolean;
    Mode: THvacMode;
    IndoorTemperature: Double;
    DesiredTemperature: Integer;
    Turbo: Boolean;
    FanSpeed: TFanSpeed;
    HorizontalFlowMode: THorizontalFlowMode;
    VerticalFlowMode: TVerticalFlowMode;
    TemperatureScale: TTemperatureScale;
    Quiet: Boolean;
    Display: Boolean;
    Health: Boolean;
    Drying: Boolean;
    Sleep: Boolean;
    Eco: Boolean;
  end;

implementation

end.
