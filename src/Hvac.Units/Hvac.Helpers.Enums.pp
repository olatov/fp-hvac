unit Hvac.Helpers.Enums;

{$mode objfpc}
{$LongStrings on}

{$ifdef PAS2JS}
    {$fail 'Incompatible with Pas2JS'}
{$endif}

interface

uses
    TypInfo,
    FPJson;

generic function EnumToJsonArray<T>(): TJsonArray;

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

end.
