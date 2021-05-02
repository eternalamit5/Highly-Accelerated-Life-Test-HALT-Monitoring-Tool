/*
 * policies.cpp
 *
 *  Created on: Mar 10, 2020
 *      Author: karsh
 */
#include "policies.h"

webserver::configuration webServer={
		.url="http://192.168.0.104:1515"
};

device::properties devProperties={
		.deviceType = "",
		.deviceUUID = "1",
		.networkID =  "1",
		.description = "sector 1, sub-sector 1, motion and stress sensor node"
};


BMI160App::sensorPolicy BMI160_policy1 ={
		.sensor_en=BMI160App::selector::ENABLE,
		.sensorElementID="1",
		.description="",
		.measurement_type="MotionSense",
		.measurement_topic="uptime/telemetry",
		.log_msg_topic="uptime/log/bmi160",
		.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_0,
		.peripheralCommAddress=0x69,
		.telemetryInterface=comm_protocol::gateway_comm_interface::MQTT,
		.gyroscopeRange=BMI160HAL::gyroRange_t::GYRO_250,
		.gyro_x_offset=0,
		.gyro_y_offset=0,
		.gyro_z_offset=0,
		.gyro_scaleCorrection=0,
		.gyro_bais=0,
		.accelerometerRange=BMI160HAL::accelRange_t::ACC_2G,
		.acc_x_offset=0,
		.acc_y_offset=0,
		.acc_z_offset=0,
		.acc_scaleCorrection=0,
		.sample_frequency = 1
};

BME280App::sensorPolicy BME280_policy1 ={
		.sensor_en=GPSApp::selector::DISABLE,
		.sensorElementID="1",
		.description="uptime/telemetry",
		.measurement_type="EvnSense",
		.measurement_topic="uptime/telemetry",
		.log_msg_topic="uptime/log/bme280",
		.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_0,
		.peripheralCommAddress=0x77,
		.telemetryInterface=comm_protocol::gateway_comm_interface::MQTT,
		.seaLevelAtmosphericPressure=1006.0,
		.sample_frequency=1
};

GPSApp::sensorPolicy GPS_policy1 ={
		.sensor_en=SensorBase::selector::DISABLE,
		.sensorElementID="1",
		.description="",
		.measurement_type="LocationSense",
		.measurement_topic="uptime/telemetry",
		.log_msg_topic="uptime/log/GPS",
		.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_0,
		.peripheralCommAddress=0x42,
		.telemetryInterface=comm_protocol::gateway_comm_interface::MQTT,
		.sample_frequency=1
};

comm_hardware::usage_policy uptime_sensor_node_comm_hardware_policy={ // @suppress("Invalid arguments")
		.uart0_en=comm_hardware::selector::DISABLE,
		.uart0_txpin=-1, //-1 means default, default pin is 1
		.uart0_rxpin=-1, //-1 means default, default pin is 3
		.uart0_config=SERIAL_8N1,
		.uart0_baud=115200,

		.uart1_en=comm_hardware::selector::DISABLE,
		.uart1_txpin=-1, //-1 means default, default pin is 10
		.uart1_rxpin=-1, //-1 means default, default pin is 9
		.uart1_config=SERIAL_8N1,
		.uart1_baud=115200,


		.uart2_en=comm_hardware::selector::DISABLE,
		.uart2_txpin=-1, //-1 means default, default pin is 17
		.uart2_rxpin=-1, //-1 means default, default pin is 16
		.uart2_config=SERIAL_8N1,
		.uart2_baud=115200,


		.i2c0_en=comm_hardware::selector::ENABLE,
		.i2c0_sda= 33,
		.i2c0_scl= 32,
		.i2c0_frequency=50*1000,

		.i2c1_en=comm_hardware::selector::DISABLE,
		.i2c1_sda= 23,
		.i2c1_scl= 22,
		.i2c1_frequency=50*1000,

		.HSSPI_en =comm_hardware::selector::DISABLE,
		.HSSPI_sck = 13, //-1 means default, default pin is 13
		.HSSPI_miso = 12, //-1 means default, default pin is 12
		.HSSPI_mosi = 14, //-1 means default, default pin is 14
		.HSSPI_ss = 15, //-1 means default, default pin is 15

		.LSSPI_en =comm_hardware::selector::ENABLE,
		.LSSPI_sck = 18, //-1 means default, default pin is 18
		.LSSPI_miso = 19, //-1 means default, default pin is 19
		.LSSPI_mosi = 21, //-1 means default, default pin is 21
		.LSSPI_ss = 2, //-1 means default, default pin is 2

		.wifi_en = comm_hardware::selector::ENABLE,
		.wifi_enable_smartConnect = false,
		.wifi_ssid= "TP-LINK_AA70",//"biba-testbed",
		.wifi_password= "07909924",//"she26ghr01",
		.wifi_reconnAttempt=10,
		.wifi_disconnectionUsercb=wifi_DisconnectionUserCallback,
		.wifi_connectionUsercb=wifi_ConnectionUserCallback,

		.sdcard_en = SDCardStorage::selector::ENABLE,
		.sdcard_interface = comm_hardware::sensor_comm_interface::LS_SPI,

		.indicator_en =comm_hardware::selector::DISABLE,
		.indicator_pin = 27
};



