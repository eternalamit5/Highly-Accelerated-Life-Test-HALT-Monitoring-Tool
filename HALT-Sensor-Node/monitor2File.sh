#!/bin/bash

# this function is called when Ctrl-C is sent
function trap_ctrlc ()
{
	geany logs/$now.log 
}
 
# initialise trap to call trap_ctrlc function
# when signal 2 (SIGINT) is received
trap "trap_ctrlc" 2


IDF=/home/karsh/projects/github/repo/esp32DevEnvSetup/esp-idf
echo "Setting IDF_PATH with $IDF"
export "IDF_PATH=$IDF"
now=$(date +"%m_%d_%Y")
echo "log file saved as $now.log in current directory"
make monitor | tee -a logs/$now.log

sleep 10000
