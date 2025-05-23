unit Hvac.Cqrs.Dispatcher;

{$mode objfpc}

interface

uses
  EventLog,
  Hvac.Cqrs,
  Hvac.Cqrs.Commands.GetEnums,
  Hvac.Cqrs.Commands.GetState,
  Hvac.Cqrs.Commands.SetState;

type
  ICommandDispatcher = interface
    function GetLogger: TEventLog;
    procedure SetLogger(AValue: TEventLog);
    property Logger: TEventLog read GetLogger write SetLogger;
    function Execute(const AQuery: IGetEnumsQuery): IGetEnumsResult;
    function Execute(const AQuery: IGetStateQuery): IGetStateResult;
    function Execute(const ACommand: ISetStateCommand): ISetStateResult;
  end;

  { TCommandDispatcher }

  TCommandDispatcher = class(TInterfacedObject, ICommandDispatcher)
  private
    FLogger: TEventLog;
  public
    constructor Create(ALogger: TEventLog);
    function GetLogger: TEventLog;
    procedure SetLogger(AValue: TEventLog);
    property Logger: TEventLog read GetLogger write SetLogger;
    function Execute(const AQuery: IGetEnumsQuery): IGetEnumsResult;
    function Execute(const AQuery: IGetStateQuery): IGetStateResult;
    function Execute(const ACommand: ISetStateCommand): ISetStateResult;
  end;

implementation

uses
  SysUtils;

{ TCommandDispatcher }

constructor TCommandDispatcher.Create(ALogger: TEventLog);
begin
  inherited Create;
  Logger := ALogger;
end;

function TCommandDispatcher.Execute(const AQuery: IGetEnumsQuery): IGetEnumsResult;
var
  Handler: IGetEnumsHandler;
begin
  Handler := TGetEnumsHandler.Create(Logger);
  Result := Handler.Handle(AQuery);
end;

function TCommandDispatcher.Execute(const AQuery: IGetStateQuery): IGetStateResult;
var
  Handler: IGetStateHandler;
begin
  Handler := TGetStateHandler.Create(Logger);
  Result := Handler.Handle(AQuery);
end;

function TCommandDispatcher.Execute(const ACommand: ISetStateCommand): ISetStateResult;
var
  Handler: ISetStateHandler;
begin
  Handler := TSetStateHandler.Create(Logger);
  Result := Handler.Handle(ACommand);
end;

function TCommandDispatcher.GetLogger: TEventLog;
begin
  Result := FLogger;
end;

procedure TCommandDispatcher.SetLogger(AValue: TEventLog);
begin
  FLogger := AValue;
end;

end.
