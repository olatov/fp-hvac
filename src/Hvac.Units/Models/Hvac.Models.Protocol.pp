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
        Power: boolean;
        FanSpeed: 0..%111;
        Turbo: boolean;

        // Byte 2
        DesiredTemperature: 0..%11111;
        TemperatureScale: boolean;
        Quiet: boolean;
        Unknown1: boolean;

        // Byte 3
        VerticalFlowMode: 0..%1111;
        HorizontalFlowMode: 0..%1111;

        // Byte 4
        Eco: boolean;
        Sleep: boolean;
        Unknown2: 0..%11;
        Drying: boolean;
        Timing: boolean;
        Health: boolean;
        Display: boolean;

        // Byte 5
        TimerOnHour: 0..%111;
        TimerOn: boolean;
        TimerOffHour: 0..%111;
        TimerOff: boolean;

        // Byte 6
        TimerOnOffMinute: byte;

        // Byte 7
        TimerUnknown1: byte;

        // Byte 8
        TimerUnknown2: byte;

        // Byte 9
        IndoorTemperatureIntegral: shortint;

        // Byte 10
        IndoorTemperatureFractional: byte;

        constructor FromHvacState(AState: THvacState);
        function ToHvacState(): THvacState;
    end;

    THvacPacket = record
        Header: array[1..3] of byte;
        Command: byte;
        Unknown1: array[1..3] of byte;
        FConfig: THvacConfig;
        Unknown2: array[1..3] of byte;
        Checksum: byte;

        property Config: THvacConfig read FConfig write FConfig;
        function GetChecksum(): byte;
        function VerifyChecksum(): boolean;
        procedure RefreshChecksum();
        constructor Create(ACommand: byte);
    end;

implementation

uses 
    SysUtils,
    TypInfo,
    Hvac.Models.Core,
    Hvac.Utils.Temperature;

{ THvacConfig }

constructor THvacConfig.FromHvacState(AState: THvacState);
begin
    Power := AState.Power;
    Mode := byte(AState.Mode);
    Turbo := AState.Turbo;
    FanSpeed := byte(AState.FanSpeed);

    TemperatureScale := boolean(AState.TemperatureScale);
    
    // These are basically read only
    IndoorTemperatureIntegral := 0;
    IndoorTemperatureFractional := 0;
    
    if AState.DesiredTemperature < 50 then
        // Celsius
        DesiredTemperature := AState.DesiredTemperature - 16
    else
        // Fahrenheit, need to convert to Celsius
        DesiredTemperature := Round(FahrenheitToCelsius(AState.DesiredTemperature) - 16);

    HorizontalFlowMode := specialize IFThen<byte>(
        byte(AState.HorizontalFlowMode) < 7,
            byte(AState.HorizontalFlowMode),
            byte(AState.HorizontalFlowMode) + 5);

    VerticalFlowMode := byte(AState.VerticalFlowMode);

    Quiet := AState.Quiet;
    Display := AState.Display;
    Health := AState.Health;
    Drying := AState.Drying;
    self.Sleep := AState.Sleep;
    Eco := AState.Eco;
end;

function THvacConfig.ToHvacState(): THvacState;
begin
    result.Power := Power;
    result.Mode := THvacMode(Mode);
    result.Turbo := Turbo;
    result.FanSpeed := TFanSpeed(FanSpeed);

    result.HorizontalFlowMode := THorizontalFlowMode(
        specialize IFThen<byte>(
            HorizontalFlowMode < 12,
                HorizontalFlowMode,
                HorizontalFlowMode - 5));

    result.VerticalFlowMode := TVerticalFlowMode(VerticalFlowMode);
    result.TemperatureScale := TTemperatureScale(TemperatureScale);
    result.Quiet := Quiet;
    result.Display := Display;
    result.Health := Health;
    result.Drying := Drying;
    result.Sleep := Sleep;
    result.Eco := Eco;

    result.IndoorTemperature := IndoorTemperatureIntegral + (0.1 * IndoorTemperatureFractional);
    result.DesiredTemperature := DesiredTemperature + 16;

    if result.TemperatureScale = tsFahrenheit then
    begin
        result.IndoorTemperature := Round(CelsiusToFahrenheit(result.IndoorTemperature));
        result.DesiredTemperature := Round(CelsiusToFahrenheit(result.DesiredTemperature));
    end;
end;

{ THvacPacket }

constructor THvacPacket.Create(ACommand: byte);
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

    RefreshChecksum();
end;

function THvacPacket.GetChecksum(): byte;
var 
    item: pbyte;
    sum: word = 0;
    i: integer;
begin
    item := @self;

    for i := 1 to (SizeOf(self) - 1) do
    begin
        Inc(sum, item^);
        Inc(item);
    end;

    result := Lo(sum);
end;

procedure THvacPacket.RefreshChecksum();
begin
    Checksum := GetChecksum();
end;

function THvacPacket.VerifyChecksum(): boolean;
begin
    result := (Checksum = GetChecksum());
end;

end.
