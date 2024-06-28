unit Hvac.Commands.Dispatcher;

{$mode objfpc}

interface

uses
    EventLog,
    Hvac.Cqrs,

    Hvac.Commands.GetEnums.Query,
    Hvac.Commands.GetEnums.Result,
    Hvac.Commands.GetEnums.Handler,

    Hvac.Commands.GetState.Query,
    Hvac.Commands.GetState.Result,
    Hvac.Commands.GetState.Handler,

    Hvac.Commands.SetState.Command,
    Hvac.Commands.SetState.Result,
    Hvac.Commands.SetState.Handler;

type
    ICommandDispatcher = interface
        function Execute(const AQuery: IGetEnumsQuery): IGetEnumsResult;
        function Execute(const AQuery: IGetStateQuery): IGetStateResult;
        function Execute(const ACommand: ISetStateCommand): ISetStateResult;

        function GetLogger(): TEventLog;
        procedure SetLogger(AValue: TEventLog);
        property Logger: TEventLog read GetLogger write SetLogger;
    end;

    TCommandDispatcher = class(TInterfacedObject, ICommandDispatcher)
    private
        FLogger: TEventLog;
    public
        function Execute(const AQuery: IGetEnumsQuery): IGetEnumsResult;
        function Execute(const AQuery: IGetStateQuery): IGetStateResult;
        function Execute(const ACommand: ISetStateCommand): ISetStateResult;

        function GetLogger(): TEventLog;
        procedure SetLogger(AValue: TEventLog);
        property Logger: TEventLog read GetLogger write SetLogger;
        constructor Create(ALogger: TEventLog);
    end;    

implementation

{ TCommandDispatcher }

constructor TCommandDispatcher.Create(ALogger: TEventLog);
begin
    inherited Create();
    Logger := ALogger;
end;

function TCommandDispatcher.Execute(const AQuery: IGetEnumsQuery): IGetEnumsResult;
begin
    result := TGetEnumsHandler.Create(Logger).Handle(AQuery);
end;

function TCommandDispatcher.Execute(const AQuery: IGetStateQuery): IGetStateResult;
begin
    result := TGetStateHandler.Create(Logger).Handle(AQuery);
end;

function TCommandDispatcher.Execute(const ACommand: ISetStateCommand): ISetStateResult;
begin
    result := TSetStateHandler.Create(Logger).Handle(ACommand);
end;

function TCommandDispatcher.GetLogger(): TEventLog;
begin
    result := FLogger;
end;

procedure TCommandDispatcher.SetLogger(AValue: TEventLog);
begin
    FLogger := AValue;
end;

end.