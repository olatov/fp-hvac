unit Hvac.Helpers.Enums;

{$mode objfpc}
{$LongStrings on}

{$ifdef PAS2JS}
    {$fail 'Incompatible with Pas2JS'}
{$endif}

interface

uses
    SysUtils,
    TypInfo,
    FPJson;

generic function EnumToJsonArray<T>(): TJsonArray;
generic function EnumToStringArray<T>(): TStringArray;

implementation

generic function EnumToJsonArray<T>(): TJsonArray;
var 
    item: T;
    value: string = '';
begin
    result := TJsonArray.Create();
    for item in T do
    begin
        Str(item, value);
        result.Add(value);
    end;
end;

generic function EnumToStringArray<T>(): TStringArray;
var 
    item: T;
    value: string = '';
begin
    SetLength(result, 0);
    for item in T do
    begin
        Str(item, value);
        SetLength(result, Length(result) + 1);
        result[High(result)] := value;
    end;
end;

end.
