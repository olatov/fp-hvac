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
        FIndoorTemperature: double;
        FState: THvacState;
        property State: THvacState read FState write FState;
        property Logger: TEventLog read FLogger;
        procedure PrintState();
        procedure ClientHandler(Sender: TObject; Data: TSocketStream);

    public
        constructor Create(
            const AHost: string;
            const APort: word;
            ALogger: TEventLog;
            AHandler : TSocketHandler = nil);
    end;

implementation

uses
    SysUtils,
    StrUtils,
    TypInfo;

procedure THvacSimulator.PrintState();
begin
    Logger.Info('[%s]', [DateTimeToStr(Now())]);
    Logger.Info('%12s | %s', ['Power',IfThen(State.Power, 'On', 'Off')]);
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

procedure THvacSimulator.ClientHandler(Sender: TObject; Data: TSocketStream);
var
    request, response: THvacPacket;
    hvacConfig: THvacConfig;
    count: integer;
begin
    Logger.Info('Incoming connection');

    try
        count := Data.Read(request, SizeOf(request));
        if (count <> SizeOf(request)) then
        begin
            Logger.Error('Error reading');
            exit;
        end;

        if (not request.VerifyChecksum()) then
        begin
            Logger.Error('Invalid checksum');
            exit;
        end;

        case request.Command of
            HvacGetStateCommand:
                begin
                    response := THvacPacket.Create(HvacGetStateCommand);
                    hvacConfig := THvacConfig.FromHvacState(State);
                    hvacConfig.IndoorTemperatureIntegral := Random(10) + 18;
                    hvacConfig.IndoorTemperatureFractional := Random(2) * 5;
                    FIndoorTemperature := hvacConfig.IndoorTemperatureIntegral + (
                                          hvacConfig.IndoorTemperatureFractional / 10.0);
                    response.Config := hvacConfig;
                    response.RefreshChecksum();
                    count := Data.Write(response, SizeOf(response));
                end;

            HvacSetStateCommand:
                begin
                    State := request.Config.ToHvacState();
                    Sleep(500);

                    hvacConfig := THvacConfig.FromHvacState(State);
                    hvacConfig.IndoorTemperatureIntegral := Random(10) + 18;
                    hvacConfig.IndoorTemperatureFractional := Random(2) * 5;
                    FIndoorTemperature := hvacConfig.IndoorTemperatureIntegral + (
                                          hvacConfig.IndoorTemperatureFractional / 10.0);
                    response.Config := hvacConfig;
                    response.RefreshChecksum();
                    count := Data.Write(response, SizeOf(response));
                end;
        end;
        PrintState();

    finally
        Data.Free();

    end;
end;

constructor THvacSimulator.Create(
    const AHost: string;
    const APort: word;
    ALogger: TEventLog;
    AHandler : TSocketHandler = nil);
begin
    inherited Create(AHost, APort, AHAndler);

    FLogger := ALogger;
    OnConnect := @ClientHandler;

    FState.DesiredTemperature := 22;
    FIndoorTemperature := 23.0;

    PrintState();
end;

end.
