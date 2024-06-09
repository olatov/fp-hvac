unit HvacConnection;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses 
    ssockets,
    HvacModels;

type
    TDeviceConnection = class
        private
            FPort: integer;
            FHost: string;
            FSocket: TInetSocket;
            property Socket: TInetSocket read FSocket write FSocket;
            procedure Connect();
            procedure Disconnect();

        public
            constructor Create(connectionString: string = 'localhost:12416');
            procedure SetState(state: TDeviceState);
            function GetState(): TDeviceState;
    end;

implementation

uses
    Classes, sysutils;

constructor TDeviceConnection.Create(connectionString: string = 'localhost:12416');
var
    elems: TStringArray;
begin
    try
        elems := connectionString.Split(':');
        if Length(elems) <> 2 then
            raise Exception.Create('Invalid');

        FHost := elems[0];
        FPort := StrToInt(elems[1]);

    except
        raise Exception.Create('Invalid connection string');

    end;
end;

procedure TDeviceConnection.Connect();
var
    socketHandler: TSocketHandler;
begin
    socketHandler := TSocketHandler.Create();
    
    Socket := TInetSocket.Create(FHost, FPort, socketHandler);

    Socket.Connect();
end;

procedure TDeviceConnection.Disconnect();
begin
    Socket.Free();
end;

function TDeviceConnection.GetState(): TDeviceState;
var
    request, response: THvacPacket;
    count: integer;
    tries: integer = 0;
begin
    try
        Connect();

        request := THvacPacket.Create(HvacGetStateCommand);
        count := Socket.Write(request, SizeOf(request));
        if count <> SizeOf(request) then begin
            Writeln('Error sending');
            Exit();
        end;

        repeat
            Inc(tries);
            count := Socket.Read(response, SizeOf(response));
            if count = SizeOf(response) then
                break;

            Writeln('Retrying');
            Sleep(50);
        until tries >= 20;

        if (count <> SizeOf(response)) or (not response.VerifyChecksum()) then begin
            Writeln('Error');
            Exit();
        end;

        result := TDeviceState.FromRawConfig(response.Config);
   
    finally
        Disconnect();
        Sleep(250);

    end;
end;

procedure TDeviceConnection.SetState(state: TDeviceState);
var
    request: THvacPacket;
    count: integer;
begin
    try
        Connect();

        request := THvacPacket.Create(HvacSetStateCommand);
        request.Config := state.ToRawConfig();
        request.RefreshChecksum();

        count := Socket.Write(request, SizeOf(request));
        if count <> SizeOf(request) then
            Writeln('Error sending');

    finally
        Disconnect();
        Sleep(500);

    end;
end;

end.