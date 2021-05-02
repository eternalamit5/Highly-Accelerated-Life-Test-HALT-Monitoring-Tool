/*
 * ledApp.cpp
 *
 *  Created on: Feb 18, 2020
 *      Author: karsh
 */

#include "errorLEDApp.h"
#include "commons.h"
#include "../components/Communication/peripheral_communication.h"

static char LED_APP_TASK_TAG[]={"LED App Task "};

errorIndicatorApp* errorIndicatorApp::instance=NULL;


void errorIndicatorApp::timerCB(void* arg){
	if(errorIndicatorApp::instance!=NULL){
		switch(instance->led.getBlinkStatus()){
			case 0:
				instance->led.setOutput(errorLED::ledLogicLevel_e::LED_LOW);
				break;
			case 1:
				instance->led.blink(1,1000);
				break;
			case 2:
				instance->led.blink(2,1000);
				break;
			case 3:
				instance->led.blink(3,1000);
				break;
			case 4:
				instance->led.blink(4,1000);
				break;
			case 255:
				instance->led.setOutput(errorLED::ledLogicLevel_e::LED_HIGH);
				break;
			default:
				break;
		}
	}
}


errorIndicatorApp::errorIndicatorApp(uint8_t ledgpio):
		led(ledgpio,errorLED::LED_HIGH),ledgpio(ledgpio),status(errorIndicatorApp::status_t::STOPPED),
		led_periodic_timer(NULL){

	/*Task 1: Create a periodic timer*/
	const esp_timer_create_args_t periodic_timer_args = {
			.callback = &this->timerCB, //app sensor loop func pointer
			.arg = NULL,
			.dispatch_method = ESP_TIMER_TASK,
			.name = "LED"//app timer name
	};

	if(esp_timer_create(&periodic_timer_args, &led_periodic_timer)!=ESP_OK){
		loge(LED_APP_TASK_TAG,"Fail to create periodic timer");
		abort();
	}

	if(led_periodic_timer==NULL){
		loge(LED_APP_TASK_TAG,"Periodic timer instance can't be NULL");
		abort();
	}
}


errorIndicatorApp::~errorIndicatorApp(){
	if(errorIndicatorApp::instance!=NULL){
		delete errorIndicatorApp::instance;
	}
}


errorIndicatorApp* errorIndicatorApp::startService(uint8_t ledgpio){

	//Check if instance has been created, if not create new one
	if(errorIndicatorApp::instance==NULL){
		errorIndicatorApp::instance = new errorIndicatorApp(ledgpio);
		if(errorIndicatorApp::instance==NULL){
			loge(LED_APP_TASK_TAG,"Fail to create errorIndicator App instance");
			return NULL;
		}
	}

	//start periodic timer if not running
	if(errorIndicatorApp::instance->status==errorIndicatorApp::status_t::STOPPED){
		/*Start periodic timer*/
		if(esp_timer_start_periodic(errorIndicatorApp::instance->led_periodic_timer, (uint64_t)(1*3000*1000))!=ESP_OK){
			loge(LED_APP_TASK_TAG,"Fail to start periodic timer");
			return NULL;
		}
		errorIndicatorApp::instance->status = errorIndicatorApp::status_t::RUNNING;
		return errorIndicatorApp::instance;
	}

	logw(LED_APP_TASK_TAG,"Periodic timer, is already running");
	return NULL;

}



bool errorIndicatorApp::stopService(){

	if(errorIndicatorApp::instance==NULL){
		return false;
	}

	//stop periodic timer if running
	if(errorIndicatorApp::instance->status==errorIndicatorApp::status_t::RUNNING){
		if(esp_timer_stop(errorIndicatorApp::instance->led_periodic_timer)!=ESP_OK){
			loge(LED_APP_TASK_TAG,"Fail to stop periodic timer");
			return false;
		}
		errorIndicatorApp::instance->status = errorIndicatorApp::status_t::STOPPED;
		return true;
	}
	logw(LED_APP_TASK_TAG,"Periodic timer, is already stopped");
	return false;
}



errorIndicatorApp* errorIndicatorApp::getInstance(){
	return errorIndicatorApp::instance;
}

bool errorIndicatorApp::process(blinkStatus_e status) {
	if(errorIndicatorApp::instance==NULL){
		return false;
	}

	if(comm_hardware::lockSensorCommResource(comm_hardware::sensor_comm_interface::IND_LED)==true){
		errorIndicatorApp::instance->led.setBlinkStatus((uint8_t)status);
		comm_hardware::unlockSensorCommResource(comm_hardware::sensor_comm_interface::IND_LED);
	}
	return true;

}
