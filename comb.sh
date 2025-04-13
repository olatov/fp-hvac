#!/bin/bash

export API_KEY="xyzab416"
export ALLOW_ORIGIN="*"

/app/Hvac.Simulator &
/app/Hvac.Api &
sleep infinity
