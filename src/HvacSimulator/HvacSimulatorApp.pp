program HvacSimulatorApp;

{$mode objfpc}{$H+}

uses 
    SysUtils,
    StrUtils,
    HvacSimulator;

const 
    Port: word = 12416;
    Iface: string = 'localhost';

var 
    Server: THvacSimulator;
    Value: string;
    StdOutBuf: array[1..8] of char;
    StdErrBuf: array[1..8] of char;

begin
    SetTextBuf(StdOut, StdOutBuf);
    SetTextBuf(StdErr, StdErrBuf);

    Value := GetEnvironmentVariable('LISTEN_IFACE');
    Iface := IfThen(string.IsNullOrWhiteSpace(Value), Iface, Value);

    Port := StrToIntDef(GetEnvironmentVariable('LISTEN_PORT'), Port);

    Server := THvacSimulator.Create(IFace, Port);
    try
        Writeln(Format('Listening on %s port %d', [Iface, Port]));
        Server.StartAccepting();
    finally
        Server.Free();
    end;
end.
