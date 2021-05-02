/*
 * policies.h
 *
 *  Created on: Mar 10, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_POLICIES_H_
#define COMPONENTS_POLICIES_H_

#include "commons.h"
#include "../components/Communication/peripheral_communication.h"
#include "../components/Communication/protocol.h"
#include "../components/Sensors/BMI160/App/BMI160App.h"
#include "../components/Sensors/BME280/App/BME280App.h"
#include "../components/Sensors/GPS/App/GPSApp.h"
#include "../components/Storage/SDcard/App/storage.h"
#include "../components/Storage/NVS/App/NVSAppApp.h"
#include "../components/ErrorHandler/errorHandler.h"

namespace device{
	typedef struct{
		std::string deviceType;
		std::string deviceUUID;
		std::string networkID;
		std::string description;
	}properties;
}

namespace webserver{
	typedef struct{
	 std::string url;
	}configuration;
}

extern webserver::configuration webServer;
extern device::properties devProperties;
extern BMI160App::sensorPolicy BMI160_policy1;
extern BME280App::sensorPolicy BME280_policy1;
extern GPSApp::sensorPolicy GPS_policy1;
extern comm_hardware::usage_policy uptime_sensor_node_comm_hardware_policy;
extern comm_protocol::usage_policy protocol_usage_policy1;
extern mqttClient_t::policy_t mqtt_client_policy1;
extern influxdb_cpp::policy_t influxdb_client_policy1;
extern BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy1;
extern BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy2;
extern BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy3;
extern BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy4;
extern BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy5;
extern BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy6;
extern BLEClientProfile_MultiByteUART::uartpolicy_t ble_client_uart_policy7;
extern BLEServer_ProfileMultiByteUART::uartpolicy_t ble_server_uart_policy;
extern NVSApp::storageAttributes_t nvs_storage_attributes1;
extern errorHandler::error_policy_t error_policy1;


#endif /* COMPONENTS_POLICIES_H_ */
