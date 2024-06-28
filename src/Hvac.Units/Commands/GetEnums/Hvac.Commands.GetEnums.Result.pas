unit Hvac.Commands.GetEnums.Result;

{$mode objfpc}

interface

uses
    Hvac.Cqrs,
    Hvac.Types.Generic;

type
    IGetEnumsResult = interface(ICqrsResult)
        function GetResult(): TStringArrayMap;
        procedure SetResult(AValue: TStringArrayMap);
        property Result: TStringArrayMap read GetResult write SetResult;
    end;

    TGetEnumsResult = class(TCqrsResult, IGetEnumsResult)
    private
        FResult: TStringArrayMap;
    public
        function GetResult(): TStringArrayMap;
        procedure SetResult(AValue: TStringArrayMap);
        property Result: TStringArrayMap read GetResult write SetResult;
    end;

implementation

{ TGetEnumsResult }

function TGetEnumsResult.GetResult(): TStringArrayMap;
begin
    result := FResult;
end;

procedure TGetEnumsResult.SetResult(AValue: TStringArrayMap);
begin
    FResult := AValue;
end;

end.