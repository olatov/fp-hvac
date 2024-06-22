program Hvac.Api;

{
    /**
     * This is the main application for the HVAC API. It initializes and runs the web API application.
     * 
     * HVAC_CONNECTION_STRING: The connection string for the HVAC device or a simulator. Default value is 'localhost:12416'.
     * LISTEN_PORT: The port on which the application listens. Default value is 9090.
     * API_KEY: The API key used for authentication. Default is empty (no authentication).
     * ALLOW_ORIGIN: The allowed origin for cross-origin resource sharing (CORS). Default is empty.
     * 
     **/
}

{$mode objfpc}{$H+}
{$modeswitch TypeHelpers}

uses 
  {$ifdef Unix}
    cthreads,
    cmem,
    BaseUnix,
  {$endif}
    Classes,
    HttpRoute,
    EventLog,
    SysUtils,
    StrUtils,
    Hvac.Api.Application;

const 
    DefaultPort = 9090;
    DefaultHvacConnectionString = 'localhost:12416';

var 
    HvacConnectionString: string;
    App: THvacApiApplication;
    Logger: TEventLog;
    StdOutBuf: array[1..1] of char;
    StdErrBuf: array[1..1] of char;

procedure SignalHandler(signal: cint); cdecl;
begin
    if Assigned(App) then
        App.Terminate();
end;
  
procedure SetupSignalHandlers(const ASignals: array of cint);
var
    sigAction: PSigActionRec;
    signal: cint;
begin
    New(sigAction);
    sigAction^.sa_handler := SigActionHandler(@SignalHandler);
    FillByte(sigAction^.sa_mask, SizeOf(sigAction^.sa_mask), 0);
    sigAction^.sa_flags := 0;

    for signal in ASignals do
        FpSigAction(signal, sigAction, nil);

    Dispose(sigAction);
end;

begin
    SetTextBuf(StdOut, StdOutBuf, SizeOf(StdOutBuf));
    SetTextBuf(StdErr, StdErrBuf, SizeOf(StdErrBuf));

    Logger := TEventLog.Create(nil);
    Logger.LogType := ltStdOut;

    HvacConnectionString := GetEnvironmentVariable('HVAC_CONNECTION_STRING');
    HvacConnectionString := IfThen(
        not string.IsNullOrWhiteSpace(HvacConnectionString),
        HvacConnectionString,
        DefaultHvacConnectionString);

    App := THvacApiApplication.Create(
        Logger,
        HttpRouter(),
        StrToIntDef(GetEnvironmentVariable('LISTEN_PORT'), DefaultPort),
        HvacConnectionString);

    App.ApiKey := GetEnvironmentVariable('API_KEY');
    App.AllowOrigin := GetEnvironmentVariable('ALLOW_ORIGIN');

    try
        App.Threaded := true;
        App.AcceptIdleTimeout := 5000;
        App.Initialize();

        {$ifdef Unix}
            SetupSignalHandlers([SigInt, SigTerm]);
        {$endif}

        App.Run();

    finally
        App.Free();
        Logger.Free();

    end;
end.
