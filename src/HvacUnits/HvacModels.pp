unit HvacModels;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses 
    fpJson;

const 
    HvacGetStateCommand =   $A0;
    HvacSetStateCommand =   $01;

type 
    THvacMode =  (
        mdAuto,
        mdCool,
        mdDry,
        mdFan,
        mdHeat
    );

    TFanSpeed = (
        fsAuto,
        fsLevel1,
        fsLevel2,
        fsLevel3,
        fsLevel4,
        fsLevel5,
        fsLevel6
    );

    THorizontalFlowMode = (
        hfmStop,
        hfmSwing,
        hfmLeft,
        hfmLeftCenter,
        hfmCenter,
        hfmRightCenter,
        hfmRight,
        hfmLeftRight,
        hfmSwingWide
    );

    TVerticalFlowMode = (
        vfmStop,
        vfmSwing,
        vfmTop,
        vfmTopCenter,
        vfmCenter,
        vfmBottomCenter,
        vfmBottom
    );

    TTemperatureScale = (
        tsCelsius,
        tsFahrenheit
    );

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
    end;

    THvacPacket = record
        Header: array[1..3] of byte;
        Command: byte;
        Unknown1: array[1..3] of byte;
        AConfig: THvacConfig;
        Unknown2: array[1..3] of byte;
        Checksum: byte;

        property Config: THvacConfig read AConfig write AConfig;
        function GetChecksum(): byte;
        function VerifyChecksum(): boolean;
        procedure RefreshChecksum();
        constructor Create(ACommand: byte);
    end;

    THvacState = record
        Power: boolean;
        Mode: THvacMode;
        IndoorTemperature: single;
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

        function ToHvacConfig(): THvacConfig;
        constructor FromHvacConfig(const AConfig: THvacConfig);
    end;

    THvacStateDto = record
        Power: boolean;
        Mode: THvacMode;
        IndoorTemperature: single;
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

        function ToJson(pretty: boolean = false): string;
        function ToHvacState(): THvacState;
        constructor FromJson(content: string);
        constructor FromHvacState(state: THvacState);
    end;

implementation

uses 
    SysUtils,
    JsonParser,
    EnumHelpers;

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

    FillByte(AConfig, SizeOf(AConfig), 0);
    FillByte(Unknown2, SizeOf(Unknown2), 0);

    RefreshChecksum();
end;

function THvacPacket.GetChecksum():   byte;
var 
    item: ^byte;
    sum: word =   0;
    i: integer;
begin
    item := @self;
    for i := 1 to (SizeOf(self) - 1) do
        begin
            Inc(sum, item^);
            Inc(item);
        end;

    result := sum mod 256;
end;

procedure THvacPacket.RefreshChecksum();
begin
    Checksum := GetChecksum();
end;

function THvacPacket.VerifyChecksum():   boolean;
begin
    result := (Checksum = GetChecksum());
end;

{ THvacState }

constructor THvacState.FromHvacConfig(const AConfig: THvacConfig);
begin
    Power := AConfig.Power;
    Mode := THvacMode(AConfig.Mode);
    Turbo := AConfig.Turbo;
    FanSpeed := TFanSpeed(AConfig.FanSpeed);

    HorizontalFlowMode := THorizontalFlowMode(
        specialize IFThen<byte>(
            AConfig.HorizontalFlowMode < 12,
                AConfig.HorizontalFlowMode,
                AConfig.HorizontalFlowMode - 5));

    VerticalFlowMode := TVerticalFlowMode(AConfig.VerticalFlowMode);
    TemperatureScale := TTemperatureScale(AConfig.TemperatureScale);
    Quiet := AConfig.Quiet;
    Display := AConfig.Display;
    Health := AConfig.Health;
    Drying := AConfig.Drying;
    Sleep := AConfig.Sleep;
    Eco := AConfig.Eco;
    IndoorTemperature := AConfig.IndoorTemperatureIntegral + (0.1 * AConfig.IndoorTemperatureFractional);
    DesiredTemperature := AConfig.DesiredTemperature + 16;
end;

function THvacState.ToHvacConfig():   THvacConfig;
begin
    with result do
        begin
            Power := self.Power;
            Mode := byte(self.Mode);
            Turbo := self.Turbo;
            FanSpeed := byte(self.FanSpeed);
            IndoorTemperatureIntegral := round(self.IndoorTemperature);
            IndoorTemperatureFractional := round((self.IndoorTemperature - result.IndoorTemperatureIntegral) * 10);
            DesiredTemperature := self.DesiredTemperature - 16;

            HorizontalFlowMode := specialize IFThen<byte>(
                byte(self.HorizontalFlowMode) < 7,
                    byte(self.HorizontalFlowMode),
                    byte(self.HorizontalFlowMode) + 5);

            VerticalFlowMode := byte(self.VerticalFlowMode);
            TemperatureScale := boolean(self.TemperatureScale);
            Quiet := self.Quiet;
            Display := self.Display;
            Health := self.Health;
            Drying := self.Drying;
            Sleep := self.Sleep;
            Eco := self.Eco;
        end;
