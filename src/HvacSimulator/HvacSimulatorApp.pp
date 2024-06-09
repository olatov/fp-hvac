
program HvacSimulatorApp;

{$mode objfpc}{$H+}

uses 
SysUtils,
StrUtils,
HvacSimulator;

const 
    Port:   word =   12416;
    Iface:   string =   'localhost';

var 
    Server:   THvacSimulator;
    value:   string;

begin
    value := GetEnvironmentVariable('LISTEN_IFACE');
    Iface := IfThen(string.IsNullOrWhiteSpace(value), Iface, value);

    Port := StrToIntDef(GetEnvironmentVariable('LISTEN_PORT'), Port);

    Server := THvacSimulator.Create(IFace, Port);
    Writeln(Format('Listening on %s port %d', [Iface, Port]));
    Server.StartAccepting();

    Server.Free();
end.
