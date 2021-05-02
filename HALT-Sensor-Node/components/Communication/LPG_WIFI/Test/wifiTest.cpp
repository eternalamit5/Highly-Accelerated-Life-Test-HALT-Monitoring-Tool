/*
 * testApp.cpp
 *
 *  Created on: Nov 25, 2019
 *      Author: karsh
 */
#include <wifi_t.h>
#include "wifiTest.h"
#include "esp_log.h"

static char WIFI_TEST_TAG[]={"wifi Test: "};

string ssid ="dessert";
string pwd = "icecream";

/* @description test for wifi
 *
 */
void wifiTest(void* arg){

	bool testResult = true;

	logi(WIFI_TEST_TAG,"Test started !!!");
	logi(WIFI_TEST_TAG,"Connecting to WIFI !!!");

	//======== Starting wifi service========================
	/* @test  test of start the wifi service using ssid and password
	 * 			on success the wifi should connect
	 * 			on failure api returns NULL
	 */
	if(testResult){
		wifi_t* wifiInstance = wifi_t::startServiceBlockingCall(false,5,ssid,pwd);
		if(wifiInstance==NULL){
			loge(WIFI_TEST_TAG,"Wifi connection failed, aborting");
			testResult = false;
		}else{
			logi(WIFI_TEST_TAG,"Connected to WIFI Access point SSID:"<<ssid);
		}
	}



	//======= Keep running for a while ============
	int i=0;
	while(i<10){
		i++;
		vTaskDelay(100);
		logi(WIFI_TEST_TAG,"running !!!");
	}


	//========= stopping wifi ===================
	/* @test  test of stopping the wifi service after starting
	 * 			on success the wifi should disconnect
	 * 			on failure api returns false
	 */
	if(testResult){
		logi(WIFI_TEST_TAG,"stopping wifi");
		if(wifi_t::stopServiceBlockingCall()==false){
			loge(WIFI_TEST_TAG,"failed to stop");
		}else{
			logi(WIFI_TEST_TAG,"wifi stopped");
		}
	}



	/* @test  test of starting the wifi service again after stopping
	 * 			on success the wifi should connect again to given ssid using given password
	 * 			on failure WifiInstance should be NULL
	 */
	if(testResult){
		logi(WIFI_TEST_TAG,"wifi starting again");
		wifi_t* wifiInstanceAgain = wifi_t::startServiceBlockingCall(false,5,ssid,pwd);
		if(wifiInstanceAgain==NULL){
			loge(WIFI_TEST_TAG,"Wifi connection failed, aborting");
			testResult = false;

		}else{
			logi(WIFI_TEST_TAG,"Connected to WIFI Access point SSID:"<<ssid);
		}
	}


	//========= Keep this task running even after test is completed =======
	while(1){
		if(testResult){
			logi(WIFI_TEST_TAG,"Test completed, SUCCESS ");
		}else{
			logi(WIFI_TEST_TAG,"Test completed, FAILED ");
		}
		vTaskDelay(100);
	}
}
