/*
 * protocol.cpp
 *
 *  Created on: Mar 5, 2020
 *      Author: karsh
 */
#include "../components/uptimeApp/policies.h"
#include "protocol.h"

comm_protocol* comm_protocol::instance=NULL;



comm_protocol::comm_protocol(usage_policy& policy):mqttClient(NULL),mqttClient_AccessSem(NULL),
		influxClient(NULL),influxClient_AccessSem(NULL),
		numberOfBLEClientSupported(policy.numberOfBLEClientSupported),
		bleClientManager(NULL),
		bleClient_Connection1(NULL),bleClient_Connection1_AccessSem(NULL),
		bleClient_Connection2(NULL),bleClient_Connection2_AccessSem(NULL),
		bleClient_Connection3(NULL),bleClient_Connection3_AccessSem(NULL),
		bleClient_Connection4(NULL),bleClient_Connection4_AccessSem(NULL),
		bleClient_Connection5(NULL),bleClient_Connection5_AccessSem(NULL),
		bleClient_Connection6(NULL),bleClient_Connection6_AccessSem(NULL),
		bleClient_Connection7(NULL),bleClient_Connection7_AccessSem(NULL),
		bleserver(NULL),bleServer_AccessSem(NULL),
		policy(&policy) {

	//MQTT client setup
	if(policy.MQTTClient_en==comm_protocol::selector::ENABLE){

		mqttClient=mqttClient_t::startServiceBlockingCall(policy.MQTTClientPolicy);
		if(mqttClient == NULL){
			throw EMU_ERR_NULL;
		}

		mqttClient_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( mqttClient_AccessSem );
	}

	//Influx db client setup
	if(policy.influxClient_en==comm_protocol::selector::ENABLE){
		influxClient= new influxdb_cpp::server_info(policy.InfluxdbClientPolicy.host_, policy.InfluxdbClientPolicy.port_,
				policy.InfluxdbClientPolicy.db_, policy.InfluxdbClientPolicy.usr_, policy.InfluxdbClientPolicy.pwd_);
		if(influxClient==NULL){
			throw EMU_ERR_NULL;
		}
		influxClient_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( influxClient_AccessSem );
	}

	if(	(policy.BLEClientConnection1_en==comm_protocol::selector::ENABLE) ||
			(policy.BLEClientConnection2_en==comm_protocol::selector::ENABLE) ||
			(policy.BLEClientConnection3_en==comm_protocol::selector::ENABLE) ||
			(policy.BLEClientConnection4_en==comm_protocol::selector::ENABLE) ||
			(policy.BLEClientConnection5_en==comm_protocol::selector::ENABLE) ||
			(policy.BLEClientConnection6_en==comm_protocol::selector::ENABLE) ||
			(policy.BLEClientConnection7_en==comm_protocol::selector::ENABLE)) {
		bleClientManager = new BLEClientManager_MultiByteUart(policy.numberOfBLEClientSupported);
		if(bleClientManager==NULL){
			throw EMU_ERR_NULL;
		}
	}

	if(policy.BLEClientConnection1_en==comm_protocol::selector::ENABLE){
		bleClient_Connection1 = bleClientManager->addServerConnection(policy.bleClientPolicyConnection1);
		bleClientManager->runAutoReconnectTask(*bleClient_Connection1);
		bleClient_Connection1_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( bleClient_Connection1_AccessSem );
	}

	if(policy.BLEClientConnection2_en==comm_protocol::selector::ENABLE){
		bleClient_Connection2 = bleClientManager->addServerConnection(policy.bleClientPolicyConnection2);
		bleClientManager->runAutoReconnectTask(*bleClient_Connection2);
		bleClient_Connection2_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( bleClient_Connection2_AccessSem );
	}

	if(policy.BLEClientConnection3_en==comm_protocol::selector::ENABLE){
		bleClient_Connection3 = bleClientManager->addServerConnection(policy.bleClientPolicyConnection3);
		bleClientManager->runAutoReconnectTask(*bleClient_Connection3);
		bleClient_Connection3_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( bleClient_Connection3_AccessSem );
	}

	if(policy.BLEClientConnection4_en==comm_protocol::selector::ENABLE){
		bleClient_Connection4 = bleClientManager->addServerConnection(policy.bleClientPolicyConnection4);
		bleClientManager->runAutoReconnectTask(*bleClient_Connection4);
		bleClient_Connection4_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( bleClient_Connection4_AccessSem );
	}

	if(policy.BLEClientConnection5_en==comm_protocol::selector::ENABLE){
		bleClient_Connection5 = bleClientManager->addServerConnection(policy.bleClientPolicyConnection5);
		bleClientManager->runAutoReconnectTask(*bleClient_Connection5);
		bleClient_Connection5_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( bleClient_Connection5_AccessSem );
	}

	if(policy.BLEClientConnection6_en==comm_protocol::selector::ENABLE){
		bleClient_Connection6 = bleClientManager->addServerConnection(policy.bleClientPolicyConnection6);
		bleClientManager->runAutoReconnectTask(*bleClient_Connection6);
		bleClient_Connection6_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( bleClient_Connection6_AccessSem );
	}

	if(policy.BLEClientConnection7_en==comm_protocol::selector::ENABLE){
		bleClient_Connection7 = bleClientManager->addServerConnection(policy.bleClientPolicyConnection7);
		bleClientManager->runAutoReconnectTask(*bleClient_Connection7);
		bleClient_Connection7_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( bleClient_Connection7_AccessSem );
	}

	if(policy.BLEServer_en==comm_protocol::selector::ENABLE){
		bleserver = new BLEServer_ProfileMultiByteUART(policy.bleServerPolicy);
		if(bleserver==NULL){
			throw EMU_ERR_NULL;
		}
		bleServer_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( bleServer_AccessSem );
	}
}

