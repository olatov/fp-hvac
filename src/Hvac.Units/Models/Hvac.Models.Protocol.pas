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
    { Byte 1 }
    Mode: 0..%111;
    Power: 0..1;
    FanSpeed: 0..%111;
    Turbo: 0..1;

    { Byte 2 }
    DesiredTemperature: 0..%11111;
    TemperatureScale: 0..1;
    Quiet: 0..1;
    Unknown1: 0..1;

    { Byte 3 }
    VerticalFlowMode: 0..%1111;
    HorizontalFlowMode: 0..%1111;

    { Byte 4 }
    Eco: 0..1;
    Sleep: 0..1;
    Unknown2: 0..%11;
    Drying: 0..1;
    Timing: 0..1;
    Health: 0..1;
    Display: 0..1;

    { Byte 5 }
    TimerOnHour: 0..%111;
    TimerOn: 0..1;
    TimerOffHour: 0..%111;
    TimerOff: 0..1;

    { Byte 6 }
    TimerOnOffMinute: Byte;

    { Byte 7 }
    TimerUnknown1: Byte;

    { Byte 8 }
    TimerUnknown2: Byte;

    { Byte 9 }
    IndoorTemperatureIntegral: Int8;

    { Byte 10 }
    IndoorTemperatureFractional: Byte;

    constructor FromHvacState(const AState: THvacState);
    function ToHvacState: THvacState;
  end;

  THvacPacket = record
    Header: array[1..3] of Byte;
    Command: Byte;
    Unknown1: array[1..3] of Byte;
    Config: THvacConfig;
    Unknown2: array[1..3] of Byte;
    Checksum: Byte;

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
  Power := Ord(AState.Power);
  Mode := Byte(AState.Mode);
  Turbo := Ord(AState.Turbo);
  FanSpeed := Byte(AState.FanSpeed);

  TemperatureScale := Ord(AState.TemperatureScale);
  
  { These are basically read only }
  IndoorTemperatureIntegral := 0;
  IndoorTemperatureFractional := 0;
  
  if AState.DesiredTemperature < 50 then
    { Celsius }
    DesiredTemperature := AState.DesiredTemperature - 16
  else
    { Fahrenheit, need to convert to Celsius }
    DesiredTemperature := Round(FahrenheitToCelsius(AState.DesiredTemperature) - 16);

  HorizontalFlowMode := specialize IfThen<Byte>(
    Byte(AState.HorizontalFlowMode) < 7,
      Byte(AState.HorizontalFlowMode),
      Byte(AState.HorizontalFlowMode) + 5);

  VerticalFlowMode := Byte(AState.VerticalFlowMode);

  Quiet := Ord(AState.Quiet);
  Display := Ord(AState.Display);
  Health := Ord(AState.Health);
  Drying := Ord(AState.Drying);
  Self.Sleep := Ord(AState.Sleep);
  Eco := Ord(AState.Eco);
end;

function THvacConfig.ToHvacState: THvacState;
begin
  Result.Power := Boolean(Power);
  Result.Mode := THvacMode(Mode);
  Result.Turbo := Boolean(Turbo);
  Result.FanSpeed := TFanSpeed(FanSpeed);

  Result.HorizontalFlowMode := THorizontalFlowMode(
    specialize IFThen<Byte>(
      HorizontalFlowMode < 12,
        HorizontalFlowMode,
        HorizontalFlowMode - 5));

  Result.VerticalFlowMode := TVerticalFlowMode(VerticalFlowMode);
  Result.TemperatureScale := TTemperatureScale(TemperatureScale);
  Result.Quiet := Boolean(Quiet);
  Result.Display := Boolean(Display);
  Result.Health := Boolean(Health);
  Result.Drying := Boolean(Drying);
  Result.Sleep := Boolean(Sleep);
  Result.Eco := Boolean(Eco);

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
  Header := [$AA, $AA, $12];
  Command := ACommand;
  Unknown1 := [$0A, $0A, $00];

  FillByte(Config, SizeOf(Config), 0);
  FillByte(Unknown2, SizeOf(Unknown2), 0);
  Config.DesiredTemperature := 3;

  RefreshChecksum;
end;

function THvacPacket.GetChecksum: Byte;
var 
  I: Integer;
begin
  Result := 0;
  {$Push}
  {$R-}{$Q-}
  for I := 0 to SizeOf(Self) - 2 do
    Inc(Result, PByte(@Self)[I]);
  {$Pop}
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
