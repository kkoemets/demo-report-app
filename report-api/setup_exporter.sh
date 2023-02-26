#!/bin/bash

# This script is used to setup the highcharts-export-server for the backend
export ACCEPT_HIGHCHARTS_LICENSE="1"
export HIGHCHARTS_USE_STYLED=""
export HIGHCHARTS_USE_MAPS=""
export HIGHCHARTS_MOMENT=""
export HIGHCHARTS_USE_GANTT=""

sed -i 's/getOptionals(cdnScriptsOptional, true)/\/\/&/' node_modules/highcharts-export-server/build.js

node node_modules/highcharts-export-server/build.js
