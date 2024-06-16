#!/usr/bin/env sh

PAS2JS_OPTIONS=""
if [ "$1" != "release" ]; then
    PAS2JS_OPTIONS="-Jc -Jm -Jminclude"
fi

pas2js \
    -Jirtl.js \
    -Tbrowser \
    -Fu"../Hvac.Units/" \
    -Fu"../Hvac.Units/Models/" \
    -o"wwwroot/hvac.web.js" \
    $PAS2JS_OPTIONS \
    Hvac.Web.pp
    