end;

{ THvacStateDto }

constructor THvacStateDto.FromJson(content: string);
var 
    json:   TJsonData;
begin
    json := GetJson(content);

    try
        Power := json.FindPath('power').AsBoolean;
        Mode := specialize StrToEnum<THvacMode>(json.FindPath('mode').AsString);
        DesiredTemperature := json.FindPath('desiredTemperature').AsInteger;
        Turbo := json.FindPath('turbo').AsBoolean;
        FanSpeed := specialize StrToEnum<TFanSpeed>(json.FindPath('fanSpeed').AsString);

        HorizontalFlowMode := specialize StrToEnum<THorizontalFlowMode>(
                              json.FindPath('horizontalFlowMode').AsString);

        VerticalFlowMode := specialize StrToEnum<TVerticalFlowMode>(
                            json.FindPath('verticalFlowMode').AsString);

        TemperatureScale := specialize StrToEnum<TTemperatureScale>(
                            json.FindPath('temperatureScale').AsString);

        Quiet := json.FindPath('quiet').AsBoolean;
        Display := json.FindPath('display').AsBoolean;
        Health := json.FindPath('health').AsBoolean;
        Drying := json.FindPath('drying').AsBoolean;
        Sleep := json.FindPath('sleep').AsBoolean;
        Eco := json.FindPath('eco').AsBoolean;

    finally
        json.Free();

    end;
end;

constructor THvacStateDto.FromHvacState(state: THvacState);
begin
    Power := state.Power;
    Mode := state.Mode;
    IndoorTemperature := state.IndoorTemperature;
    DesiredTemperature := state.DesiredTemperature;
    Turbo := state.Turbo;
    FanSpeed := state.FanSpeed;
    HorizontalFlowMode := state.HorizontalFlowMode;
    VerticalFlowMode := state.VerticalFlowMode;
    TemperatureScale := state.TemperatureScale;
    Quiet := state.Quiet;
    Display := state.Display;
    Health := state.Health;
    Drying := state.Drying;
    Sleep := state.Sleep;
    Eco := state.Eco;
end;

function THvacStateDto.ToHvacState():   THvacState;
begin
    with result do
        begin
            Power := self.Power;
            Mode := self.Mode;
            DesiredTemperature := self.DesiredTemperature;
            Turbo := self.Turbo;
            FanSpeed := self.FanSpeed;
            HorizontalFlowMode := self.HorizontalFlowMode;
            VerticalFlowMode := self.VerticalFlowMode;
            TemperatureScale := self.TemperatureScale;
            Quiet := self.Quiet;
            Display := self.Display;
            Health := self.Health;
            Drying := self.Drying;
            Sleep := self.Sleep;
            Eco := self.Eco;
        end;
end;

function THvacStateDto.ToJson(pretty: boolean = false): string;
var 
    json:   TJsonObject;

begin
    json := TJsonObject.Create();

    try
        with json do
            begin
                Booleans['power'] := Power;
                Strings['mode'] := specialize EnumToStr<THvacMode>(Mode);
                Floats['indoorTemperature'] := IndoorTemperature;
                Integers['desiredTemperature'] := DesiredTemperature;
                Booleans['turbo'] := Turbo;
                Strings['fanSpeed'] := specialize EnumToStr<TFanSpeed>(FanSpeed);
                Strings['horizontalFlowMode'] := specialize EnumToStr<THorizontalFlowMode>(HorizontalFlowMode);
                Strings['verticalFlowMode'] := specialize EnumToStr<TVerticalFlowMode>(VerticalFlowMode);
                Strings['temperatureScale'] := specialize EnumToStr<TTemperatureScale>(TemperatureScale);
                Booleans['quiet'] := Quiet;
                Booleans['display'] := Display;
                Booleans['health'] := Health;
                Booleans['drying'] := Drying;
                Booleans['sleep'] := Sleep;
                Booleans['eco'] := Eco;

                CompressedJson := true;
            end;

        if pretty then
            result := json.FormatJson
        else
            result := json.AsJson;

    finally
        json.Free();

    end;
end;

end.
