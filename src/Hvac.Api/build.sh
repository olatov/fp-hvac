#!/usr/bin/env sh

if [ "$1" = "dev" ]; then
    FPC_OPTIONS="-ghl"
elif [ "$1" = "release" ]; then
    FPC_OPTIONS="-XX -O3"
fi

fpc \
    $FPC_OPTIONS \
    -Fu"../Hvac.Units/" \
    -Fu"../Hvac.Units/Models/" \
    -o"out/Hvac.Api" \
    Hvac.Api.pp
