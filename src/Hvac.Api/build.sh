#!/usr/bin/env sh
   
if [ "$1" = "release" ]; then
    FPC_OPTIONS="-XX -O3"
else
    FPC_OPTIONS="-ghl"
fi

fpc \
    $FPC_OPTIONS \
    -Fu"/home/oleg/code/pas/fp-hvac/src/Hvac.Units/Commands/GetEnums" \
    -Fu"../Hvac.Units/" \
    -Fu"../Hvac.Units/*" \
    -Fu"../Hvac.Units/Models/" \
    -Fu"../Hvac.Units/Models/*" \
    -Fu"../Hvac.Units/Commands/" \
    -Fu"../Hvac.Units/Commands/*" \
    -o"out/Hvac.Api" \
    Hvac.Api.lpr
