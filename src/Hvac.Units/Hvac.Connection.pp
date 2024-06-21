unit Hvac.Connection;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses
    Classes,
    EventLog,
    FPAsync,
    FPSock,
    Hvac.Models.Protocol,
    Hvac.Models.Domain;

type 
    THvacConnection = class(TComponent)
        private 
            FPort: integer;
            FHost: string;
            FLogger: TEventLog;
            FEventLoop: TEventLoop;
            FTcpClient: TTcpClient;
            property Logger: TEventLog read FLogger;
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
    SysUtils,
    Sockets,
    Resolve;

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

    FEventLoop := TEventLoop.Create();
end;

destructor THvacConnection.Destroy();
begin
    FEventLoop.Free();
    inherited;
end;

procedure THvacConnection.Connect();
var
   hostResolver: THostResolver;
begin
    try
        FTcpClient := TTcpClient.Create(self);

        if StrToNetAddr(FHost).s_bytes[4] = 0 then
        begin
            hostResolver := THostResolver.Create(nil);
            try
                if not HostResolver.NameLookup(FHost) then
                    raise ESocketError.CreateFmt('Host "%s" not found', [FHost]);

                Logger.Debug('Resolved %s to %s', [FHost, hostResolver.AddressAsString]);
                FTcpClient.Host := hostResolver.AddressAsString;
            finally
                HostResolver.Free();
            end;
        end else
            FTcpClient.Host := FHost;

        FTcpClient.Port := FPort;
        FTcpClient.EventLoop := FEventLoop;

        Logger.Debug('Connecting to %s:%d', [FHost, FPort]);
        FTcpClient.Active := true;
        FEventLoop.Run();

        if FTcpClient.ConnectionState = connConnected then
            Logger.Debug('Connection established.', [FHost, FPort]);
    except
        on E: Exception do
          begin
            Logger.Error(E.Message);
            Disconnect();
            raise;
          end;
    end;
end;

procedure THvacConnection.Disconnect();
begin
    FTcpClient.Active := false;
    FTcpClient.Free();
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
        count := FTcpClient.Stream.Write(request, SizeOf(request));
        Logger.Debug('Sent %d bytes', [count]);
        if count <> SizeOf(request) then
            raise Exception.Create('Error sending');

        Sleep(1000);
        Logger.Debug('Waiting data from Hvac...');
        count := FTcpClient.Stream.Read(response, SizeOf(response));
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
        count := FTcpClient.Stream.Write(request, SizeOf(request));
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
