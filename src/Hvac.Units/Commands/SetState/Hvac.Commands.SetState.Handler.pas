unit Hvac.Commands.SetState.Handler;

{$mode objfpc}

interface

uses
    Hvac.Connection,
    Hvac.Models.Domain,
    Hvac.Cqrs,
    Hvac.Commands.SetState.Command,
    Hvac.Commands.SetState.Result;

type
    ISetStateHandler = interface
        function Handle(const ARequest: ISetStateCommand): ISetStateResult;
    end;

    TSetStateHandler = class(TCqrsHandler, ISetStateHandler)
    public
        function Handle(const ARequest: ISetStateCommand): ISetStateResult;
    end;

implementation

uses
    SysUtils;

{ TSetStateHandler }

function TSetStateHandler.Handle(const ARequest: ISetStateCommand): ISetStateResult;
var
    hvacState: THvacState;
    connection: THvacConnection;
begin
    result := TSetStateResult.Create();
    try
        try
            connection := THvacConnection.Create(Logger, ARequest.Host, ARequest.Port);
            hvacState := connection.SetState(ARequest.State);
            result.Result := hvacState;
            result.IsSuccess := true;

        except on E: Exception do
            begin
                Logger.Error(E.Message);
                result.IsSuccess := false;
                result.AddError(E.Message);
            end;
        end;

    finally
        FreeAndNil(connection);
    end; 
end;

end.