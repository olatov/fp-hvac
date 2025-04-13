unit Hvac.Cqrs.Commands.GetEnums;

{$mode objfpc}

interface

uses
  Hvac.Cqrs,
  Hvac.Types.Generic;

type
  IGetEnumsQuery = interface(ICqrsRequest)
    ['{9D3F58C5-C1E5-41E1-9C6F-8D8593553C7D}']
  end;

  TGetEnumsQuery = class(TInterfacedObject, IGetEnumsQuery)
  end;

  IGetEnumsResult = interface(ICqrsResult)
    ['{28A3D657-BFFA-4715-BEF0-6693AAF3C590}']
    function GetResult: TStringArrayMap;
    procedure SetResult(AValue: TStringArrayMap);
    property Result: TStringArrayMap read GetResult write SetResult;
  end;

  { TGetEnumsResult }

  TGetEnumsResult = class(TCqrsResult, IGetEnumsResult)
  private
    FResult: TStringArrayMap;
  public
    constructor Create; override;
    destructor Destroy; override;
    function GetResult: TStringArrayMap;
    procedure SetResult(AValue: TStringArrayMap);
    property Result: TStringArrayMap read GetResult write SetResult;
  end;  

  IGetEnumsHandler = interface
    ['{778280B2-6E09-4E7C-8FB3-0BD5BBF96497}']
    function Handle(const ARequest: IGetEnumsQuery): IGetEnumsResult;
  end;

  TGetEnumsHandler = class(TCqrsHandler, IGetEnumsHandler)
    function Handle(const ARequest: IGetEnumsQuery): IGetEnumsResult;
  end;  

implementation

uses
  SysUtils,
  FPJson,
  Hvac.Helpers.Enums,
  Hvac.Types.Core;

{ TGetEnumsResult }

constructor TGetEnumsResult.Create;
begin
  inherited Create;
  FResult := TStringArrayMap.Create;
end;

destructor TGetEnumsResult.Destroy;
begin
  FreeAndNil(FResult);
  inherited Destroy;
end;

function TGetEnumsResult.GetResult: TStringArrayMap;
begin
  Result := FResult;
end;

procedure TGetEnumsResult.SetResult(AValue: TStringArrayMap);
begin
  FResult := AValue;
end;

{ TGetEnumsHandler }

function TGetEnumsHandler.Handle(const ARequest: IGetEnumsQuery): IGetEnumsResult;
begin
  Result := TGetEnumsResult.Create;
  try
    Result.Result.Clear;
    Result.Result.Add('mode', specialize EnumToStringArray<THvacMode>);
    Result.Result.Add('fanSpeed', specialize EnumToStringArray<TFanSpeed>);
    Result.Result.Add('horizontalFlowMode', specialize EnumToStringArray<THorizontalFlowMode>);
    Result.Result.Add('verticalFlowMode', specialize EnumToStringArray<TVerticalFlowMode>);
    Result.Result.Add('temperatureScale', specialize EnumToStringArray<TTemperatureScale>);
  except
    on E: Exception do
      begin
        Logger.Error(E.Message);
        Result.Errors.Add(E.Message);
      end;
  end;
end;

end.
