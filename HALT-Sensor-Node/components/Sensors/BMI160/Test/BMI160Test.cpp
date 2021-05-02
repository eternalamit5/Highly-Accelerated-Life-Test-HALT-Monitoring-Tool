/*
 * BMI160Test.cpp
 *
 *  Created on: Nov 29, 2019
 *      Author: karsh
 */

#include "BMI160Test.h"
#include "../components/Sensors/BMI160/App/BMI160AppCallback.h"
#include "policies.h"

SemaphoreHandle_t motionTelemetrySemHandle=NULL;

static char BMI160TEST[]={"BMI160 TEST:"};

void motionTimerCallback(void* arg){
	xSemaphoreGive(motionTelemetrySemHandle);
}

void motionSensingTask(void* arg){

	//====== Required =========
//	comm_hardware::startService(uptime_sensor_node_comm_hardware_policy);
//	comm_protocol::startService(protocol_usage_policy1);

	//====== Test =============
	if(motionTelemetrySemHandle==NULL){
		motionTelemetrySemHandle = xSemaphoreCreateBinary();
	}

	BMI160App motionSense(BMI160_policy1);
	motionSense.registerTimerCB(motionTimerCallback);
	motionSense.registerUserAppCB(BMI160Telemetry);
	float sample_rate = 1;
	motionSense.processor(BMI160App::APP_CMD_e::START,BMI160App::SUB_CMD_e::NONE,(void*)&sample_rate,sizeof(sample_rate));

	while(1){
		if(xSemaphoreTake(motionTelemetrySemHandle,portMAX_DELAY)==pdTRUE){
			motionSense.runUserApp();
		}
	}
}



