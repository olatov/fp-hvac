unit Hvac.Commands.SetState.Command;

{$mode objfpc}

interface

uses
    Hvac.Cqrs,
    Hvac.Models.Domain;

type
    ISetStateCommand = interface(ICqrsRequest)
        function GetHost(): string;
        procedure SetHost(AValue: string);
        function GetPort(): word;
        procedure SetPort(AValue: word);
        function GetState(): THvacState;
        procedure SetState(AValue: THvacState);
        property Host: string read GetHost write SetHost;
        property Port: word read GetPort write SetPort;
        property State: THvacState read GetState write SetState;
    end;

    TSetStateCommand = class(TInterfacedObject, ISetStateCommand)
    private
        FHost: string;
        FPort: word;
        FState: THvacState;
    public
        function GetHost(): string;
        procedure SetHost(AValue: string);
        function GetPort(): word;
        procedure SetPort(AValue: word);
        function GetState(): THvacState;
        procedure SetState(AValue: THvacState);
        property Host: string read GetHost write SetHost;
        property Port: word read GetPort write SetPort;
        property State: THvacState read GetState write SetState;
        constructor Create(AState: THvacState; AHost: string = 'localhost'; APort: word = 12416);
    end;

implementation

{ TSetStateCommand }

constructor TSetStateCommand.Create(AState: THvacState; AHost: string = 'localhost'; APort: word = 12416);
begin
    FHost := AHost;
    FPort := APort;
    FState := AState;
end;

function TSetStateCommand.GetHost(): string;
begin
    result := FHost;
end;

procedure TSetStateCommand.SetHost(AValue: string);
begin
    FHost := AValue;
end;

function TSetStateCommand.GetPort(): word;
begin
    result := FPort;
end;

procedure TSetStateCommand.SetPort(AValue: word);
begin
    FPort := AValue;
end;

function TSetStateCommand.GetState(): THvacState;
begin
    result := FState;
end;

procedure TSetStateCommand.SetState(AValue: THvacState);
begin
    FState := AValue;
end;

end.