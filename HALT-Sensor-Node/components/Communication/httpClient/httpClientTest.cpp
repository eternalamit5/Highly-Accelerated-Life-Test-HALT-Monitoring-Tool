/*
 * httpClientTest.cpp
 *
 *  Created on: Jun 8, 2020
 *      Author: karsh
 */
#include "httpClientApp.h"
#include "../components/ArduinoJson/ArduinoJson.h"

static char HTTP_CLIENT_TEST_TAG[]={"http client test tag: "};

void httpClientTask(void* arg){
	logi(HTTP_CLIENT_TEST_TAG,"init started");

	StaticJsonDocument<6000> jsonBuffer;

	httpClientApp* httpClient = httpClientApp::getInstance("http://192.168.1.103:1515",30000);
	if(httpClient==NULL){
		loge(HTTP_CLIENT_TEST_TAG,"http client app failed to create");
	}
	logi(HTTP_CLIENT_TEST_TAG,"GET request");
	if(httpClient->httpGET("/config/device_1/system")==true){
		//Valid response received from the server. The file format server responds is JSON
		//Parse message into json buffer
		deserializeJson(jsonBuffer, httpClient->getServerResponseData());
		 auto devProp = jsonBuffer["device_properties"]["device_type"];
		logi(HTTP_CLIENT_TEST_TAG,"deserialized json: "<<devProp);
	}

	logi(HTTP_CLIENT_TEST_TAG,"POST request");
	String output;
	serializeJson(jsonBuffer, output);
	if(httpClient->httpPOST(string("/"),string(output.c_str()))==true){
		logi(HTTP_CLIENT_TEST_TAG,"posted successfully");
	}

	while(1){
		vTaskDelay(100);
	}
	vTaskDelete(NULL);
}



