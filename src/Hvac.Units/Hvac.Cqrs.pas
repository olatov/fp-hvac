unit Hvac.Cqrs;

{$mode objfpc}
{$LongStrings on}

interface

uses
    SysUtils,
    EventLog;

type
    ICqrsRequest = interface
    end;

    ICqrsResult = interface
        function GetIsSuccess(): boolean;
        procedure SetIsSuccess(AValue: boolean);
        function GetErrors(): TStringArray;
        procedure AddError(AValue: string);        
        property IsSuccess: boolean read GetIsSuccess write SetIsSuccess;
        property Errors: TStringArray read GetErrors;
    end;

    TCqrsResult = class(TInterfacedObject, ICqrsResult)
    private
        FIsSuccess: boolean;
        FErrors: TStringArray;
    public
        procedure SetIsSuccess(AValue: boolean);
        function GetIsSuccess(): boolean;
        function GetErrors(): TStringArray;
        procedure AddError(AValue: string);
        property IsSuccess: boolean read GetIsSuccess write SetIsSuccess;
        property Errors: TStringArray read GetErrors;
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

procedure TCqrsResult.SetIsSuccess(AValue: boolean);
begin
    FIsSuccess := AValue;
end;

function TCqrsResult.GetIsSuccess(): boolean;
begin
    result := FIsSuccess;
end;

function TCqrsResult.GetErrors(): TStringArray;
begin
    result := FErrors;
end;

procedure TCqrsResult.AddError(AValue: string);
begin
    SetLength(FErrors, Length(FErrors) + 1);
    FErrors[High(FErrors)] := AValue;
end;

{ TCqrsHandler }

constructor TCqrsHandler.Create(ALogger: TEventLog);
begin
    inherited Create();
    FLogger := ALogger;
end;

end.