mqttClient_t::policy_t mqtt_client_policy1={
		.MQTTClient_URI=string("mqtt://192.168.0.104:1886"),
		.MQTTClient_port=1886,
		.MQTTClient_keepAliveTimeout=1000,
		.MQTTClient_appEventCB=NULL,
		.MQTTClient_qos=1,
		.MQTTClient_enableCleanSession=true,
		.MQTTClient_enableAutoReconnect=true,
		.MQTTClient_lastWillTopic="",
		.MQTTClient_lastWillMsg=""
};


influxdb_cpp::policy_t influxdb_client_policy1={
		.host_="192.168.0.103",//"134.102.96.205",
		.port_=8086,
		.db_="mydb",
		.usr_="karsh",
		.pwd_="karsh"
};


BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy1={ // @suppress("Invalid arguments")
	.deviceName="bleClient1",
	.maxDeviceSupported=1,
	.maxDeviceToScan=10,
	.scanDuration_sec=5,
	.scanInterval_In_msec=1349,
	.scanWindow_In_msec=449,
	.bonded_dev_list_count=1,
	.service_uuid="0000ffa0-0000-1000-8000-00805f9b34fb",
	.tx_char_uuid="0000ffa2-0000-1000-8000-00805f9b34fb", //Notification, tx from server side
	.rx_char_uuid="0000ffab-0000-1000-8000-00805f9b34fb", //RW Characteristic, rx from server side
	.bondedDevAddress="04:ee:03:4a:91:64",//"80:6f:b0:1f:01:49",
	.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC // @suppress("Symbol is not resolved")
};

BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy2={ // @suppress("Invalid arguments")
	.deviceName="bleClient2",
	.maxDeviceSupported=1,
	.maxDeviceToScan=10,
	.scanDuration_sec=5,
	.scanInterval_In_msec=1349,
	.scanWindow_In_msec=449,
	.bonded_dev_list_count=1,
	.service_uuid="0000fff0-0000-1000-8000-000000000005",
	.tx_char_uuid="0000fff2-0000-1000-8000-00805f9b34fb",
	.rx_char_uuid="0000fff1-0000-1000-8000-00805f9b34fb",
	.bondedDevAddress="c4:4f:33:0f:22:b7",
	.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC // @suppress("Symbol is not resolved")
};


BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy3={ // @suppress("Invalid arguments")
	.deviceName="bleClient3",
	.maxDeviceSupported=1,
	.maxDeviceToScan=10,
	.scanDuration_sec=5,
	.scanInterval_In_msec=1349,
	.scanWindow_In_msec=449,
	.bonded_dev_list_count=1,
	.service_uuid="0000fff0-0000-1000-8000-00805f9b34fb",
	.tx_char_uuid="0000fff2-0000-1000-8000-00805f9b34fb",
	.rx_char_uuid="0000fff1-0000-1000-8000-00805f9b34fb",
	.bondedDevAddress="",
	.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC // @suppress("Symbol is not resolved")
};

BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy4={ // @suppress("Invalid arguments")
	.deviceName="bleClient1",
	.maxDeviceSupported=1,
	.maxDeviceToScan=10,
	.scanDuration_sec=5,
	.scanInterval_In_msec=1349,
	.scanWindow_In_msec=449,
	.bonded_dev_list_count=1,
	.service_uuid="0000fff0-0000-1000-8000-00805f9b34fb",
	.tx_char_uuid="0000fff2-0000-1000-8000-00805f9b34fb",
	.rx_char_uuid="0000fff1-0000-1000-8000-00805f9b34fb",
	.bondedDevAddress="c4:4f:33:0f:20:a3",
	.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC // @suppress("Symbol is not resolved")
};

BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy5={ // @suppress("Invalid arguments")
	.deviceName="bleClient2",
	.maxDeviceSupported=1,
	.maxDeviceToScan=10,
	.scanDuration_sec=5,
	.scanInterval_In_msec=1349,
	.scanWindow_In_msec=449,
	.bonded_dev_list_count=1,
	.service_uuid="0000fff0-0000-1000-8000-000000000005",
	.tx_char_uuid="0000fff2-0000-1000-8000-00805f9b34fb",
	.rx_char_uuid="0000fff1-0000-1000-8000-00805f9b34fb",
	.bondedDevAddress="c4:4f:33:0f:22:b7",
	.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC // @suppress("Symbol is not resolved")
};


BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy6={ // @suppress("Invalid arguments")
	.deviceName="bleClient3",
	.maxDeviceSupported=1,
	.maxDeviceToScan=10,
	.scanDuration_sec=5,
	.scanInterval_In_msec=1349,
	.scanWindow_In_msec=449,
	.bonded_dev_list_count=1,
	.service_uuid="0000fff0-0000-1000-8000-00805f9b34fb",
	.tx_char_uuid="0000fff2-0000-1000-8000-00805f9b34fb",
	.rx_char_uuid="0000fff1-0000-1000-8000-00805f9b34fb",
	.bondedDevAddress="",
	.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC // @suppress("Symbol is not resolved")
};


BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy7={ // @suppress("Invalid arguments")
	.deviceName="bleClient3",
	.maxDeviceSupported=1,
	.maxDeviceToScan=10,
	.scanDuration_sec=5,
	.scanInterval_In_msec=1349,
	.scanWindow_In_msec=449,
	.bonded_dev_list_count=1,
	.service_uuid="0000fff0-0000-1000-8000-00805f9b34fb",
	.tx_char_uuid="0000fff2-0000-1000-8000-00805f9b34fb",
	.rx_char_uuid="0000fff1-0000-1000-8000-00805f9b34fb",
	.bondedDevAddress="",
	.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC // @suppress("Symbol is not resolved")
};

BLEServer_ProfileMultiByteUART::uartpolicy_t ble_server_uart_policy={ // @suppress("Invalid arguments")
		.deviceName="bleServer5",
		.service_uuid="0000fff0-0000-1000-8000-000000000005",
		.tx_char_uuid="0000fff2-0000-1000-8000-00805f9b34fb",
		.rx_char_uuid="0000fff1-0000-1000-8000-00805f9b34fb",
		.serverDevAddress="c4:4f:33:07:4c:ff",
		.serverDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC // @suppress("Symbol is not resolved")
};


comm_protocol::usage_policy protocol_usage_policy1={
		.MQTTClient_en=comm_protocol::selector::ENABLE,
		.MQTTClientPolicy=mqtt_client_policy1,
		.influxClient_en=comm_protocol::selector::DISABLE,
		.InfluxdbClientPolicy=influxdb_client_policy1,
		.BLEClientConnection1_en=comm_protocol::selector::DISABLE,
		.bleClientPolicyConnection1=ble_client_uart_policy1,
		.BLEClientConnection2_en=comm_protocol::selector::DISABLE,
		.bleClientPolicyConnection2=ble_client_uart_policy2,
		.BLEClientConnection3_en=comm_protocol::selector::DISABLE,
		.bleClientPolicyConnection3=ble_client_uart_policy3,
		.BLEClientConnection4_en=comm_protocol::selector::DISABLE,
		.bleClientPolicyConnection4=ble_client_uart_policy4,
		.BLEClientConnection5_en=comm_protocol::selector::DISABLE,
		.bleClientPolicyConnection5=ble_client_uart_policy5,
		.BLEClientConnection6_en=comm_protocol::selector::DISABLE,
		.bleClientPolicyConnection6=ble_client_uart_policy6,
		.BLEClientConnection7_en=comm_protocol::selector::DISABLE,
		.bleClientPolicyConnection7=ble_client_uart_policy7,
		.BLEServer_en = comm_protocol::selector::DISABLE,
		.bleServerPolicy = ble_server_uart_policy
};


NVSApp::storageAttributes_t nvs_storage_attributes1={
		"reboot_cnt",
		"p_wifi_ssid",
		"p_wifi_pass",
		"p_mqtt_ip",
		"p_mqtt_port",
		"s_wifi_ssid",
		"s_wifi_pass",
		"s_mqtt_ip",
		"s_mqtt_port",
		"device_id"
};



errorHandler::error_policy_t error_policy1={
		.std_exception=errorHandler::error_reporting_action_e::TOGGLE_LED_4HZ,
		.error_major=errorHandler::error_reporting_action_e::TOGGLE_LED_4HZ,
		.error_minor=errorHandler::error_reporting_action_e::TOGGLE_LED_2HZ,
		.warn_major=errorHandler::error_reporting_action_e::TOGGLE_LED_1HZ,
		.warn_minor=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG
};
