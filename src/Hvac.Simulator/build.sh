#!/usr/bin/env sh

if [ "$1" = "release" ]; then
    FPC_OPTIONS="-XX -O3"
else
    FPC_OPTIONS="-ghl"
fi

fpc \
    $FPC_OPTIONS \
    -Fu"../*/*" \
    -o"out/Hvac.Simulator" \
    Hvac.Simulator.lpr
