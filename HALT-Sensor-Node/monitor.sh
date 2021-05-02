#!/bin/bash

IDF=/home/karsh/Work/IDFRepo/LPG_esp_idf
echo "Setting IDF_PATH with $IDF"
export "IDF_PATH=$IDF"
make -j8 monitor
