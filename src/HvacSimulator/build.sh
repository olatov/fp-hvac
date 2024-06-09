#!/usr/bin/env sh

if [ "$1" = "dev" ]; then
    FPC_OPTIONS="-ghl"
elif [ "$1" = "release" ]; then
    FPC_OPTIONS="-XX -O3"
fi

fpc \
    $FPC_OPTIONS \
    -Fu"../HvacUnits/" \
    -o"out/HvacSimulatorApp" \
    HvacSimulatorApp.pp
