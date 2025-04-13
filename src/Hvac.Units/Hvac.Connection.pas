unit Hvac.Connection;

{$mode objfpc}{$H+}
{$modeswitch AdvancedRecords}

interface

uses
  Classes, EventLog, SSockets,
  Hvac.Models.Protocol,
  Hvac.Models.Domain;

type
  THvacConnection = class(TComponent)
  private 
    FPort: Word;
    FHost: String;
    FLogger: TEventLog;
    property Logger: TEventLog read FLogger;
    function SendPacket(ASocket: TInetSocket; APacket: THvacPacket): THvacPacket;

  public
    constructor Create(
      ALogger: TEventLog;
      AHost: String = 'localhost';
      APort: Word = 12416;
      AOwner: TComponent = Nil); reintroduce;
    function SetState(AState: THvacState): THvacState;
    function GetState: THvacState;
  end;

implementation

uses 
  SysUtils;

{ THvacConnection }

constructor THvacConnection.Create(
  ALogger: TEventLog;
  AHost: String = 'localhost';
  APort: Word = 12416;
  AOwner: TComponent = Nil);
begin
  inherited Create(AOwner);

  FLogger := ALogger;
  FHost := AHost;
  FPort := APort;
end;

function THvacConnection.SendPacket(ASocket: TInetSocket; APacket: THvacPacket): THvacPacket;
var
  Count: Integer;
begin
  Logger.Debug('Sending packet to Hvac...');

  Count := ASocket.Write(APacket, SizeOf(APacket));
  if Count <> SizeOf(APacket) then
    raise Exception.Create('Error sending');

  Logger.Debug('Waiting response from Hvac...');

  Count := ASocket.Read(Result, SizeOf(Result));
  if count <> SizeOf(Result) then
  begin
    Logger.Debug('Bytes count mismatch: %d', [count]);
    raise Exception.Create('Invalid response');
  end;

  if not result.VerifyChecksum then
  begin
    Logger.Debug('Checksum mismatch');
    raise Exception.Create('Invalid response');
  end;
end;

function THvacConnection.GetState: THvacState;
var 
  Request, Response: THvacPacket;
  Socket: TInetSocket = Nil;
begin
  Logger.Debug('GetState');
  
  Logger.Debug('Connecting to Hvac on %s:%d...', [FHost, FPort]);
  try
    Socket := TInetSocket.Create(FHost, FPort, 2000);
    Request := THvacPacket.Create(HvacGetStateCommand);
    Logger.Debug('Sending READ cmd to Hvac...');
    Response := SendPacket(Socket, Request);
    Result := Response.Config.ToHvacState;
    Logger.Debug('State read ok.');

  finally
    FreeAndNil(Socket);

  end;
end;

function THvacConnection.SetState(AState: THvacState): THvacState;
var 
  Request, Response: THvacPacket;
  Socket: TInetSocket = Nil;
begin
  Logger.Debug('SetState');

  Logger.Debug('Connecting to Hvac on %s:%d...', [FHost, FPort]);
  try
    Socket := TInetSocket.Create(FHost, FPort, 2000);
    Request := THvacPacket.Create(HvacSetStateCommand);
    Request.Config := THvacConfig.FromHvacState(AState);
    Request.RefreshChecksum;

    Logger.Debug('Sending WRITE cmd to Hvac...');
    Response := SendPacket(Socket, Request);
    Result := response.Config.ToHvacState;
    Logger.Debug('State updated ok.');

  finally
    FreeAndNil(Socket);

  end;
end;

end.
