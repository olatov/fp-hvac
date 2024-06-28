unit Hvac.Commands.GetState.Result;

{$mode objfpc}

interface

uses 
    Hvac.Cqrs,
    Hvac.Models.Domain;

type
    IGetStateResult = interface(ICqrsResult)
        function GetResult(): THvacState;
        procedure SetResult(AValue: THvacState);
        property Result: THvacState read GetResult write SetResult;
    end;

    TGetStateResult = class(TCqrsResult, IGetStateResult)
    private
        FResult: THvacState;
    public
        function GetResult(): THvacState;
        procedure SetResult(AValue: THvacState);
        property Result: THvacState read GetResult write SetResult;
    end;

implementation

{ TGetStateResult }

function TGetStateResult.GetResult(): THvacState;
begin
    result := FResult;
end;

procedure TGetStateResult.SetResult(AValue: THvacState);
begin
    FResult := AValue;
end;

end.