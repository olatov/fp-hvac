unit Hvac.Commands.GetEnums.Handler;

{$mode objfpc}

interface

uses
    Hvac.Cqrs,
    Hvac.Commands.GetEnums.Query,
    Hvac.Commands.GetEnums.Result;

type
    IGetEnumsHandler = interface
        function Handle(const ARequest: IGetEnumsQuery): IGetEnumsResult;
    end;

    TGetEnumsHandler = class(TCqrsHandler, IGetEnumsHandler)
        function Handle(const ARequest: IGetEnumsQuery): IGetEnumsResult;
    end;

implementation

uses
    SysUtils,
    FPJson,
    Hvac.Types.Core,
    Hvac.Types.Generic,
    Hvac.Helpers.Enums;

{ TGetEnumsHandler }

function TGetEnumsHandler.Handle(const ARequest: IGetEnumsQuery): IGetEnumsResult;
begin
    result := TGetEnumsResult.Create();
    try
        result.Result := TStringArrayMap.Create();
        result.Result['mode'] := specialize EnumToStringArray<THvacMode>();
        result.Result['fanSpeed'] := specialize EnumToStringArray<TFanSpeed>();
        result.Result['horizontalFlowMode'] := specialize EnumToStringArray<THorizontalFlowMode>();
        result.Result['verticalFlowMode'] := specialize EnumToStringArray<TVerticalFlowMode>();
        result.Result['temperatureScale'] := specialize EnumToStringArray<TTemperatureScale>();
        result.IsSuccess := true;

    except on E: Exception do
        begin
            Logger.Error(E.Message);
            result.IsSuccess := false;
            result.AddError(E.Message);
        end;
    end;
end;

end.