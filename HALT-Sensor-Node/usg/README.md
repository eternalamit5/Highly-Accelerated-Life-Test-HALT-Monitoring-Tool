# Universal Sensor Gateway

## ESP-WROOM-32D Pin Configuration

GPIO | PIN | Functionality | Description | Comment
--|--|--|--|--
0 || Boot Button | General IO |  
1 || UART TX0    | FTDI UART | 
2 || HS2_DATA0   | quad SPI | 
3 || UART RX0    | FTDI UART | 
4 || HS2_DATA1   | quad SPI | 
5 || CS SD Card  | SPI Chip Select | OPTIONAL
6 || FLASH SCK   | Internal Flash ESP32 | 
7 || FLASH DO    | Internal Flash ESP32 | 
8 || FLASH D1    | Internal Flash ESP32 | 
9 || FLASH D2    | Internal Flash ESP32 | U1RXD via Jumper
10 || FLASH D3   | Internal Flash ESP32 | U1TXD via Jumper
11 |  | FLASH CMD | Internal Flash ESP32
12 |  | HS2_DATA2 / TDI | quad SPI | ALSO: JTAG segger
13 |  | HS2_DATA3 / TCK | quad SPI | ALSO: JTAG segger
14 |  | HS2_CLK / TMS | quad SPI | ALSO: JTAG segger
15 |  | HS2_CMD / TDO | quad SPI | ALSO: JTAG segger
16 |  | UART RX2 | CELL UART |
17 |  | UART TX2 | CELL UART |
18 |  | VSPI SCK | mikroBUS SPI |
19 |  | VSPI MISO / Q | mikroBUS SPI |
20 |  |  |  | N/A
21 |  | CS mikroBUS | SPI Chip Select | OPTIONAL
22 |  | Ext.IO | General IO | OPTIONAL
23 |  | VSPI MOSI / D | mikroBUS SPI |
24 |  |  |  | N/A
25 |  | SARA-R4 PWR | General IO |
26 |  | SARA-R4 RESET | General IO |
27 |  | User LED | General IO | OPTIONAL
28 |  |  |  | N/A
29 |  |  |  | N/A
30 |  |  |  | N/A
31 |  |  |  | N/A
32 |  | I2C SCL | Sensor I2C |
33 |  | I2C SDA | Sensor I2C |
34 |  | Ext.Input | General INPUT | OPTIONAL
35 |  |  | General INPUT |
36 |  |  | General INPUT |
37 |  |  |  | N/A
38 |  |  |  | N/A
39 |  |  | General INPUT |
40 |  |  |  | N/A