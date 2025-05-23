#!/usr/bin/env sh
   
if [ "$1" = "release" ]; then
    FPC_OPTIONS="-XX -O3"
else
    FPC_OPTIONS="-ghl"
fi

fpc \
    $FPC_OPTIONS \
    -Fu"../Hvac.Units/" \
    -Fu"../Hvac.Units/*" \
    -Fu"../Hvac.Units/Models/" \
    -Fu"../Hvac.Units/Models/*" \
    -Fu"../Hvac.Units/Cqrs/" \
    -Fu"../Hvac.Units/Cqrs/*" \
    -o"out/Hvac.Api" \
    Hvac.Api.lpr
