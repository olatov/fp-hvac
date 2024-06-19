unit Hvac.Connection;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses
    Classes,
    Ssockets,
    EventLog,
    Hvac.Models.Protocol,
    Hvac.Models.Domain;

type 
    THvacConnection = class(TComponent)
        private 
            FPort: integer;
            FHost: string;
            FLogger: TEventLog;
            FSocketHandler: TSocketHandler;
            FSocket: TInetSocket;
            property Logger: TEventLog read FLogger;
            property HvacSocket: TInetSocket read FSocket write FSocket;
            procedure Connect();
            procedure Disconnect();

        public
            constructor Create(
                AConnectionString: string;
                ALogger: TEventLog;
                AOwner: TComponent = Nil);
            destructor Destroy();
            procedure SetState(AState: THvacState);
            function GetState(): THvacState;
    end;

implementation

uses 
    SysUtils;

{ THvacConnection }

constructor THvacConnection.Create(
    AConnectionString: string;
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

destructor THvacConnection.Destroy();
begin
    FSocketHandler.Free();
    inherited;
end;

procedure THvacConnection.Connect();
begin
    try
        FSocketHandler := TSocketHandler.Create();
        HvacSocket := TInetSocket.Create(FHost, FPort, FSocketHandler);
        HvacSocket.ConnectTimeout := 2000;

        Logger.Debug('Connecting to %s:%d', [FHost, FPort]);
        HvacSocket.Connect();
        Logger.Debug('Connected to %s:%d', [FHost, FPort]);
    except
        Logger.Error('Error connecting to %s:%d', [FHost, FPort]);
        Disconnect();
        raise;
    end;
end;

procedure THvacConnection.Disconnect();
begin
    FSocketHandler.Close();
    HvacSocket.Free();    
end;

function THvacConnection.GetState(): THvacState;
var 
    request, response: THvacPacket;
    count: integer;
begin
    try
        Logger.Debug('GetState');
        Connect();

        request := THvacPacket.Create(HvacGetStateCommand);
        Logger.Debug('Sending READ cmd to Hvac...');
        count := FSocketHandler.Send(request, SizeOf(request));
        Logger.Debug('Sent %d bytes', [count]);
        if count <> SizeOf(request) then
            raise Exception.Create('Error sending');

        Logger.Debug('Waiting data from Hvac...');
        count := FSocketHandler.Recv(response, SizeOf(response));
        Logger.Debug('Received %d bytes', [count]);

        if count <> SizeOf(response) then
        begin
            Logger.Debug('Bytes count mismatch: %d', [count]);
            raise Exception.Create('Invalid response');
        end;

        if (not response.VerifyChecksum()) then
        begin
            Logger.Debug('Checksum mismatch');
            raise Exception.Create('Invalid response');
        end;

        result := response.Config.ToHvacState();
        Logger.Debug('State read ok.');

    finally
        Disconnect();

    end;
end;

procedure THvacConnection.SetState(AState: THvacState);
var 
    request: THvacPacket;
    count: integer;
begin
    try
        Logger.Debug('SetState');
        Connect();

        request := THvacPacket.Create(HvacSetStateCommand);
        request.Config := THvacConfig.FromHvacState(AState);
        request.RefreshChecksum();

        Logger.Debug('Sending WRITE cmd to Hvac...');
        count := HvacSocket.Write(request, SizeOf(request));
        Logger.Debug('Sent %d bytes', [count]);
        if count <> SizeOf(request) then begin
            Logger.Debug('Bytes count mismatch: %d', [count]);
            raise Exception.Create('Error sending');
        end;

        Logger.Debug('State written ok.');

    finally
        Disconnect();
        Sleep(750);

    end;
end;

end.
