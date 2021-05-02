/*
 * configurationManagerTest.cpp
 *
 *  Created on: Jun 10, 2020
 *      Author: karsh
 */
#include "policies.h"
#include "../configurationManager.h"
static char CONFIG_MANAGER_TEST_CALLBACK_TAG[]={"configManagerTest:"};


void configManagerTestTask(void* arg){
	SDCardStorage::startService(uptime_sensor_node_comm_hardware_policy);

	configManager::updateSystemConfigurationFromStorageMedia();
	configManager::updateProtocolConfigurationFromStorageMedia();
	configManager::updateSensorConfigurationFromStorageMedia();
	configManager::updateStorageConfigurationFromStorageMedia();

	comm_hardware::startService(uptime_sensor_node_comm_hardware_policy);
	if(configManager::downloadConfiguration("http://192.168.0.104:1515","1")==false){
		cout<<"Error occurred in download"<<endl;
	}

	vTaskDelete(NULL);
}

void firstTimeBootUp(void* arg){
	comm_hardware::startService(uptime_sensor_node_comm_hardware_policy);
	SDCardStorage::startService(uptime_sensor_node_comm_hardware_policy);
	if(configManager::downloadConfiguration("http://192.168.0.104:1515","1")==false){
		cout<<"Error occurred in download"<<endl;
	}

	configManager::updateSystemConfigurationFromStorageMedia();
	configManager::updateProtocolConfigurationFromStorageMedia();
	configManager::updateSensorConfigurationFromStorageMedia();
	configManager::updateStorageConfigurationFromStorageMedia();

	vTaskDelete(NULL);
}
