#!/usr/bin/env sh

if [ "$1" = "release" ]; then
    FPC_OPTIONS="-XX -O3"
else
    FPC_OPTIONS="-ghl"
fi

podman run --rm -it -v ..:/src --arch amd64 freepascal/fpc:3.2.2-full fpc \
    $FPC_OPTIONS \
    -Fu"/src/Hvac.Units/*" \
    /src/Hvac.Api/Hvac.Api.pp
