unit Hvac.Helpers.Enum;

{$mode objfpc}{$H+}

interface

uses 
    FPJson;

generic function EnumToStr<T>(value: T): string;
generic function StrToEnum<T>(value: string): T;
generic function EnumToJsonArray<T>(): TJsonArray;

implementation

uses
    Classes,
    SysUtils;

generic function EnumToStr<T>(value: T): string;
begin
    WriteStr(result, value);
end;

generic function StrToEnum<T>(value: string): T;
begin
    ReadStr(value, result);
end;

generic function EnumToJsonArray<T>(): TJsonArray;
var 
    item:   T;
begin
    result := TJsonArray.Create();
    for item in T do
        result.Add(specialize EnumToStr<T>(item));
end;

end.
