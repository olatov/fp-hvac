unit Hvac.Models.Protocol;

{$mode objfpc}
{$modeswitch AdvancedRecords}

interface

uses 
  Hvac.Models.Domain;

const 
  HvacGetStateCommand = $A0;
  HvacSetStateCommand = $01;

type 
  THvacConfig = bitpacked record
    // Byte 1
    Mode: 0..%111;
    Power: Boolean;
    FanSpeed: 0..%111;
    Turbo: Boolean;

    // Byte 2
    DesiredTemperature: 0..%11111;
    TemperatureScale: Boolean;
    Quiet: Boolean;
    Unknown1: Boolean;

    // Byte 3
    VerticalFlowMode: 0..%1111;
    HorizontalFlowMode: 0..%1111;

    // Byte 4
    Eco: Boolean;
    Sleep: Boolean;
    Unknown2: 0..%11;
    Drying: Boolean;
    Timing: Boolean;
    Health: Boolean;
    Display: Boolean;

    // Byte 5
    TimerOnHour: 0..%111;
    TimerOn: Boolean;
    TimerOffHour: 0..%111;
    TimerOff: Boolean;

    // Byte 6
    TimerOnOffMinute: Byte;

    // Byte 7
    TimerUnknown1: Byte;

    // Byte 8
    TimerUnknown2: Byte;

    // Byte 9
    IndoorTemperatureIntegral: Int8;

    // Byte 10
    IndoorTemperatureFractional: Byte;

    constructor FromHvacState(const AState: THvacState);
    function ToHvacState: THvacState;
  end;

  THvacPacket = record
    Header: array[1..3] of Byte;
    Command: Byte;
    Unknown1: array[1..3] of Byte;
    FConfig: THvacConfig;
    Unknown2: array[1..3] of Byte;
    Checksum: Byte;

    property Config: THvacConfig read FConfig write FConfig;
    function GetChecksum: Byte;
    function VerifyChecksum: Boolean;
    procedure RefreshChecksum;
    constructor Create(const ACommand: Byte);
  end;

implementation

uses 
  SysUtils,
  StdConvs,
  TypInfo,
  Hvac.Types.Core;

{ THvacConfig }

constructor THvacConfig.FromHvacState(const AState: THvacState);
begin
  Power := AState.Power;
  Mode := Byte(AState.Mode);
  Turbo := AState.Turbo;
  FanSpeed := Byte(AState.FanSpeed);

  TemperatureScale := Boolean(AState.TemperatureScale);
  
  // These are basically read only
  IndoorTemperatureIntegral := 0;
  IndoorTemperatureFractional := 0;
  
  if AState.DesiredTemperature < 50 then
    // Celsius
    DesiredTemperature := AState.DesiredTemperature - 16
  else
    // Fahrenheit, need to convert to Celsius
    DesiredTemperature := Round(FahrenheitToCelsius(AState.DesiredTemperature) - 16);

  HorizontalFlowMode := specialize IFThen<Byte>(
    Byte(AState.HorizontalFlowMode) < 7,
      Byte(AState.HorizontalFlowMode),
      Byte(AState.HorizontalFlowMode) + 5);

  VerticalFlowMode := Byte(AState.VerticalFlowMode);

  Quiet := AState.Quiet;
  Display := AState.Display;
  Health := AState.Health;
  Drying := AState.Drying;
  Self.Sleep := AState.Sleep;
  Eco := AState.Eco;
end;

function THvacConfig.ToHvacState: THvacState;
begin
  Result.Power := Power;
  Result.Mode := THvacMode(Mode);
  Result.Turbo := Turbo;
  Result.FanSpeed := TFanSpeed(FanSpeed);

  Result.HorizontalFlowMode := THorizontalFlowMode(
    specialize IFThen<Byte>(
      HorizontalFlowMode < 12,
        HorizontalFlowMode,
        HorizontalFlowMode - 5));

  Result.VerticalFlowMode := TVerticalFlowMode(VerticalFlowMode);
  Result.TemperatureScale := TTemperatureScale(TemperatureScale);
  Result.Quiet := Quiet;
  Result.Display := Display;
  Result.Health := Health;
  Result.Drying := Drying;
  Result.Sleep := Sleep;
  Result.Eco := Eco;

  Result.IndoorTemperature := IndoorTemperatureIntegral + (0.1 * IndoorTemperatureFractional);
  Result.DesiredTemperature := DesiredTemperature + 16;

  if Result.TemperatureScale = tsFahrenheit then
  begin
    Result.IndoorTemperature := Round(CelsiusToFahrenheit(Result.IndoorTemperature));
    Result.DesiredTemperature := Round(CelsiusToFahrenheit(Result.DesiredTemperature));
  end;
end;

{ THvacPacket }

constructor THvacPacket.Create(const ACommand: Byte);
begin
  Header[1] := $AA;
  Header[2] := $AA;
  Header[3] := $12;

  Command := ACommand;

  Unknown1[1] := $0A;
  Unknown1[2] := $0A;
  Unknown1[3] := $00;

  FillByte(FConfig, SizeOf(FConfig), 0);
  FillByte(Unknown2, SizeOf(Unknown2), 0);
  FConfig.DesiredTemperature := 3;

  RefreshChecksum;
end;

function THvacPacket.GetChecksum: Byte;
var 
  Item: PByte;
  Sum: Word = 0;
  I: Integer;
begin
  Item := @Self;

  for I := 1 to SizeOf(Self) - 1 do
  begin
    Inc(Sum, Item^);
    Inc(Item);
  end;

  Result := Lo(Sum);
end;

procedure THvacPacket.RefreshChecksum;
begin
  Checksum := GetChecksum;
end;

function THvacPacket.VerifyChecksum: Boolean;
begin
  Result := (Checksum = GetChecksum);
end;

end.
