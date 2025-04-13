unit Hvac.Helpers.Enums;

{$mode objfpc}
{$LongStrings on}

{$ifdef PAS2JS}
  {$fail 'Incompatible with Pas2JS'}
{$endif}

interface

uses
  SysUtils,
  FPJson;

generic function EnumToJsonArray<T>: TJsonArray;
generic function EnumToStringArray<T>: TStringArray;

implementation

uses
  TypInfo;

generic function EnumToJsonArray<T>: TJsonArray;
var 
  Item: T;
  Value: String = '';
begin
  Result := TJsonArray.Create;
  for Item in T do
  begin
    Str(Item, Value);
    Result.Add(Value);
  end;
end;

generic function EnumToStringArray<T>: TStringArray;
var 
  Item: T;
  Value: String = '';
begin
  Result := Nil;
  for Item in T do
  begin
    Str(Item, Value);
    SetLength(Result, Length(Result) + 1);
    Result[High(Result)] := Value;
  end;
end;

end.
