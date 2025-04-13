unit Hvac.Simulator.Server;

{$mode objfpc}{$H+}

interface

uses
  Sockets,
  Ssockets,
  EventLog,
  Hvac.Types.Core,
  Hvac.Models.Domain,
  Hvac.Models.Protocol;

type
  THvacSimulator = class(TInetServer)
  private
    FLogger: TEventLog;
    FIndoorTemperature: Double;
    FState: THvacState;
    property State: THvacState read FState write FState;
    property Logger: TEventLog read FLogger;
    procedure PrintState;
    procedure ClientHandler(Sender: TObject; AData: TSocketStream);

  public
    constructor Create(
      const AHost: String;
      const APort: Word;
      ALogger: TEventLog;
      AHandler : TSocketHandler = Nil);
  end;

implementation

uses
  SysUtils,
  StrUtils,
  TypInfo;

procedure THvacSimulator.PrintState();
begin
  Logger.Info('[%s]', [DateTimeToStr(Now)]);
  Logger.Info('%12s | %s', ['Power', IfThen(State.Power, 'On', 'Off')]);
  Logger.Info('%12s | %.1f', ['Indoor temp', FIndoorTemperature]);
  Logger.Info('%12s | %d', ['Desired temp', State.DesiredTemperature]);
  Logger.Info('%12s | %s', ['Temp scale', GetEnumName(Typeinfo(TTemperatureScale), Ord(State.TemperatureScale))]);
  Logger.Info('%12s | %s', ['Mode', GetEnumName(Typeinfo(THvacMode), Ord(State.Mode))]);
  Logger.Info('%12s | %s', ['Fan',GetEnumName(Typeinfo(TFanSpeed), Ord(State.FanSpeed))]);
  Logger.Info('%12s | %s', ['Flow', GetEnumName(Typeinfo(THorizontalFlowMode), Ord(State.HorizontalFlowMode))]);
  Logger.Info('%12s | %s', ['Turbo', IfThen(State.Turbo, 'On', 'Off')]);
  Logger.Info('%12s | %s', ['Quiet', IfThen(State.Quiet, 'On', 'Off')]);
  Logger.Info('%12s | %s', ['Display', IfThen(State.Display, 'On', 'Off')]);
  Logger.Info('%12s | %s', ['Health', IfThen(State.Health, 'On', 'Off')]);
  Logger.Info('%12s | %s', ['Drying', IfThen(State.Drying, 'On', 'Off')]);
  Logger.Info('%12s | %s', ['Sleep', IfThen(State.Sleep, 'On', 'Off')]);
  Logger.Info('%12s | %s', ['Eco', IfThen(State.Eco, 'On', 'Off')]);
  Logger.Info('%12s---%s', ['--', '--']);
end;

procedure THvacSimulator.ClientHandler(Sender: TObject; AData: TSocketStream);
var
  Request, Response: THvacPacket;
  HvacConfig: THvacConfig;
  Count: Integer;
begin
  Logger.Info('Incoming connection');

  try
    Count := AData.Read(Request, SizeOf(Request));
    if Count <> SizeOf(Request) then
    begin
      Logger.Error('Error reading');
      Exit;
    end;

    if not Request.VerifyChecksum then
    begin
      Logger.Error('Invalid checksum');
      Exit;
    end;

    case Request.Command of
      HvacGetStateCommand:
        begin
          Response := THvacPacket.Create(HvacGetStateCommand);
          HvacConfig := THvacConfig.FromHvacState(State);
          HvacConfig.IndoorTemperatureIntegral := Random(10) + 18;
          HvacConfig.IndoorTemperatureFractional := Random(2) * 5;
          FIndoorTemperature := HvacConfig.IndoorTemperatureIntegral 
            + (HvacConfig.IndoorTemperatureFractional * 0.1);
          Response.Config := HvacConfig;
          Response.RefreshChecksum;
          Count := AData.Write(Response, SizeOf(Response));
        end;

      HvacSetStateCommand:
        begin
          State := Request.Config.ToHvacState;
          Sleep(500);

          HvacConfig := THvacConfig.FromHvacState(State);
          HvacConfig.IndoorTemperatureIntegral := Random(10) + 18;
          HvacConfig.IndoorTemperatureFractional := Random(2) * 5;
          FIndoorTemperature := HvacConfig.IndoorTemperatureIntegral 
            + (HvacConfig.IndoorTemperatureFractional * 0.1);
          Response.Config := HvacConfig;
          Response.RefreshChecksum;
          Count := AData.Write(Response, SizeOf(Response));
        end;
    end;
    PrintState;

  finally
    FreeAndNil(AData)

  end;
end;

constructor THvacSimulator.Create(
  const AHost: String;
  const APort: Word;
  ALogger: TEventLog;
  AHandler : TSocketHandler = Nil);
begin
  inherited Create(AHost, APort, AHAndler);

  FLogger := ALogger;
  OnConnect := @ClientHandler;

  FState.DesiredTemperature := 22;
  FIndoorTemperature := 23.0;

  PrintState;
end;

end.
