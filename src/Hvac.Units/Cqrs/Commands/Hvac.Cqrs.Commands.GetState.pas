unit Hvac.Cqrs.Commands.GetState;

{$mode objfpc}{$H+}

interface

uses
  Hvac.Cqrs,
  Hvac.Models.Domain;

type
  IGetStateQuery = interface(ICqrsRequest)
    ['{2D106097-DB6E-47A5-BA77-03545386B7EE}']
    function GetHost: String;
    procedure SetHost(AValue: String);
    function GetPort: Word;
    procedure SetPort(AValue: Word);
    property Host: String read GetHost write SetHost;
    property Port: Word read GetPort write SetPort;
  end;

  IGetStateResult = interface(ICqrsResult)
    ['{DA5DA781-8DEA-43E7-8D0B-F8B9C46D007C}']
    function GetResult: THvacState;
    procedure SetResult(AValue: THvacState);
    property Result: THvacState read GetResult write SetResult;
  end;

  IGetStateHandler = interface
    ['{D960F238-38D7-42DD-906B-964DA86C1604}']
    function Handle(const ARequest: IGetStateQuery): IGetStateResult;
  end; 

  TGetStateQuery = class(TInterfacedObject, IGetStateQuery)
  private
    FHost: String;
    FPort: Word;
  public
    function GetHost: String;
    procedure SetHost(AValue: String);
    function GetPort: Word;
    procedure SetPort(AValue: Word);
    property Host: string read GetHost write SetHost;
    property Port: word read GetPort write SetPort;
    constructor Create(AHost: String = 'localhost'; APort: Word = 12416);
  end;

  TGetStateResult = class(TCqrsResult, IGetStateResult)
  private
    FResult: THvacState;
  public
    function GetResult: THvacState;
    procedure SetResult(AValue: THvacState);
    property Result: THvacState read GetResult write SetResult;
  end;  

  TGetStateHandler = class(TCqrsHandler, IGetStateHandler)
  public
    function Handle(const ARequest: IGetStateQuery): IGetStateResult;
  end;

implementation

uses
  SysUtils,
  Hvac.Connection;

{ TGetStateQuery }

constructor TGetStateQuery.Create(AHost: string = 'localhost'; APort: Word = 12416);
begin
  FHost := AHost;
  FPort := APort;
end;

function TGetStateQuery.GetHost: String;
begin
  Result := FHost;
end;

procedure TGetStateQuery.SetHost(AValue: String);
begin
  FHost := AValue;
end;

function TGetStateQuery.GetPort: Word;
begin
  Result := FPort;
end;

procedure TGetStateQuery.SetPort(AValue: Word);
begin
  FPort := AValue;
end;

{ TGetStateResult }

function TGetStateResult.GetResult: THvacState;
begin
  Result := FResult;
end;

procedure TGetStateResult.SetResult(AValue: THvacState);
begin
  FResult := AValue;
end;

{ TGetStateHandler }

function TGetStateHandler.Handle(const ARequest: IGetStateQuery): IGetStateResult;
var
  Connection: THvacConnection;
begin
  Result := TGetStateResult.Create;
  try
    try
      Connection := THvacConnection.Create(Logger, ARequest.Host, ARequest.Port);
      Result.Result := Connection.GetState;
    except
      on E: Exception do
        begin
          Logger.Error(E.Message);
          Result.Errors.Add(E.Message);
        end;
    end;
  finally
    FreeAndNil(Connection);
  end; 
end;

end.