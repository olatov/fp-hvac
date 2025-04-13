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
    CThreads, BaseUnix,
  {$endif}
    Classes, SysUtils, StrUtils,
    HttpRoute, EventLog,
    Hvac.Api.Application;

const 
  DefaultPort = 9090;
  DefaultHvacConnectionString = 'localhost:12416';

var 
  HvacConnectionString: String;
  App: THvacApiApplication;
  Logger: TEventLog;
  StdOutBuf: Char = #0;
  StdErrBuf: Char = #0;

procedure SignalHandler(ASignal: CInt); cdecl;
begin
  if not Assigned(App) then Exit;
  App.Terminate;
end;
  
procedure SetupSignalHandlers(const ASignals: array of CInt);
var
  SigAction: PSigActionRec;
  Signal: CInt;
begin
  New(SigAction);
  SigAction^.sa_handler := SigActionHandler(@SignalHandler);
  FillByte(SigAction^.sa_mask, SizeOf(SigAction^.sa_mask), 0);
  SigAction^.sa_flags := 0;

  for Signal in ASignals do
    FpSigAction(Signal, SigAction, Nil);

  FreeMemAndNil(SigAction);
end;

begin
  SetTextBuf(StdOut, StdOutBuf, SizeOf(StdOutBuf));
  SetTextBuf(StdErr, StdErrBuf, SizeOf(StdErrBuf));

  Logger := TEventLog.Create(Nil);
  Logger.LogType := ltStdOut;

  HvacConnectionString := GetEnvironmentVariable('HVAC_CONNECTION_STRING');
  HvacConnectionString := IfThen(
    not HvacConnectionString.IsEmpty,
      HvacConnectionString,
      DefaultHvacConnectionString);

  App := THvacApiApplication.Create(
    Logger,
    HttpRouter,
    StrToIntDef(GetEnvironmentVariable('LISTEN_PORT'), DefaultPort),
    HvacConnectionString);

  App.ApiKey := GetEnvironmentVariable('API_KEY');
  App.AllowOrigin := GetEnvironmentVariable('ALLOW_ORIGIN');

  try
    App.Threaded := True;
    App.AcceptIdleTimeout := 5000;
    App.Initialize;

    {$ifdef Unix}
      SetupSignalHandlers([SigInt, SigTerm]);
    {$endif}

    App.Run;

  finally
    FreeAndNil(App);
    FreeAndNil(Logger);
  end;
end.
