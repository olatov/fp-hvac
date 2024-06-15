unit Hvac.Simulator.Server;

{$mode objfpc}{$H+}

interface

uses 
    Sockets,
    Ssockets,
    Hvac.Models.Core,
    Hvac.Models.Domain,
    Hvac.Models.Protocol;

type 
    THvacSimulator = class(TInetServer)
        private 
            FIndoorTemperature: single;
            FState: THvacState;
            procedure PrintState();
            property State: THvacState read FState write FState;
            procedure ClientHandler(Sender: TObject; Data: TSocketStream);

        public 
            constructor Create(const AHost: string; const APort: Word; AHAndler : TSocketHandler = Nil);
    end;

implementation

uses 
    SysUtils,
    StrUtils,
    TypInfo;

procedure THvacSimulator.PrintState();
begin
    WriteLn(Format('[%s]', [DateTimeToStr(Now())]));
    WriteLn(Format('%12s | %s', ['Power',IfThen(State.Power, 'On', 'Off')]));
    WriteLn(Format('%12s | %.1f', ['Indoor temp', FIndoorTemperature]));
    WriteLn(Format('%12s | %d', ['Desired temp', State.DesiredTemperature]));
    WriteLn(Format('%12s | %s', ['Temp scale', GetEnumName(Typeinfo(TTemperatureScale), Ord(State.TemperatureScale))]));
    WriteLn(Format('%12s | %s', ['Mode', GetEnumName(Typeinfo(THvacMode), Ord(State.Mode))]));
    WriteLn(Format('%12s | %s', ['Fan',GetEnumName(Typeinfo(TFanSpeed), Ord(State.FanSpeed))]));
    WriteLn(Format('%12s | %s', ['Flow', GetEnumName(Typeinfo(THorizontalFlowMode), Ord(State.HorizontalFlowMode))]));
    WriteLn(Format('%12s | %s', ['Turbo', IfThen(State.Turbo, 'On', 'Off')]));
    WriteLn(Format('%12s | %s', ['Quiet', IfThen(State.Quiet, 'On', 'Off')]));
    WriteLn(Format('%12s | %s', ['Display', IfThen(State.Display, 'On', 'Off')]));
    WriteLn(Format('%12s | %s', ['Health', IfThen(State.Health, 'On', 'Off')]));
    WriteLn(Format('%12s | %s', ['Drying', IfThen(State.Drying, 'On', 'Off')]));
    WriteLn(Format('%12s | %s', ['Sleep', IfThen(State.Sleep, 'On', 'Off')]));
    WriteLn(Format('%12s | %s', ['Eco', IfThen(State.Eco, 'On', 'Off')]));
    Writeln();
end;

procedure THvacSimulator.ClientHandler(Sender: TObject; Data: TSocketStream);
var 
    request, response: THvacPacket;
    hvacConfig: THvacConfig;
    count: integer;
begin
    Writeln('Incoming connection');

    try
        count := Data.Read(request, SizeOf(request));
        Writeln('Read ', count);
        if (count <> SizeOf(request)) then
            begin
                Writeln('Error reading');
                Exit();
            end;

        if (not request.VerifyChecksum()) then
            begin
                Writeln('Invalid checksum');
                Exit();
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
                                       WriteLn('Setting state');
                                       WriteLn('Desired temp: ', request.Config.DesiredTemperature);
                                       State := request.Config.ToHvacState();
                                   end;
        end;

        PrintState();

    finally
        Data.Free();

        Sleep(500);
    end;
end;

constructor THvacSimulator.Create(const AHost: string; const APort: Word; AHAndler : TSocketHandler = Nil);
begin
    inherited Create(AHost, APort, AHAndler);

    OnConnect := @ClientHandler;

    FState.DesiredTemperature := 22;
    FIndoorTemperature := 23.0;

    PrintState();
end;

end.
