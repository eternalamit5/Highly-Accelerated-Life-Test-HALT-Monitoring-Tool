/*
 * protocol.h
 *
 *  Created on: Mar 5, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_COMMUNICATION_PROTOCOL_H_
#define COMPONENTS_COMMUNICATION_PROTOCOL_H_

#include "../components/Communication/LPG_MQTT/App/lpg_mqtt.h"
#include "../components/Communication/InfluxClient/influxdbApp.h"
#include "../components/Communication/BLE/App/UARTProfile/BLEMultiByteUART/ClientUserApp.h"
#include "../components/Communication/BLE/App/UARTProfile/BLEMultiByteUART/ServerUserApp.h"

class comm_protocol{
public:
	typedef enum{
		DISABLE=0,
		ENABLE=1
	}selector;

	typedef struct{
		selector MQTTClient_en;
		mqttClient_t::policy_t& MQTTClientPolicy;
		selector influxClient_en;
		influxdb_cpp::policy_t& InfluxdbClientPolicy;
		uint8_t numberOfBLEClientSupported;
		selector BLEClientConnection1_en;
		BLEClientProfile_MultiByteUART::uartpolicy_t& bleClientPolicyConnection1;
		selector BLEClientConnection2_en;
		BLEClientProfile_MultiByteUART::uartpolicy_t& bleClientPolicyConnection2;
		selector BLEClientConnection3_en;
		BLEClientProfile_MultiByteUART::uartpolicy_t& bleClientPolicyConnection3;
		selector BLEClientConnection4_en;
		BLEClientProfile_MultiByteUART::uartpolicy_t& bleClientPolicyConnection4;
		selector BLEClientConnection5_en;
		BLEClientProfile_MultiByteUART::uartpolicy_t& bleClientPolicyConnection5;
		selector BLEClientConnection6_en;
		BLEClientProfile_MultiByteUART::uartpolicy_t& bleClientPolicyConnection6;
		selector BLEClientConnection7_en;
		BLEClientProfile_MultiByteUART::uartpolicy_t& bleClientPolicyConnection7;
		selector BLEServer_en;
		BLEServer_ProfileMultiByteUART::uartpolicy_t& bleServerPolicy;
	}usage_policy;

	typedef enum{
		TCP_SOCKET=0,
		UDP_SOCKET,
		WEBSOCKET,
		MQTT,
		BLE_CLIENT_CONN_1,
		BLE_CLIENT_CONN_2,
		BLE_CLIENT_CONN_3,
		BLE_CLIENT_CONN_4,
		BLE_CLIENT_CONN_5,
		BLE_CLIENT_CONN_6,
		BLE_CLIENT_CONN_7,
		BLE_SERVER,
		SUB_GHZ_868MHZ,
		INFLUXCLIENT
	}gateway_comm_interface;

public:
	mqttClient_t* mqttClient;
	SemaphoreHandle_t mqttClient_AccessSem;
	influxdb_cpp::server_info* influxClient;
	SemaphoreHandle_t influxClient_AccessSem;
	uint8_t numberOfBLEClientSupported;
	BLEClientManager_MultiByteUart* bleClientManager;
	BLEClientProfile_MultiByteUART* bleClient_Connection1;
	SemaphoreHandle_t bleClient_Connection1_AccessSem;
	BLEClientProfile_MultiByteUART* bleClient_Connection2;
	SemaphoreHandle_t bleClient_Connection2_AccessSem;
	BLEClientProfile_MultiByteUART* bleClient_Connection3;
	SemaphoreHandle_t bleClient_Connection3_AccessSem;
	BLEClientProfile_MultiByteUART* bleClient_Connection4;
	SemaphoreHandle_t bleClient_Connection4_AccessSem;
	BLEClientProfile_MultiByteUART* bleClient_Connection5;
	SemaphoreHandle_t bleClient_Connection5_AccessSem;
	BLEClientProfile_MultiByteUART* bleClient_Connection6;
	SemaphoreHandle_t bleClient_Connection6_AccessSem;
	BLEClientProfile_MultiByteUART* bleClient_Connection7;
	SemaphoreHandle_t bleClient_Connection7_AccessSem;
	BLEServer_ProfileMultiByteUART* bleserver;
	SemaphoreHandle_t bleServer_AccessSem;
	usage_policy* policy;
private:
	static comm_protocol* instance;
	comm_protocol(usage_policy& policy);

public:
	static comm_protocol* getInstance();
	static comm_protocol* startService(usage_policy& policy);
	static bool lockSensorCommResource(gateway_comm_interface interface);
	static bool unlockSensorCommResource(gateway_comm_interface interface);
	~comm_protocol();
};



#endif /* COMPONENTS_COMMUNICATION_PROTOCOL_H_ */
