/*
 * mqtt_test.cpp
 *
 *  Created on: Nov 27, 2019
 *      Author: karsh
 */

/* Websites and links to follow
 * ===================================
 * Install mosquitto broker and client
 * 		https://www.vultr.com/docs/how-to-install-mosquitto-mqtt-broker-server-on-ubuntu-16-04
 */
#include "commons.h"
#include "../components/Communication/LPG_MQTT/App/lpg_mqtt.h"
#include "../components/Communication/LPG_WIFI/App/wifi_t.h"
#include "policies.h"

static char MQTT_TEST_TAG[]={"Mqtt test:"};

extern string ssid;
extern string pwd;

void recvDataHandler(string topic, string data){
	logi(MQTT_TEST_TAG," mqtt client received,  topic: "<<topic<<" data: "<<data);
}

void mqttTest(void* arg){

	bool testResult=true;
	mqttClient_t* client=NULL;

	//======= Start Wifi ==============
	if(testResult){
		wifi_t* wifiInstance = wifi_t::startServiceBlockingCall(false,5,ssid,pwd);
		if(wifiInstance==NULL){
			loge(MQTT_TEST_TAG,"Wifi connection failed, aborting");
			testResult = false;
		}else{
			logi(MQTT_TEST_TAG,"Connected to WIFI Access point SSID:"<<ssid);
		}
	}

	//====== Start MQTT service =======
	if(testResult){
		client = mqttClient_t::startServiceBlockingCall(mqtt_client_policy1);
		if(client==NULL){
			testResult = false;
			loge(MQTT_TEST_TAG,"mqtt client failed to start");
		}
	}



	//======= Attach recv data handler ============
	if(testResult){
		if(client->registerRecvDataEventCb(recvDataHandler)==false){
			testResult = false;
			loge(MQTT_TEST_TAG,"Failed to register recv data callback handler");
		}else{
			logi(MQTT_TEST_TAG,"mqtt client recv callback attached");
		}
	}

	//====== Subscribe =======
	if(testResult){
		if(client->subscribe("person/age")!=EMU_SUCCESS){
			testResult = false;
			loge(MQTT_TEST_TAG,"Failed to subscribe the topic");
		}else{
			logi(MQTT_TEST_TAG,"mqtt client service subscribed for topic");
		}
	}


	int i=0;
	while(i<10){
		//====== Publish =======
		if(testResult){
			if(client->publish("/person/name","karthik")!=EMU_SUCCESS){
				testResult = false;
				loge(MQTT_TEST_TAG,"Failed to publish data");
			}else{
				logi(MQTT_TEST_TAG,"mqtt client service published topic with data");
			}
		}else{
			loge(MQTT_TEST_TAG,"Test Failed");
		}
		vTaskDelay(100);
		i++;
	}

	//====== Stop MQTT service =======
	if(testResult){
		if(mqttClient_t::stopService()!=EMU_SUCCESS){
			testResult = false;
			loge(MQTT_TEST_TAG,"Failed to stop mqtt client service");
		}else{
			logi(MQTT_TEST_TAG,"mqtt client service stopped");
		}
	}


	vTaskDelay(200);

	//====== re-Start MQTT service =======
	if(testResult){
		client = mqttClient_t::startServiceBlockingCall(mqtt_client_policy1);
		if(client==NULL){
			testResult = false;
			loge(MQTT_TEST_TAG,"mqtt client failed to start");
		}
	}

	i=0;
	while(i<10){
		//====== Publish again  =======
		if(testResult){
			if(client->publish("/person/name","Shenoy")!=EMU_SUCCESS){
				testResult = false;
				loge(MQTT_TEST_TAG,"Failed to publish data");
			}else{
				logi(MQTT_TEST_TAG,"mqtt client service published topic with data");
			}
		}else{
			loge(MQTT_TEST_TAG,"Test Failed");
		}
		vTaskDelay(100);
		i++;
	}



	//====== Stop again  =======
	if(testResult){
		if(mqttClient_t::stopService()!=EMU_SUCCESS){
			testResult = false;
			loge(MQTT_TEST_TAG,"Failed to stop mqtt client service");
		}else{
			logi(MQTT_TEST_TAG,"mqtt client service stopped");
		}
	}


	//======== Show test result =========
	while(1){
		if(testResult){
			logi(MQTT_TEST_TAG,"Test completed SUCCESS");
		}else{
			logi(MQTT_TEST_TAG,"Test completed Failed");
		}
		vTaskDelay(1000);
	}
}

