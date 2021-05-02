#!/bin/bash
OPENOCD_DIR_PATH=/home/karsh/Work/Projects/VIC/Virtual-IoT-Component/openocdBinaries/openocd-esp32-linux64-0.10.0-esp32-20190708/openocd-esp32

echo "===================== setting up permission for USB0 port ==============================="
echo "CMD:   sudo chmod -R 777 /dev/ttyUSB0"
sudo chmod -R 777 /dev/ttyUSB0
echo "==================================Session started ===================================="
echo "CMD: $OPENOCD_DIR_PATH/bin/openocd -f $OPENOCD_DIR_PATH/scripts/interface/jlink.cfg -f $OPENOCD_DIR_PATH/scripts/board/esp-wroom-32.cfg"
echo "================================= Session ended ====================================="
sudo $OPENOCD_DIR_PATH/bin/openocd -f $OPENOCD_DIR_PATH/share/openocd/scripts/interface/jlink.cfg -f $OPENOCD_DIR_PATH/share/openocd/scripts/board/esp-wroom-32.cfg -c "adapter_khz 12000"
