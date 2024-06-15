#!/usr/bin/env sh

pas2js \
    -Jirtl.js \
    -Tbrowser \
    -Fu"../Hvac.Units/" \
    -Fu"../Hvac.Units/Models/" \
    -Jc \
    -Jm \
    -Jmbasedir="." \
    -o"wwwroot/hvac.web.js" \
    Hvac.Web.pp
