unit Hvac.Types.Generic;

{$mode objfpc}{$H+}

interface

uses
  SysUtils,
  Generics.Collections;

type 
  TStringArrayMap = specialize TDictionary<String, TStringArray>;

implementation

end.