comm_protocol* comm_protocol::startService(usage_policy& policy) {
	if(comm_protocol::instance==NULL){
		comm_protocol::instance=new comm_protocol(policy);
	}
	return comm_protocol::instance;
}

comm_protocol* comm_protocol::getInstance() {
	return comm_protocol::instance;
}

comm_protocol::~comm_protocol() {
	if(comm_protocol::instance!=NULL){
		delete comm_protocol::instance;
	}
}

bool comm_protocol::lockSensorCommResource(gateway_comm_interface interface) {
	bool ret=false;

	comm_protocol* comm = comm_protocol::getInstance();
	if(comm==NULL){
		return false;
	}

	switch(interface){
		case comm_protocol::gateway_comm_interface::MQTT:
			if(xSemaphoreTake( comm->mqttClient_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::INFLUXCLIENT:
			if(xSemaphoreTake( comm->influxClient_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_1:
			if(xSemaphoreTake( comm->bleClient_Connection1_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_2:
			if(xSemaphoreTake( comm->bleClient_Connection2_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_3:
			if(xSemaphoreTake( comm->bleClient_Connection3_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_4:
			if(xSemaphoreTake( comm->bleClient_Connection4_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_5:
			if(xSemaphoreTake( comm->bleClient_Connection5_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_6:
			if(xSemaphoreTake( comm->bleClient_Connection6_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_7:
			if(xSemaphoreTake( comm->bleClient_Connection7_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_SERVER:
			if(xSemaphoreTake( comm->bleServer_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		default:
			break;
	}

	return ret;
}

bool comm_protocol::unlockSensorCommResource(gateway_comm_interface interface) {
	bool ret=false;

	comm_protocol* comm = comm_protocol::getInstance();
	if(comm==NULL){
		return false;
	}

	switch(interface){
		case comm_protocol::gateway_comm_interface::MQTT:
			if(xSemaphoreGive( comm->mqttClient_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::INFLUXCLIENT:
			if(xSemaphoreGive( comm->influxClient_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_1:
			if(xSemaphoreGive( comm->bleClient_Connection1_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_2:
			if(xSemaphoreGive( comm->bleClient_Connection2_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_3:
			if(xSemaphoreGive( comm->bleClient_Connection3_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_4:
			if(xSemaphoreGive( comm->bleClient_Connection4_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_5:
			if(xSemaphoreGive( comm->bleClient_Connection5_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_6:
			if(xSemaphoreGive( comm->bleClient_Connection6_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_7:
			if(xSemaphoreGive( comm->bleClient_Connection7_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_protocol::gateway_comm_interface::BLE_SERVER:
			if(xSemaphoreGive( comm->bleServer_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		default:
			break;
	}

	return ret;
}



