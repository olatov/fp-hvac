program Hvac.Simulator;

{$mode objfpc}{$H+}

uses 
  SysUtils,
  StrUtils,
  EventLog,
  Hvac.Simulator.Server;

var 
  Server: THvacSimulator;
  Value: String;
  StdOutBuf: Char;
  StdErrBuf: Char;
  Logger: TEventLog;
  Port: Word = 12416;
  Iface: String = 'localhost';

begin
  SetTextBuf(StdOut, StdOutBuf, SizeOf(StdOutBuf));
  SetTextBuf(StdErr, StdErrBuf, SizeOf(StdErrBuf));

  Logger := TEventLog.Create(Nil);
  Logger.LogType := ltStdOut;
  Logger.Info('Starting Hvac Simulator');

  Value := GetEnvironmentVariable('LISTEN_IFACE');
  Iface := IfThen(Value.IsEmpty, Iface, Value);

  Port := StrToIntDef(GetEnvironmentVariable('LISTEN_PORT'), Port);

  Server := THvacSimulator.Create(IFace, Port, Logger);
  try
    Logger.Info(Format('Listening on %s port %d', [Iface, Port]));
    Server.StartAccepting;
  finally
    FreeAndNil(Server);
    FreeAndNil(Logger);
  end;
end.
