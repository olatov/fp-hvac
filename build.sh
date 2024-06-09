#!/usr/bin/env sh

if [ "$1" = "dev" ]; then
    FPC_OPTIONS="-gl"
elif [ "$1" = "release" ]; then
    FPC_OPTIONS="-XX -O3"
fi

fpc \
    $FPC_OPTIONS \
    -Fu"src/units/" \
    -o"out/HvacApi" \
    src/HvacApi.pp
