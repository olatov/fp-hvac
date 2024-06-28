unit Hvac.Commands.GetEnums.Query;

{$mode objfpc}

interface

uses
    Hvac.Cqrs;

type
    IGetEnumsQuery = interface(ICqrsRequest)
    end;

    TGetEnumsQuery = class(TInterfacedObject, IGetEnumsQuery)
    end;

implementation

end.
