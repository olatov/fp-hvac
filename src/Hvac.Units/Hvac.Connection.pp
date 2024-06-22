unit Hvac.Connection;

{$mode objfpc}
{$modeswitch AdvancedRecords}

interface

uses
    Classes,
    EventLog,
    SSockets,
    Hvac.Models.Protocol,
    Hvac.Models.Domain;

type 
    THvacConnection = class(TComponent)
        private 
            FPort: integer;
            FHost: ansistring;
            FLogger: TEventLog;
            property Logger: TEventLog read FLogger;
            function SendPacket(ASocket: TInetSocket; APacket: THvacPacket): THvacPacket;

        public
            constructor Create(
                AConnectionString: ansistring;
                ALogger: TEventLog;
                AOwner: TComponent = Nil);
            function SetState(AState: THvacState): THvacState;
            function GetState(): THvacState;
    end;

implementation

uses 
    SysUtils;

{ THvacConnection }

constructor THvacConnection.Create(
    AConnectionString: ansistring;
    ALogger: TEventLog;
    AOwner: TComponent = Nil);
var 
    elems: TStringArray;
begin
    inherited Create(AOwner);

    FLogger := ALogger;
    try
        elems := AConnectionString.Split(':');
        if Length(elems) <> 2 then
            raise Exception.Create('Invalid connection string');

        FHost := elems[0];
        FPort := StrToInt(elems[1]);

    except
        raise Exception.Create('Invalid connection string');

    end;
end;

function THvacConnection.SendPacket(ASocket: TInetSocket; APacket: THvacPacket): THvacPacket;
var
    count: integer;
begin
    Logger.Debug('Sending packet to Hvac...');

    count := ASocket.Write(APacket, SizeOf(APacket));
    if count <> SizeOf(APacket) then
        raise Exception.Create('Error sending');

    Logger.Debug('Waiting response from Hvac...');

    count := ASocket.Read(result, SizeOf(result));
    if count <> SizeOf(result) then
    begin
        Logger.Debug('Bytes count mismatch: %d', [count]);
        raise Exception.Create('Invalid response');
    end;

    if (not result.VerifyChecksum()) then
    begin
        Logger.Debug('Checksum mismatch');
        raise Exception.Create('Invalid response');
    end;
end;

function THvacConnection.GetState(): THvacState;
var 
    request, response: THvacPacket;
    socket: TInetSocket;
begin
    Logger.Debug('GetState');
    
    try
        socket := TInetSocket.Create(FHost, FPort, 2000);

        request := THvacPacket.Create(HvacGetStateCommand);
        Logger.Debug('Sending READ cmd to Hvac...');
        response := SendPacket(socket, request);
        result := response.Config.ToHvacState();
        Logger.Debug('State read ok.');

    finally
        socket.Free();

    end;
end;

function THvacConnection.SetState(AState: THvacState): THvacState;
var 
    request, response: THvacPacket;
    socket: TInetSocket;
begin
    Logger.Debug('SetState');

    try
        socket := TInetSocket.Create(FHost, FPort, 2000);

        request := THvacPacket.Create(HvacSetStateCommand);
        request.Config := THvacConfig.FromHvacState(AState);
        request.RefreshChecksum();

        Logger.Debug('Sending WRITE cmd to Hvac...');
        response := SendPacket(socket, request);
        result := response.Config.ToHvacState();
        Logger.Debug('State updated ok.');

    finally
        socket.Free();

    end;
end;

end.
