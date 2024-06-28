program Hvac.Simulator;

{$mode objfpc}{$H+}

uses 
    SysUtils,
    StrUtils,
    EventLog,
    Hvac.Simulator.Server;

const 
    Port: word = 12416;
    Iface: string = 'localhost';

var 
    Server: THvacSimulator;
    Value: string;
    StdOutBuf: array[1..1] of char;
    StdErrBuf: array[1..1] of char;
    Logger: TEventLog;

begin
    SetTextBuf(StdOut, StdOutBuf, SizeOf(StdOutBuf));
    SetTextBuf(StdErr, StdErrBuf, SizeOf(StdErrBuf));

    Logger := TEventLog.Create(nil);
    Logger.LogType := ltStdOut;
    Logger.Info('Starting Hvac Simulator');

    Value := GetEnvironmentVariable('LISTEN_IFACE');
    Iface := IfThen(string.IsNullOrWhiteSpace(Value), Iface, Value);

    Port := StrToIntDef(GetEnvironmentVariable('LISTEN_PORT'), Port);

    Server := THvacSimulator.Create(IFace, Port, Logger);
    try
        Logger.Info(Format('Listening on %s port %d', [Iface, Port]));
        Server.StartAccepting();
    finally
        Server.Free();
        Logger.Free();
    end;
end.
