unit Hvac.Connection;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses 
    Classes,
    Ssockets,
    Hvac.Models;

type 
    THvacConnection = record
        private 
            FPort: integer;
            FHost: string;
            FSocket: TInetSocket;
            property Socket: TInetSocket read FSocket write FSocket;
            procedure Connect();
            procedure Disconnect();

        public
            constructor Create(AConnectionString: string);
            procedure SetState(state: THvacState);
            function GetState(): THvacState;
    end;

implementation

uses 
    SysUtils;

{ THvacConnection }

constructor THvacConnection.Create(AConnectionString: string);
var 
    elems:   TStringArray;
begin
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

procedure THvacConnection.Connect();

var 
    socketHandler:   TSocketHandler;
begin
    socketHandler := TSocketHandler.Create();
    Socket := TInetSocket.Create(FHost, FPort, socketHandler);
    Socket.Connect();
end;

procedure THvacConnection.Disconnect();
begin
    Socket.Free();
end;

function THvacConnection.GetState(): THvacState;
var 
    request, response: THvacPacket;
    count: integer;
    tries: integer = 0;
begin
    try
        Connect();

        request := THvacPacket.Create(HvacGetStateCommand);
        count := Socket.Write(request, SizeOf(request));
        if count <> SizeOf(request) then
            raise Exception.Create('Error sending');

        repeat
            Inc(tries);
            count := Socket.Read(response, SizeOf(response));
            if count = SizeOf(response) then
                break;

            Sleep(50);
        until tries >= 20;

        if (count <> SizeOf(response)) or (not response.VerifyChecksum()) then
            raise Exception.Create('Invalid response');

        result := THvacState.FromHvacConfig(response.Config);

    finally
        Disconnect();
        Sleep(250);

    end;
end;

procedure THvacConnection.SetState(state: THvacState);
var 
    request:   THvacPacket;
    count:   integer;
begin
    try
        Connect();

        request := THvacPacket.Create(HvacSetStateCommand);
        request.Config := state.ToHvacConfig();
        request.RefreshChecksum();

        count := Socket.Write(request, SizeOf(request));
        if count <> SizeOf(request) then
            raise Exception.Create('Error sending');

    finally
        Disconnect();
        Sleep(500);

    end;
end;

end.
