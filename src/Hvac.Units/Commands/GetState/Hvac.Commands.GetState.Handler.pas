unit Hvac.Commands.GetState.Handler;

{$mode objfpc}

interface

uses
    Hvac.Connection,
    Hvac.Models.Domain,
    Hvac.Cqrs,
    Hvac.Commands.GetState.Query,
    Hvac.Commands.GetState.Result;

type
    IGetStateHandler = interface
        function Handle(const ARequest: IGetStateQuery): IGetStateResult;
    end;

    TGetStateHandler = class(TCqrsHandler, IGetStateHandler)
    public
        function Handle(const ARequest: IGetStateQuery): IGetStateResult;
    end;

implementation

uses
    SysUtils;

{ TGetStateHandler }

function TGetStateHandler.Handle(const ARequest: IGetStateQuery): IGetStateResult;
var
    hvacState: THvacState;
    connection: THvacConnection;
begin
    result := TGetStateResult.Create();
    try
        try
            connection := THvacConnection.Create(Logger, ARequest.Host, ARequest.Port);
            hvacState := connection.GetState();
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