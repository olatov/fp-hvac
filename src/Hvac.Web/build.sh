#!/usr/bin/env sh

pas2js \
    -Jirtl.js \
    -Tbrowser \
    -Fu"../Hvac.Units/" \
    -Fu"../Hvac.Units/Models/" \
    -Jc \
    -Jm \
    -Jminclude \
    -o"wwwroot/hvac.web.js" \
    Hvac.Web.pp
    