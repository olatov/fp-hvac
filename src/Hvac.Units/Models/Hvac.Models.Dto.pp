unit Hvac.Models.Dto;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses 
    Hvac.Models.Core,
    Hvac.Models.Domain;

type
    THvacStateDto = record
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

        function ToJson(pretty: boolean = false): string;
        function ToHvacState(): THvacState;
        constructor FromJson(content: string);
        constructor FromHvacState(state: THvacState);
    end;

implementation

uses 
    FPJson,
    TypInfo;

{ THvacStateDto }

constructor THvacStateDto.FromJson(content: string);
var 
    json: TJsonData;
begin
    json := GetJson(content);

    try
        Power := json.GetPath('power').AsBoolean;
        Mode := THvacMode(GetEnumValue(TypeInfo(THvacMode), json.GetPath('mode').AsString));
        DesiredTemperature := json.GetPath('desiredTemperature').AsInteger;
        IndoorTemperature := json.GetPath('indoorTemperature').AsFloat;
        Turbo := json.GetPath('turbo').AsBoolean;
        FanSpeed := TFanSpeed(GetEnumValue(TypeInfo(TFanSpeed), json.GetPath('fanSpeed').AsString));

        HorizontalFlowMode := THorizontalFlowMode(
            GetEnumValue(TypeInfo(THorizontalFlowMode),
                json.GetPath('horizontalFlowMode').AsString));

        VerticalFlowMode := TVerticalFlowMode(
            GetEnumValue(TypeInfo(TVerticalFlowMode),
                json.GetPath('verticalFlowMode').AsString));

        TemperatureScale := TTemperatureScale(
            GetEnumValue(TypeInfo(TTemperatureScale),
                            json.GetPath('temperatureScale').AsString));

        Quiet := json.GetPath('quiet').AsBoolean;
        Display := json.GetPath('display').AsBoolean;
        Health := json.GetPath('health').AsBoolean;
        Drying := json.GetPath('drying').AsBoolean;
        Sleep := json.GetPath('sleep').AsBoolean;
        Eco := json.GetPath('eco').AsBoolean;

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

function THvacStateDto.ToHvacState(): THvacState;
begin
    with result do
        begin
            Power := self.Power;
            Mode := self.Mode;
            DesiredTemperature := self.DesiredTemperature;
            IndoorTemperature := self.IndoorTemperature;
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
                Strings['mode'] := GetEnumName(TypeInfo(THvacMode), Ord(Mode));
                Floats['indoorTemperature'] := IndoorTemperature;
                Integers['desiredTemperature'] := DesiredTemperature;
                Booleans['turbo'] := Turbo;
                Strings['fanSpeed'] := GetEnumName(TypeInfo(TFanSpeed), Ord(FanSpeed));
                Strings['horizontalFlowMode'] := GetEnumName(TypeInfo(THorizontalFlowMode), Ord(HorizontalFlowMode));
                Strings['verticalFlowMode'] := GetEnumName(TypeInfo(TVerticalFlowMode), Ord(VerticalFlowMode));
                Strings['temperatureScale'] := GetEnumName(TypeInfo(TTemperatureScale), Ord(TemperatureScale));
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
