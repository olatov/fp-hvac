unit Hvac.Cqrs;

{$mode objfpc}{$H+}
{$interfaces com}

interface

uses
  Classes,
  SysUtils,
  EventLog;

type
  ICqrsRequest = interface
    ['{611BC1EF-091B-4ECD-9549-8E2F569B7169}']
  end;

  ICqrsResult = interface
    ['{68052E96-214B-4E80-A6F9-B2E7B091B4A6}']
    function GetSuccess: Boolean;
    function GetErrors: TStringList;
    property Success: Boolean read GetSuccess;
    property Errors: TStringList read GetErrors;
  end;

  generic ICqrsHandler<TRequest: ICqrsRequest; TResult: ICqrsResult> = interface
    ['{AD7BBDEB-F33A-44B5-A6E7-6CF970B74C23}']
    function Handle(const ARequest: TRequest): TResult;
  end;

  TCqrsResult = class(TInterfacedObject, ICqrsResult)
  private
    FErrors: TStringList;
  public
    constructor Create; virtual;
    destructor Destroy; override;
    function GetSuccess: Boolean;
    function GetErrors: TStringList;
    property Success: Boolean read GetSuccess;
    property Errors: TStringList read GetErrors;
  end;

  TCqrsHandler = class(TInterfacedObject)
  protected
    FLogger: TEventLog;
    property Logger: TEventLog read FLogger;
  public
    constructor Create(ALogger: TEventLog);
  end;    

implementation

{ TCqrsResult }

constructor TCqrsResult.Create;
begin
  inherited Create;
  FErrors := TStringList.Create;
end;

destructor TCqrsResult.Destroy;
begin
  FreeAndNil(FErrors);
  inherited Destroy;
end;

function TCqrsResult.GetSuccess: Boolean;
begin
  Result := (FErrors.Count = 0);
end;

function TCqrsResult.GetErrors: TStringList;
begin
  Result := FErrors;
end;

{ TCqrsHandler }

constructor TCqrsHandler.Create(ALogger: TEventLog);
begin
  inherited Create;
  FLogger := ALogger;
end;

end.
