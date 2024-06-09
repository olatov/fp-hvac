program HvacApiApp;

{$mode objfpc}{$H+}
{$modeswitch TypeHelpers}

uses 
  {$ifdef UNIX}
    cthreads,
    cmem,
  {$endif}
    Classes,
    fpHttpApp,
    httpRoute,
    SysUtils,
    StrUtils,
    HvacApi;

const 
    DefaultPort = 9090;
    HvacConnectionString: string = 'localhost:12416';

var 
    Value: string;
    HvacApiInstance: THvacApi;

begin
    Application.Port := StrToIntDef(GetEnvironmentVariable('LISTEN_PORT'), DefaultPort);
    Application.Threaded := false;
    Writeln(Format('Listening port %d', [Application.Port]));

    Value := GetEnvironmentVariable('HVAC_CONNECTION_STRING');
    HvacConnectionString := IfThen(string.IsNullOrWhiteSpace(value), HvacConnectionString, value);
    
    HvacApiInstance := THvacApi.Create(
        HvacConnectionString,
        GetEnvironmentVariable('ALLOW_ORIGIN'));

    HvacApiInstance.RegisterRoutes(HttpRouter());

    Application.Initialize();
    Application.Run();

    HvacApiInstance.Free();
end.
