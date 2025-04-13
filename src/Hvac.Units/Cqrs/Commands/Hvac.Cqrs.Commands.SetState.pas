unit Hvac.Cqrs.Commands.SetState;

{$mode objfpc}{$H+}

interface

uses
  Hvac.Cqrs,
  Hvac.Models.Domain;

type
  ISetStateCommand = interface(ICqrsRequest)
    ['{A3425513-7320-4E62-AC24-0AA7210750A5}']    
    function GetHost: String;
    procedure SetHost(AValue: string);
    function GetPort: Word;
    procedure SetPort(AValue: Word);
    function GetState: THvacState;
    procedure SetState(AValue: THvacState);
    property Host: String read GetHost write SetHost;
    property Port: Word read GetPort write SetPort;
    property State: THvacState read GetState write SetState;
  end;

  ISetStateResult = interface(ICqrsResult)
    ['{2A54CE04-83DA-41D9-9BFD-34026A3DAC70}']
    function GetResult: THvacState;
    procedure SetResult(AValue: THvacState);
    property Result: THvacState read GetResult write SetResult;
  end;

  ISetStateHandler = interface
    ['{4AD3AC0C-6164-4CCF-8DE6-27150573C644}']
    function Handle(const ARequest: ISetStateCommand): ISetStateResult;
  end;  

  TSetStateCommand = class(TInterfacedObject, ISetStateCommand)
  private
    FHost: String;
    FPort: Word;
    FState: THvacState;
  public
    function GetHost: String;
    procedure SetHost(AValue: String);
    function GetPort: word;
    procedure SetPort(AValue: Word);
    function GetState: THvacState;
    procedure SetState(AValue: THvacState);
    property Host: String read GetHost write SetHost;
    property Port: Word read GetPort write SetPort;
    property State: THvacState read GetState write SetState;
    constructor Create(AState: THvacState; AHost: String = 'localhost'; APort: Word = 12416);
  end;

  TSetStateResult = class(TCqrsResult, ISetStateResult)
  private
    FResult: THvacState;
  public
    function GetResult: THvacState;
    procedure SetResult(AValue: THvacState);
    property Result: THvacState read GetResult write SetResult;
  end;  

  TSetStateHandler = class(TCqrsHandler, ISetStateHandler)
  public
    function Handle(const ARequest: ISetStateCommand): ISetStateResult;
  end;

implementation

uses
  SysUtils,
  Hvac.Connection;

{ TSetStateCommand }

constructor TSetStateCommand.Create(AState: THvacState; AHost: String = 'localhost'; APort: Word = 12416);
begin
  FHost := AHost;
  FPort := APort;
  FState := AState;
end;

function TSetStateCommand.GetHost: String;
begin
  Result := FHost;
end;

procedure TSetStateCommand.SetHost(AValue: String);
begin
  FHost := AValue;
end;

function TSetStateCommand.GetPort: Word;
begin
  Result := FPort;
end;

procedure TSetStateCommand.SetPort(AValue: Word);
begin
  FPort := AValue;
end;

function TSetStateCommand.GetState: THvacState;
begin
  Result := FState;
end;

procedure TSetStateCommand.SetState(AValue: THvacState);
begin
  FState := AValue;
end;

{ TSetStateResult }

function TSetStateResult.GetResult: THvacState;
begin
  Result := FResult;
end;

procedure TSetStateResult.SetResult(AValue: THvacState);
begin
  FResult := AValue;
end;

{ TSetStateHandler }

function TSetStateHandler.Handle(const ARequest: ISetStateCommand): ISetStateResult;
var
  Connection: THvacConnection;
begin
  result := TSetStateResult.Create;
  try
    try
      Connection := THvacConnection.Create(Logger, ARequest.Host, ARequest.Port);
      Result.Result := Connection.SetState(ARequest.State);
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