unit Hvac.Models.Dto;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses 
  Hvac.Types.Core,
  Hvac.Models.Domain;

type
    THvacStateDto = record
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

      function ToJson(APretty: Boolean = false): String;
      function ToHvacState: THvacState;
      constructor FromJson(const AContent: String);
      constructor FromHvacState(const AState: THvacState);
    end;

implementation

uses
  SysUtils,
  FPJson,
  {$ifndef PAS2JS}
    JsonParser,
  {$endif}
  TypInfo;

{ THvacStateDto }

constructor THvacStateDto.FromJson(const AContent: String);
var 
  Json: TJsonData;
begin
  Json := GetJson(AContent);
  try
    Power := json.GetPath('power').AsBoolean;
    Mode := THvacMode(GetEnumValue(TypeInfo(THvacMode), Json.GetPath('mode').AsString));
    DesiredTemperature := Json.GetPath('desiredTemperature').AsInteger;
    IndoorTemperature := Json.GetPath('indoorTemperature').AsFloat;
    Turbo := Json.GetPath('turbo').AsBoolean;
    FanSpeed := TFanSpeed(GetEnumValue(TypeInfo(TFanSpeed), Json.GetPath('fanSpeed').AsString));

    HorizontalFlowMode := THorizontalFlowMode(
        GetEnumValue(TypeInfo(THorizontalFlowMode),
            json.GetPath('horizontalFlowMode').AsString));

    VerticalFlowMode := TVerticalFlowMode(
        GetEnumValue(TypeInfo(TVerticalFlowMode),
            json.GetPath('verticalFlowMode').AsString));

    TemperatureScale := TTemperatureScale(
        GetEnumValue(TypeInfo(TTemperatureScale),
                        json.GetPath('temperatureScale').AsString));

    Quiet := Json.GetPath('quiet').AsBoolean;
    Display := Json.GetPath('display').AsBoolean;
    Health := Json.GetPath('health').AsBoolean;
    Drying := Json.GetPath('drying').AsBoolean;
    Sleep := Json.GetPath('sleep').AsBoolean;
    Eco := Json.GetPath('eco').AsBoolean;

  finally
    FreeAndNil(Json);

  end;
end;

constructor THvacStateDto.FromHvacState(const AState: THvacState);
begin
  Power := AState.Power;
  Mode := AState.Mode;
  IndoorTemperature := AState.IndoorTemperature;
  DesiredTemperature := AState.DesiredTemperature;
  Turbo := AState.Turbo;
  FanSpeed := AState.FanSpeed;
  HorizontalFlowMode := AState.HorizontalFlowMode;
  VerticalFlowMode := AState.VerticalFlowMode;
  TemperatureScale := AState.TemperatureScale;
  Quiet := AState.Quiet;
  Display := AState.Display;
  Health := AState.Health;
  Drying := AState.Drying;
  Sleep := AState.Sleep;
  Eco := AState.Eco;
end;

function THvacStateDto.ToHvacState: THvacState;
begin
  with Result do
  begin
    Power := Self.Power;
    Mode := Self.Mode;
    DesiredTemperature := Self.DesiredTemperature;
    IndoorTemperature := Self.IndoorTemperature;
    Turbo := Self.Turbo;
    FanSpeed := Self.FanSpeed;
    HorizontalFlowMode := Self.HorizontalFlowMode;
    VerticalFlowMode := Self.VerticalFlowMode;
    TemperatureScale := Self.TemperatureScale;
    Quiet := Self.Quiet;
    Display := Self.Display;
    Health := Self.Health;
    Drying := Self.Drying;
    Sleep := Self.Sleep;
    Eco := Self.Eco;
  end;
end;

function THvacStateDto.ToJson(APretty: Boolean = false): String;
var 
  Json:   TJsonObject;

begin
    Json := TJsonObject.Create;
    try
      with Json do
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

        CompressedJson := True;
      end;

      if APretty then
        Result := Json.FormatJson
      else
        Result := Json.AsJson;

    finally
        FreeAndNil(Json);

    end;
end;

end.
