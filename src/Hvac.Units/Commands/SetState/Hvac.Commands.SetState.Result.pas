unit Hvac.Commands.SetState.Result;

{$mode objfpc}

interface

uses 
    Hvac.Cqrs,
    Hvac.Models.Domain;

type
    ISetStateResult = interface(ICqrsResult)
        function GetResult(): THvacState;
        procedure SetResult(AValue: THvacState);
        property Result: THvacState read GetResult write SetResult;
    end;

    TSetStateResult = class(TCqrsResult, ISetStateResult)
    private
        FResult: THvacState;
    public
        function GetResult(): THvacState;
        procedure SetResult(AValue: THvacState);
        property Result: THvacState read GetResult write SetResult;
    end;

implementation

{ TSetStateResult }

function TSetStateResult.GetResult(): THvacState;
begin
    result := FResult;
end;

procedure TSetStateResult.SetResult(AValue: THvacState);
begin
    FResult := AValue;
end;

end.