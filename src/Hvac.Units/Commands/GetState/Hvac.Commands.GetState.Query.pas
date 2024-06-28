unit Hvac.Commands.GetState.Query;

{$mode objfpc}

interface

uses
    Hvac.Cqrs;

type
    IGetStateQuery = interface(ICqrsRequest)
        function GetHost(): string;
        procedure SetHost(AValue: string);
        function GetPort(): word;
        procedure SetPort(AValue: word);
        property Host: string read GetHost write SetHost;
        property Port: word read GetPort write SetPort;
    end;

    TGetStateQuery = class(TInterfacedObject, IGetStateQuery)
    private
        FHost: string;
        FPort: word;
    public
        function GetHost(): string;
        procedure SetHost(AValue: string);
        function GetPort(): word;
        procedure SetPort(AValue: word);
        property Host: string read GetHost write SetHost;
        property Port: word read GetPort write SetPort;
        constructor Create(AHost: string = 'localhost'; APort: word = 12416);
    end;

implementation

{ TGetStateQuery }

constructor TGetStateQuery.Create(AHost: string = 'localhost'; APort: word = 12416);
begin
    FHost := AHost;
    FPort := APort;
end;

function TGetStateQuery.GetHost(): string;
begin
    result := FHost;
end;

procedure TGetStateQuery.SetHost(AValue: string);
begin
    FHost := AValue;
end;

function TGetStateQuery.GetPort(): word;
begin
    result := FPort;
end;

procedure TGetStateQuery.SetPort(AValue: word);
begin
    FPort := AValue;
end;

end.