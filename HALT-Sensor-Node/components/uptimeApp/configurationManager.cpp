/*
 * configurationManager.cpp
 *
 *  Created on: Jun 9, 2020
 *      Author: karsh
 */
#include "configurationManager.h"
#include "policies.h"
#include "../components/ArduinoJson/ArduinoJson.h"

static char CONFIG_MANAGER_CALLBACK_TAG[]={"configManager:"};
constexpr size_t jsonFileSizeInBytes=4096;
#define QUOTE \"


bool configManager::downloadConfiguration(string uri,string deviceid) {
	bool ret = true;

	SDCardStorage::createDirectory("/sys");
	StaticJsonDocument<200> doc;
	doc["username"]="shen";
	doc["password"]="1234";
	doc["device_id"]="1";


	if(ret){
		httpClientApp* httpClient = httpClientApp::getInstance(uri,30000);
		if(httpClient!=NULL){
			string configPath="/download/device/config";
			doc["doc_type"]="system";
			String output;
			serializeJson(doc, output);
			if(httpClient->httpPOST(configPath,string(output.c_str()))==true){
				cout<<"system.json downloaded"<<endl;
				ret = SDCardStorage::write("/sys/system.txt",httpClient->getServerResponseData());
			}
		}
	}


	if(ret){
		httpClientApp* httpClient = httpClientApp::getInstance(uri,30000);
		if(httpClient!=NULL){
			string configPath="/download/device/config";
			doc["doc_type"]="protocol";
			String output;
			serializeJson(doc, output);
			if(httpClient->httpPOST(configPath,string(output.c_str()))==true){
				ret = SDCardStorage::write("/sys/protocol.txt",httpClient->getServerResponseData());
			}
		}
	}

	if(ret){
		httpClientApp* httpClient = httpClientApp::getInstance(uri,30000);
		if(httpClient!=NULL){
			string configPath="/download/device/config";
			doc["doc_type"]="sensor";
			String output;
			serializeJson(doc, output);
			if(httpClient->httpPOST(configPath,string(output.c_str()))==true){
				ret = SDCardStorage::write("/sys/sensor.txt",httpClient->getServerResponseData());
			}
		}
	}

	if(ret){
		httpClientApp* httpClient = httpClientApp::getInstance(uri,30000);
		if(httpClient!=NULL){
			string configPath="/download/device/config";
			doc["doc_type"]="storage";
			String output;
			serializeJson(doc, output);
			if(httpClient->httpPOST(configPath,string(output.c_str()))==true){
				ret = SDCardStorage::write("/sys/storage.txt",httpClient->getServerResponseData());
			}
		}
	}

	return ret;
}



bool configManager::updateSystemConfigurationFromStorageMedia() {
	bool ret = true;

	StaticJsonDocument<jsonFileSizeInBytes> jsonBuffer;
	string jsonFile;
	ret = SDCardStorage::read("/sys/system.txt",jsonFile,jsonFileSizeInBytes);
	if(ret){
		if(deserializeJson(jsonBuffer, jsonFile)!= DeserializationError::Ok){
			ret = false;
		}
	}

	//System attributes are updated based on parsed JSON
	logi(CONFIG_MANAGER_CALLBACK_TAG,"Reading out System Configuartion");

	//device_properties : device_uuid
	if(ret){
		string device_uuid = jsonBuffer["device_id"];
		//logi("device_uuid",device_uuid);
		if(!device_uuid.empty()){
			devProperties.deviceUUID.assign(device_uuid);
		}
		else{
			devProperties.deviceUUID.clear();
		}
	}

	//device_properties : device_type
	if(ret){
		string device_type = jsonBuffer["device_type"];
		//logi("device_type",device_type);
		if(!device_type.empty()){
			devProperties.deviceType.assign(device_type);
		}
		else{
			devProperties.deviceType.clear();
		}
	}

	//device_properties : network_id
	if(ret){
		string network_id = jsonBuffer["network_id"];
		//logi("network_id",network_id);
		if(!network_id.empty()){
			devProperties.networkID.assign(network_id);
		}
		else{
			devProperties.networkID.clear();
		}
	}

	//device_properties : description
	if(ret){
		string device_description = jsonBuffer["device_description"];
		//logi("description",device_description);
		if(!device_description.empty()){
			devProperties.description.assign(device_description);
		}
		else{
			devProperties.description.clear();
		}
	}

	//comm_hardware_policy : uart0 enable
	if(ret){
		bool uart0_en = jsonBuffer["uart0_en"];
		//logi("uart0_en",uart0_en);
		if(uart0_en){
			uptime_sensor_node_comm_hardware_policy.uart0_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.uart0_en=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : uart0 baud selection
	if(ret){
		uint32_t uart0_baud = jsonBuffer["uart0_baud"];
		//logi("uart0_baud",uart0_baud);
		uptime_sensor_node_comm_hardware_policy.uart0_baud=uart0_baud;
	}

	//comm_hardware_policy : uart1 enable
	if(ret){
		bool uart1_en = jsonBuffer["uart1_en"];
		//logi("uart1_en",uart1_en);
		if(uart1_en){
			uptime_sensor_node_comm_hardware_policy.uart1_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.uart1_en=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : uart1 baud selection
	if(ret){
		uint32_t uart1_baud = jsonBuffer["uart1_baud"];
		//logi("uart1_baud",uart1_baud);
		uptime_sensor_node_comm_hardware_policy.uart1_baud=uart1_baud;
	}

	//comm_hardware_policy : uart2 enable
	if(ret){
		bool uart2_en = jsonBuffer["uart2_en"];
		//logi("uart2_en",uart2_en);
		if(uart2_en){
			uptime_sensor_node_comm_hardware_policy.uart2_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.uart2_en=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : uart2 baud selection
	if(ret){
		uint32_t uart2_baud = jsonBuffer["uart2_baud"];
		//logi("uart2_baud",uart2_baud);
		uptime_sensor_node_comm_hardware_policy.uart2_baud=uart2_baud;
	}

	//comm_hardware_policy : i2c0 enable
	if(ret){
		bool i2c0_en = jsonBuffer["i2c0_en"];
		//logi("i2c0_en",i2c0_en);
		if(i2c0_en){
			uptime_sensor_node_comm_hardware_policy.i2c0_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.i2c0_en=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : i2c0 frequency
	if(ret){
		string i2c0_freq= jsonBuffer["i2c0_freq"];
		//logi("i2c0_freq",i2c0_freq);
		if(i2c0_freq == string("50KHz")){
			uptime_sensor_node_comm_hardware_policy.i2c0_frequency=50000;
		}else if(i2c0_freq == string("100KHz")){
			uptime_sensor_node_comm_hardware_policy.i2c0_frequency=100000;
		}else if(i2c0_freq == string("400KHz")){
			uptime_sensor_node_comm_hardware_policy.i2c0_frequency=400000;
		}
	}

	//comm_hardware_policy : i2c1 enable
	if(ret){
		bool i2c1_en = jsonBuffer["i2c1_en"];
		//logi("i2c1_en",i2c1_en);
		if(i2c1_en){
			uptime_sensor_node_comm_hardware_policy.i2c1_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.i2c1_en=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : i2c1 frequency
	if(ret){
		string i2c1_freq= jsonBuffer["i2c1_freq"];
		//logi("i2c1_freq",i2c1_freq);
		if(i2c1_freq == string("50KHz")){
			uptime_sensor_node_comm_hardware_policy.i2c1_frequency=50000;
		}else if(i2c1_freq == string("100KHz")){
			uptime_sensor_node_comm_hardware_policy.i2c1_frequency=100000;
		}else if(i2c1_freq == string("400KHz")){
			uptime_sensor_node_comm_hardware_policy.i2c1_frequency=400000;
		}
	}


	//comm_hardware_policy : hsspi enable
	if(ret){
		bool hsspi_en = jsonBuffer["hsspi_en"];
		//logi("hsspi_en",hsspi_en);
		if(hsspi_en){
			uptime_sensor_node_comm_hardware_policy.HSSPI_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.HSSPI_en=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : lsspi enable
	if(ret){
		bool lsspi_en = jsonBuffer["lsspi_en"];
		//logi("lsspi_en",lsspi_en);
		if(lsspi_en){
			uptime_sensor_node_comm_hardware_policy.LSSPI_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.LSSPI_en=comm_hardware::selector::DISABLE;
		}
	}

	//=============
	//comm_hardware_policy : wifi enable
	if(ret){
		bool wifi_en = jsonBuffer["wifi_en"];
		//logi("wifi_en",wifi_en);
		if(wifi_en){
			uptime_sensor_node_comm_hardware_policy.wifi_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.wifi_en=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : wifi smart connect enable
	if(ret){
		bool wifi_smartconnect_en = jsonBuffer["wifi_smartconnect_en"];
		//logi("wifi_smartconnect_en",wifi_smartconnect_en);
		if(wifi_smartconnect_en){
			uptime_sensor_node_comm_hardware_policy.wifi_enable_smartConnect=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.wifi_enable_smartConnect=comm_hardware::selector::DISABLE;
		}
	}
	//comm_hardware_policy : wifi reconnect attempt
	if(ret){
		uint16_t wifi_reconnect_attempt = jsonBuffer["wifi_reconnect_attempt"];
		//logi("wifi_reconnect_attempt",wifi_reconnect_attempt);
		if(wifi_reconnect_attempt){
			uptime_sensor_node_comm_hardware_policy.wifi_reconnAttempt=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.wifi_reconnAttempt=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : wifi ssid1
	if(ret){
		string ssid1 = jsonBuffer["wifi_ssid1"];
		//logi("wifi_ssid1",ssid1);
		if(!ssid1.empty()){
			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid1);
			//logi("wifi_ssid1",uptime_sensor_node_comm_hardware_policy.wifi_ssid);
		}
		else{
			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
		}
	}

	//comm_hardware_policy : wifi ssid1 password1
	if(ret){
		string password1 = jsonBuffer["wifi_password1"];
		//logi("wifi_password1",password1);
		if(!password1.empty()){
			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password1);
			//logi("wifi_password1",uptime_sensor_node_comm_hardware_policy.wifi_password);
		}
		else{
			//logi("wifi_password1:","cleared");
			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
		}
	}

//	//comm_hardware_policy : wifi ssid2
//	if(ret){
//		string ssid2 = jsonBuffer["wifi_ssid2"];
//		//logi("wifi_ssid2",ssid2);
//		if(!ssid2.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid2);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid2 password2
//	if(ret){
//		string password2 = jsonBuffer["wifi_password2"];
//		//logi("wifi_password2",password2);
//		if(!password2.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password2);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid3
//	if(ret){
//		string ssid3 = jsonBuffer["wifi_ssid3"];
//		//logi("wifi_ssid3",ssid3);
//		if(!ssid3.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid3);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid3 password3
//	if(ret){
//		string password3 = jsonBuffer["wifi_password3"];
//		//logi("password3",password3);
//		if(!password3.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password3);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid4
//	if(ret){
//		string ssid4 = jsonBuffer["wifi_ssid4"];
//		//logi("wifi_ssid4",ssid4);
//		if(!ssid4.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid4);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid4 password4
//	if(ret){
//		string password4 = jsonBuffer["wifi_password4"];
//		//logi("wifi_password4",password4);
//		if(!password4.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password4);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid5
//	if(ret){
//		string ssid5 = jsonBuffer["wifi_ssid5"];
//		//logi("wifi_ssid5",ssid5);
//		if(!ssid5.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid5);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid5 password5
//	if(ret){
//		string password5 = jsonBuffer["wifi_password5"];
//		//logi("wifi_password5",password5);
//		if(!password5.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password5);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid6
//	if(ret){
//		string ssid6 = jsonBuffer["wifi_ssid6"];
//		//logi("wifi_ssid6",ssid6);
//		if(!ssid6.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid6);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid6 password6
//	if(ret){
//		string password6 = jsonBuffer["wifi_password6"];
//		//logi("wifi_password6",password6);
//		if(!password6.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password6);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid7
//	if(ret){
//		string ssid7 = jsonBuffer["wifi_ssid7"];
//		//logi("wifi_ssid7",ssid7);
//		if(!ssid7.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid7);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid7 password7
//	if(ret){
//		string password7 = jsonBuffer["wifi_password7"];
//		//logi("wifi_password7",password7);
//		if(!password7.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password7);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid8
//	if(ret){
//		string ssid8 = jsonBuffer["wifi_ssid8"];
//		//logi("wifi_ssid8",ssid8);
//		if(!ssid8.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid8);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid8 password8
//	if(ret){
//		string password8 = jsonBuffer["wifi_password8"];
//		//logi("wifi_password8",password8);
//		if(!password8.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password8);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid9
//	if(ret){
//		string ssid9 = jsonBuffer["wifi_ssid9"];
//		//logi("wifi_ssid9",ssid9);
//		if(!ssid9.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid9);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid9 password9
//	if(ret){
//		string password9 = jsonBuffer["wifi_password9"];
//		//logi("wifi_password9",password9);
//		if(!password9.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password9);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid10
//	if(ret){
//		string ssid10 = jsonBuffer["wifi_ssid10"];
//		//logi("wifi_ssid10",ssid10);
//		if(!ssid10.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.assign(ssid10);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_ssid.clear();
//		}
//	}
//
//	//comm_hardware_policy : wifi ssid10 password10
//	if(ret){
//		string password10 = jsonBuffer["wifi_password10"];
//		//logi("wifi_password10",password10);
//		if(!password10.empty()){
//			uptime_sensor_node_comm_hardware_policy.wifi_password.assign(password10);
//		}
//		else{
//			uptime_sensor_node_comm_hardware_policy.wifi_password.clear();
//		}
//	}

	//comm_hardware_policy : indicator
	if(ret){
		bool indicator_en = jsonBuffer["appStatusIndicator_en"];
		//logi("appStatusIndicator_en",indicator_en);
		if(indicator_en){
			uptime_sensor_node_comm_hardware_policy.indicator_en=comm_hardware::selector::ENABLE;
		}
		else{
			uptime_sensor_node_comm_hardware_policy.indicator_en=comm_hardware::selector::DISABLE;
		}
	}

	//comm_hardware_policy : error_major
	if(ret){
		string error_major = jsonBuffer["error_major"];
		//logi("error_major",error_major);
		if(!error_major.empty()){
			if(error_major == string("Turn LED On")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TURN_LED_ON;
			}else if(error_major == string("Turn LED Off")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TURN_LED_OFF;
			}else if(error_major == string("Toggle LED 1HZ")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TOGGLE_LED_1HZ;
			}else if(error_major == string("Toggle LED 2HZ")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TOGGLE_LED_2HZ;
			}else if(error_major == string("Toggle LED 4HZ")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TOGGLE_LED_4HZ;
			}else if(error_major == string("Turn LED RED")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TURN_LED_RED;
			}else if(error_major == string("Turn LED GREEN")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TURN_LED_GREEN;
			}else if(error_major == string("Toggle LED BLUE")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TURN_LED_BLUE;
			}else if(error_major == string("Send Error Message Via MQTT")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_MQTT;
			}else if(error_major == string("Send Error Message Via TCP")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_TCP;
			}else if(error_major == string("Send Error Message Via WS")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_WS;
			}else if(error_major == string("Send Error Message Via BLE")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_BLE;
			}else if(error_major == string("Send Error Message Via UART0")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART0;
			}else if(error_major == string("Send Error Message Via UART1")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART1;
			}else if(error_major == string("Send Error Message Via UART2")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART2;
			}else if(error_major == string("Send Error Message Via I2C0")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C0;
			}else if(error_major == string("Send Error Message Via I2C1")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C1;
			}else if(error_major == string("Send Error Message Via HSSPI")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_HSSPI;
			}else if(error_major == string("Send Error Message Via LSSPI")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_LSSPI;
			}else if(error_major == string("Send Error Message Via SD Card")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_SD_CARD_LOGGER;
			}else if(error_major == string("Terminate")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::TERMINATE;
			}else if(error_major == string("Spin forever")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SPIN_FOREVER;
			}else if(error_major == string("Software reset")){
				error_policy1.error_major=errorHandler::error_reporting_action_e::SOFTWARE_RESET;
			}else{
				error_policy1.error_major=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
			}
		}
		else{
			error_policy1.error_major=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
		}
	}

	//comm_hardware_policy : error_minor
	if(ret){
		string error_minor = jsonBuffer["error_minor"];
		//logi("error_minor",error_minor);
		if(!error_minor.empty()){
			if(error_minor == string("Turn LED On")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TURN_LED_ON;
			}else if(error_minor == string("Turn LED Off")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TURN_LED_OFF;
			}else if(error_minor == string("Toggle LED 1HZ")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TOGGLE_LED_1HZ;
			}else if(error_minor == string("Toggle LED 2HZ")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TOGGLE_LED_2HZ;
			}else if(error_minor == string("Toggle LED 4HZ")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TOGGLE_LED_4HZ;
			}else if(error_minor == string("Turn LED RED")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TURN_LED_RED;
			}else if(error_minor == string("Turn LED GREEN")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TURN_LED_GREEN;
			}else if(error_minor == string("Toggle LED BLUE")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TURN_LED_BLUE;
			}else if(error_minor == string("Send Error Message Via MQTT")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_MQTT;
			}else if(error_minor == string("Send Error Message Via TCP")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_TCP;
			}else if(error_minor == string("Send Error Message Via WS")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_WS;
			}else if(error_minor == string("Send Error Message Via BLE")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_BLE;
			}else if(error_minor == string("Send Error Message Via UART0")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART0;
			}else if(error_minor == string("Send Error Message Via UART1")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART1;
			}else if(error_minor == string("Send Error Message Via UART2")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART2;
			}else if(error_minor == string("Send Error Message Via I2C0")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C0;
			}else if(error_minor == string("Send Error Message Via I2C1")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C1;
			}else if(error_minor == string("Send Error Message Via HSSPI")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_HSSPI;
			}else if(error_minor == string("Send Error Message Via LSSPI")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_LSSPI;
			}else if(error_minor == string("Send Error Message Via SD Card")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_SD_CARD_LOGGER;
			}else if(error_minor == string("Terminate")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::TERMINATE;
			}else if(error_minor == string("Spin forever")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SPIN_FOREVER;
			}else if(error_minor == string("Software reset")){
				error_policy1.error_minor=errorHandler::error_reporting_action_e::SOFTWARE_RESET;
			}else{
				error_policy1.error_minor=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
			}
		}
		else{
			error_policy1.error_minor=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
		}
	}


	//comm_hardware_policy : warn_major
	if(ret){
		string warn_major = jsonBuffer["warn_major"];
		//logi("warn_major",warn_major);
		if(!warn_major.empty()){
			if(warn_major == string("Turn LED On")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TURN_LED_ON;
			}else if(warn_major == string("Turn LED Off")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TURN_LED_OFF;
			}else if(warn_major == string("Toggle LED 1HZ")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TOGGLE_LED_1HZ;
			}else if(warn_major == string("Toggle LED 2HZ")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TOGGLE_LED_2HZ;
			}else if(warn_major == string("Toggle LED 4HZ")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TOGGLE_LED_4HZ;
			}else if(warn_major == string("Turn LED RED")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TURN_LED_RED;
			}else if(warn_major == string("Turn LED GREEN")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TURN_LED_GREEN;
			}else if(warn_major == string("Toggle LED BLUE")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TURN_LED_BLUE;
			}else if(warn_major == string("Send Error Message Via MQTT")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_MQTT;
			}else if(warn_major == string("Send Error Message Via TCP")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_TCP;
			}else if(warn_major == string("Send Error Message Via WS")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_WS;
			}else if(warn_major == string("Send Error Message Via BLE")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_BLE;
			}else if(warn_major == string("Send Error Message Via UART0")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART0;
			}else if(warn_major == string("Send Error Message Via UART1")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART1;
			}else if(warn_major == string("Send Error Message Via UART2")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART2;
			}else if(warn_major == string("Send Error Message Via I2C0")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C0;
			}else if(warn_major == string("Send Error Message Via I2C1")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C1;
			}else if(warn_major == string("Send Error Message Via HSSPI")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_HSSPI;
			}else if(warn_major == string("Send Error Message Via LSSPI")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_LSSPI;
			}else if(warn_major == string("Send Error Message Via SD Card")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_SD_CARD_LOGGER;
			}else if(warn_major == string("Terminate")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::TERMINATE;
			}else if(warn_major == string("Spin forever")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SPIN_FOREVER;
			}else if(warn_major == string("Software reset")){
				error_policy1.warn_major=errorHandler::error_reporting_action_e::SOFTWARE_RESET;
			}else{
				error_policy1.warn_major=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
			}
		}
		else{
			error_policy1.warn_major=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
		}
	}

	//comm_hardware_policy : warn_minor
	if(ret){
		string warn_minor = jsonBuffer["warn_minor"];
		//logi("warn_minor",warn_minor);
		if(!warn_minor.empty()){
			if(warn_minor == string("Turn LED On")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TURN_LED_ON;
			}else if(warn_minor == string("Turn LED Off")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TURN_LED_OFF;
			}else if(warn_minor == string("Toggle LED 1HZ")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TOGGLE_LED_1HZ;
			}else if(warn_minor == string("Toggle LED 2HZ")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TOGGLE_LED_2HZ;
			}else if(warn_minor == string("Toggle LED 4HZ")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TOGGLE_LED_4HZ;
			}else if(warn_minor == string("Turn LED RED")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TURN_LED_RED;
			}else if(warn_minor == string("Turn LED GREEN")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TURN_LED_GREEN;
			}else if(warn_minor == string("Toggle LED BLUE")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TURN_LED_BLUE;
			}else if(warn_minor == string("Send Error Message Via MQTT")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_MQTT;
			}else if(warn_minor == string("Send Error Message Via TCP")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_TCP;
			}else if(warn_minor == string("Send Error Message Via WS")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_WS;
			}else if(warn_minor == string("Send Error Message Via BLE")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_BLE;
			}else if(warn_minor == string("Send Error Message Via UART0")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART0;
			}else if(warn_minor == string("Send Error Message Via UART1")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART1;
			}else if(warn_minor == string("Send Error Message Via UART2")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART2;
			}else if(warn_minor == string("Send Error Message Via I2C0")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C0;
			}else if(warn_minor == string("Send Error Message Via I2C1")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C1;
			}else if(warn_minor == string("Send Error Message Via HSSPI")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_HSSPI;
			}else if(warn_minor == string("Send Error Message Via LSSPI")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_LSSPI;
			}else if(warn_minor == string("Send Error Message Via SD Card")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_SD_CARD_LOGGER;
			}else if(warn_minor == string("Terminate")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::TERMINATE;
			}else if(warn_minor == string("Spin forever")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SPIN_FOREVER;
			}else if(warn_minor == string("Software reset")){
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::SOFTWARE_RESET;
			}else{
				error_policy1.warn_minor=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
			}
		}
		else{
			error_policy1.warn_minor=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
		}
	}

	//comm_hardware_policy : std_exception
	if(ret){
		string std_exception = jsonBuffer["std_exception"];
		//logi("std_exception",std_exception);
		if(!std_exception.empty()){
			if(std_exception == string("Turn LED On")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TURN_LED_ON;
			}else if(std_exception == string("Turn LED Off")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TURN_LED_OFF;
			}else if(std_exception == string("Toggle LED 1HZ")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TOGGLE_LED_1HZ;
			}else if(std_exception == string("Toggle LED 2HZ")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TOGGLE_LED_2HZ;
			}else if(std_exception == string("Toggle LED 4HZ")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TOGGLE_LED_4HZ;
			}else if(std_exception == string("Turn LED RED")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TURN_LED_RED;
			}else if(std_exception == string("Turn LED GREEN")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TURN_LED_GREEN;
			}else if(std_exception == string("Toggle LED BLUE")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TURN_LED_BLUE;
			}else if(std_exception == string("Send Error Message Via MQTT")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_MQTT;
			}else if(std_exception == string("Send Error Message Via TCP")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_TCP;
			}else if(std_exception == string("Send Error Message Via WS")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_WS;
			}else if(std_exception == string("Send Error Message Via BLE")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_BLE;
			}else if(std_exception == string("Send Error Message Via UART0")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART0;
			}else if(std_exception == string("Send Error Message Via UART1")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART1;
			}else if(std_exception == string("Send Error Message Via UART2")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_UART2;
			}else if(std_exception == string("Send Error Message Via I2C0")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C0;
			}else if(std_exception == string("Send Error Message Via I2C1")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_I2C1;
			}else if(std_exception == string("Send Error Message Via HSSPI")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_HSSPI;
			}else if(std_exception == string("Send Error Message Via LSSPI")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_LSSPI;
			}else if(std_exception == string("Send Error Message Via SD Card")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SEND_ERROR_MSG_SD_CARD_LOGGER;
			}else if(std_exception == string("Terminate")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::TERMINATE;
			}else if(std_exception == string("Spin forever")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SPIN_FOREVER;
			}else if(std_exception == string("Software reset")){
				error_policy1.std_exception=errorHandler::error_reporting_action_e::SOFTWARE_RESET;
			}else{
				error_policy1.std_exception=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
			}
		}
		else{
			error_policy1.std_exception=errorHandler::error_reporting_action_e::JUST_SHOW_DEBUG_LOG;
		}
	}

	if(ret==false){
		//logi(CONFIG_MANAGER_CALLBACK_TAG,"Failed to update system configuration");
	}else{
		//logi(CONFIG_MANAGER_CALLBACK_TAG,"System configuration complete ");
	}

	return ret;
}

bool configManager::updateSensorConfigurationFromStorageMedia(){
	bool ret = true;
	StaticJsonDocument<jsonFileSizeInBytes> jsonBuffer;
	string jsonFile;
	ret = SDCardStorage::read("/sys/sensor.txt",jsonFile,jsonFileSizeInBytes);

	if(ret){
		if(deserializeJson(jsonBuffer, jsonFile)!= DeserializationError::Ok){
			ret = false;
		}
	}

	//logi(CONFIG_MANAGER_CALLBACK_TAG,"Sensor configuration");
	//Sensor attributes are updated based on parsed JSON
	//BMI160_sensorPolicy : sensor enable
	if(ret){
		bool en = jsonBuffer["bmi160_en"];
		//logi("bmi160_en",en);
		if(en){
			BMI160_policy1.sensor_en=BMI160App::selector::ENABLE;
		}
		else{
			BMI160_policy1.sensor_en=BMI160App::selector::DISABLE;
		}
	}

	//BMI160_sensorPolicy : sensor id
	if(ret){
		string id = jsonBuffer["bmi160_id"];
		//logi("bmi160_id",id);
		if(!id.empty()){
			BMI160_policy1.sensorElementID.assign(id);
		}
		else{
			BMI160_policy1.sensorElementID.clear();
		}
	}

	//BMI160_sensorPolicy : sensor description
	if(ret){
		string description = jsonBuffer["bmi160_description"];
		//logi("bmi160_description  ",description );
		if(!description.empty()){
			BMI160_policy1.description.assign(description);
		}
		else{
			BMI160_policy1.description.clear();
		}
	}

	//BMI160_sensorPolicy : sensor Measurement type
	if(ret){
		string measurement_type = jsonBuffer["bmi160_measurement_type"];
		//logi("bmi160_measurement_type ",measurement_type );
		if(!measurement_type.empty()){
			BMI160_policy1.measurement_type.assign(measurement_type);
		}
		else{
			BMI160_policy1.measurement_type.clear();
		}
	}

	//BMI160_sensorPolicy : sensor measurement topic
	if(ret){
		string measurement_topic = jsonBuffer["bmi160_measurement_topic"];
		//logi("bmi160_measurement_topic  ", measurement_topic);
		if(!measurement_topic.empty()){
			BMI160_policy1.measurement_topic.assign(measurement_topic);
		}
		else{
			BMI160_policy1.measurement_topic.clear();
		}
	}

	//BMI160_sensorPolicy : sensor log message topic
	if(ret){
		string log_msg_topic = jsonBuffer["bmi160_log_msg_topic"];
		//logi("bmi160_log_msg_topic  ",log_msg_topic );
		if(!log_msg_topic.empty()){
			BMI160_policy1.log_msg_topic.assign(log_msg_topic);
		}
		else{
			BMI160_policy1.log_msg_topic.clear();
		}
	}

	//BMI160_sensorPolicy : sensor peripheral communication interface
	if(ret){
		string peripheral_comm_interface = jsonBuffer["bmi160_peripheral_comm_interface"];
		//logi("bmi160_peripheral_comm_interface  ",peripheral_comm_interface );
		if(!peripheral_comm_interface.empty()){
			if(peripheral_comm_interface=="i2c0")
				BMI160_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_0;
			else if(peripheral_comm_interface=="i2c1")
				BMI160_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_1;
			else if(peripheral_comm_interface=="uart0")
				BMI160_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_0;
			else if(peripheral_comm_interface=="uart1")
				BMI160_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_1;
			else if(peripheral_comm_interface=="uart2")
				BMI160_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_2;
			else if(peripheral_comm_interface=="lsspi")
				BMI160_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::LS_SPI;
			else if(peripheral_comm_interface=="hsspi")
				BMI160_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::HS_SPI;
			else{}
		}
		else{}
	}


	//BMI160_sensorPolicy : sensor peripheral communication address
	if(ret){
		int peripheral_comm_address_dec = jsonBuffer["bmi160_peripheral_comm_address_dec"];
		//logi("bmi160_peripheral_comm_address_dec  ",peripheral_comm_address_dec );
		BMI160_policy1.peripheralCommAddress=((uint8_t)peripheral_comm_address_dec);
	}

	//BMI160_sensorPolicy : sensor telemetry communication interface
	if(ret){
		string telemetry_interface = jsonBuffer["bmi160_telemetry_interface"];
		//logi("bmi160_telemetry_interface  ",telemetry_interface );
		if(!telemetry_interface.empty()){
			if(telemetry_interface=="mqtt")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::MQTT;
			else if(telemetry_interface=="wifi_tcp")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::TCP_SOCKET;
			else if(telemetry_interface=="wifi_udp")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::UDP_SOCKET;
			else if(telemetry_interface=="web_socket")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::WEBSOCKET;
			else if(telemetry_interface=="ble_client_1")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_1;
			else if(telemetry_interface=="ble_client_2")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_2;
			else if(telemetry_interface=="ble_client_3")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_3;
			else if(telemetry_interface=="ble_client_4")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_4;
			else if(telemetry_interface=="ble_client_5")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_5;
			else if(telemetry_interface=="ble_client_6")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_6;
			else if(telemetry_interface=="ble_client_7")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_7;
			else if(telemetry_interface=="ble_server")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_SERVER;
			else if(telemetry_interface=="sub_ghz_868mhz")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::SUB_GHZ_868MHZ;
			else if(telemetry_interface=="influx")
				BMI160_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::INFLUXCLIENT;
			else{}
		}
		else{}
	}

	//BMI160_sensorPolicy : sensor gyroscope range
	if (ret) {
		int gyroscope_range = jsonBuffer["bmi160_gyroscope_range"];
		//logi("bmi160_gyroscope_range  ",gyroscope_range );
		switch (gyroscope_range){
		case 125:
			BMI160_policy1.gyroscopeRange =BMI160HAL::gyroRange_t::GYRO_125;
			break;
		case 250:
			BMI160_policy1.gyroscopeRange =BMI160HAL::gyroRange_t::GYRO_250;
			break;
		case 500:
			BMI160_policy1.gyroscopeRange =BMI160HAL::gyroRange_t::GYRO_500;
			break;
		case 1000:
			BMI160_policy1.gyroscopeRange =BMI160HAL::gyroRange_t::GYRO_1000;
			break;
		case 2000:
			BMI160_policy1.gyroscopeRange =BMI160HAL::gyroRange_t::GYRO_2000;
			break;
		default:{}
		}
	}

	//BMI160_sensorPolicy : sensor gyroscope x offset
	if (ret) {
		float gyro_x_offset = jsonBuffer["bmi160_gyro_x_offset"];
		//logi("bmi160_gyro_x_offset  ",gyro_x_offset );
		BMI160_policy1.gyro_x_offset=(float)gyro_x_offset;
	}

	//BMI160_sensorPolicy : sensor gyroscope y offset
	if (ret) {
		float gyro_y_offset = jsonBuffer["bmi160_gyro_y_offset"];
		//logi("bmi160_gyro_y_offset  ",gyro_y_offset );
		BMI160_policy1.gyro_x_offset=(float)gyro_y_offset;
	}

	//BMI160_sensorPolicy : sensor gyroscope z offset
	if (ret) {
		float gyro_z_offset = jsonBuffer["bmi160_gyro_z_offset"];
		//logi("bmi160_gyro_z_offset ",gyro_z_offset );
		BMI160_policy1.gyro_z_offset=(float)gyro_z_offset;
	}

	//BMI160_sensorPolicy : sensor gyroscope scale correction
	if (ret) {
		float gyro_scaleCorrection = jsonBuffer["bmi160_gyro_scaleCorrection"];
		//logi("bmi160_gyro_scaleCorrection  ",gyro_scaleCorrection );
		BMI160_policy1.gyro_scaleCorrection=(float)gyro_scaleCorrection;
	}

	//BMI160_sensorPolicy : sensor gyroscope bias
	if (ret) {
		float gyro_bais = jsonBuffer["bmi160_gyro_bais"];
		//logi("bmi160_gyro_bais  ",gyro_bais );
		BMI160_policy1.gyro_bais=(float)gyro_bais;
	}

	//BMI160_sensorPolicy : sensor accelerometer range
	if (ret) {
		int accelerometerRange = jsonBuffer["bmi160_accelerometerRange"];
		//logi("bmi160_accelerometerRange ",accelerometerRange );
		switch (accelerometerRange){
		case 2:
			BMI160_policy1.accelerometerRange=BMI160HAL::accelRange_t::ACC_2G;
			break;
		case 4:
			BMI160_policy1.accelerometerRange=BMI160HAL::accelRange_t::ACC_4G;
			break;
		case 8:
			BMI160_policy1.accelerometerRange=BMI160HAL::accelRange_t::ACC_8G;
			break;
		case 16:
			BMI160_policy1.accelerometerRange=BMI160HAL::accelRange_t::ACC_16G;
			break;
		default:{}
		}
	}

	//BMI160_sensorPolicy : sensor accelerometer x offset
	if (ret) {
		float acc_x_offset = jsonBuffer["bmi160_acc_x_offset"];
		//logi("bmi160_acc_x_offset ",acc_x_offset );
		BMI160_policy1.acc_x_offset=(float)acc_x_offset;
	}

	//BMI160_sensorPolicy : sensor accelerometer y offset
	if (ret) {
		float acc_y_offset = jsonBuffer["bmi160_acc_y_offset"];
		//logi("bmi160_acc_y_offset ",acc_y_offset );
		BMI160_policy1.acc_y_offset=(float)acc_y_offset;
	}

	//BMI160_sensorPolicy : sensor accelerometer z offset
	if (ret) {
		float acc_z_offset = jsonBuffer["bmi160_acc_z_offset"];
		//logi("bmi160_acc_z_offset ",acc_z_offset );
		BMI160_policy1.acc_x_offset=(float)acc_z_offset;
	}

	//BMI160_sensorPolicy : sensor accelerometer scale correction
	if (ret) {
		float acc_scaleCorrection = jsonBuffer["bmi160_acc_scaleCorrection"];
		//logi("bmi160_acc_scaleCorrection ",acc_scaleCorrection );
		BMI160_policy1.acc_scaleCorrection=(float)acc_scaleCorrection;
	}

	//BMI160_sensorPolicy : sensor accelerometer scale correction
	if (ret) {
		uint32_t bmi160_sampling_frequency = jsonBuffer["bmi160_sampling_frequency"];
		//logi("bmi160_sampling_frequency ",bmi160_sampling_frequency );
		BMI160_policy1.sample_frequency= (float)bmi160_sampling_frequency;
	}




	//BME280 Sensor

	//BME280::sensorPolicy : sensor enable
	if (ret) {
		bool en = jsonBuffer["bme280_en"];
		//logi("bme280_en ",en );
		if (en) {
			BME280_policy1.sensor_en = GPSApp::selector::ENABLE;
		}
		else {
			BME280_policy1.sensor_en = GPSApp::selector::DISABLE;
		}
	}

	//BME280::sensorPolicy :  sensor id
	if(ret){
		string id = jsonBuffer["bme280_id"];
		//logi("bme280_id ",id );
		if(!id.empty()){
			BME280_policy1.sensorElementID.assign(id);
		}
		else{
			BME280_policy1.sensorElementID.clear();
		}
	}

	//BME280::sensorPolicy : sensor description
	if(ret){
		string description =  jsonBuffer["bme280_description"];
		//logi("bme280_description ",description );
		if(!description.empty()){
			BME280_policy1.description.assign(description);
		}
		else{
			BME280_policy1.description.clear();
		}
	}

	//BME280::sensorPolicy : sensor Measurement type
	if(ret){
		string measurement_type = jsonBuffer["bme280_measurement_type"];
		//logi("bme280_measurement_type ",measurement_type );
		if(!measurement_type.empty()){
			BME280_policy1.measurement_type.assign(measurement_type);
		}
		else{
			BME280_policy1.measurement_type.clear();
		}
	}

	//BME280::sensorPolicy : sensor measurement topic
	if(ret){
		string measurement_topic = jsonBuffer["bme280_measurement_topic"];
		//logi("bme280_measurement_topic ", measurement_topic);
		if(!measurement_topic.empty()){
			BME280_policy1.measurement_topic.assign(measurement_topic);
		}
		else{
			BME280_policy1.measurement_topic.clear();
		}
	}

	//BME280::sensorPolicy : sensor log message topic
	if(ret){
		string log_msg_topic = jsonBuffer["bme280_log_msg_topic"];
		//logi("bme280_log_msg_topic ",log_msg_topic );
		if(!log_msg_topic.empty()){
			BME280_policy1.log_msg_topic.assign(log_msg_topic);
		}
		else{
			BME280_policy1.log_msg_topic.clear();
		}
	}

	//BME280::sensorPolicy : sensor peripheral communication interface
	if(ret){
		string peripheral_comm_interface = jsonBuffer["bme280_peripheral_comm_interface"];
		//logi("bme280_peripheral_comm_interface ",peripheral_comm_interface );
		if(!peripheral_comm_interface.empty()){
			if(peripheral_comm_interface=="i2c0")
				BME280_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_0;
			else if(peripheral_comm_interface=="i2c1")
				BME280_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_1;
			else if(peripheral_comm_interface=="uart0")
				BME280_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_0;
			else if(peripheral_comm_interface=="uart1")
				BME280_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_1;
			else if(peripheral_comm_interface=="uart2")
				BME280_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_2;
			else if(peripheral_comm_interface=="lsspi")
				BME280_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::LS_SPI;
			else if(peripheral_comm_interface=="hsspi")
				BME280_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::HS_SPI;
			else{}
		}
		else{}
	}

	//BME280::sensorPolicy :  sensor peripheral communication address
	if(ret){
		int peripheral_comm_address_dec = jsonBuffer["bme280_peripheral_comm_address_dec"];
		//logi("bme280_peripheral_comm_address_dec ",peripheral_comm_address_dec );
		BME280_policy1.peripheralCommAddress=((uint8_t)peripheral_comm_address_dec);
	}

	//BME280::sensorPolicy : sensor telemetry communication interface
	if(ret){
		string telemetry_interface = jsonBuffer["bme280_telemetry_interface"];
		//logi("bme280_telemetry_interface ",telemetry_interface );
		if(!telemetry_interface.empty()){
			if(telemetry_interface=="mqtt")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::MQTT;
			else if(telemetry_interface=="wifi_tcp")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::TCP_SOCKET;
			else if(telemetry_interface=="wifi_udp")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::UDP_SOCKET;
			else if(telemetry_interface=="web_socket")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::WEBSOCKET;
			else if(telemetry_interface=="ble_client_1")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_1;
			else if(telemetry_interface=="ble_client_2")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_2;
			else if(telemetry_interface=="ble_client_3")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_3;
			else if(telemetry_interface=="ble_client_4")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_4;
			else if(telemetry_interface=="ble_client_5")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_5;
			else if(telemetry_interface=="ble_client_6")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_6;
			else if(telemetry_interface=="ble_client_7")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_7;
			else if(telemetry_interface=="ble_server")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_SERVER;
			else if(telemetry_interface=="sub_ghz_868mhz")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::SUB_GHZ_868MHZ;
			else if(telemetry_interface=="influx")
				BME280_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::INFLUXCLIENT;
			else{}
		}
		else{}
	}

	//BME280::sensorPolicy :  sensor sea level atmospheric pressure
	if(ret){
		float peripheral_comm_address_dec = jsonBuffer["bme280_sea_level_atm_pressure"];
		//logi("bme280_sea_level_atm_pressure ",peripheral_comm_address_dec );
		BME280_policy1.seaLevelAtmosphericPressure=(float)peripheral_comm_address_dec;
	}

	//BME280_sensorPolicy : sampling frequency
	if (ret) {
		uint32_t bme280_sampling_frequency = jsonBuffer["bme280_sampling_frequency"];
		//logi("bme280_sampling_frequency ",bme280_sampling_frequency );
		BME280_policy1.sample_frequency= (float)bme280_sampling_frequency;
	}

	//GPS Sensor
	//GPS::sensorPolicy : sensor enable
	if (ret) {
		bool en = jsonBuffer["gps_en"];
		//logi("gps_en ", en);
		if (en) {
			GPS_policy1.sensor_en = SensorBase::selector::ENABLE;
		}
		else {
			GPS_policy1.sensor_en = SensorBase::selector::DISABLE;
		}
	}

	//GPS::sensorPolicy :  sensor id
	if(ret){
		string id = jsonBuffer["gps_id"];
		//logi("gps_id ",id );
		if(!id.empty()){
			GPS_policy1.sensorElementID.assign(id);
		}
		else{
			GPS_policy1.sensorElementID.clear();
		}
	}

	//GPS::sensorPolicy : sensor description
	if(ret){
		string description =  jsonBuffer["gps_description"];
		//logi("gps_description ",description );
		if(!description.empty()){
			GPS_policy1.description.assign(description);
		}
		else{
			GPS_policy1.description.clear();
		}
	}

	//GPS::sensorPolicy : sensor Measurement type
	if(ret){
		string measurement_type = jsonBuffer["gps_measurement_type"];
		//logi("gps_measurement_type ",measurement_type );
		if(!measurement_type.empty()){
			GPS_policy1.measurement_type.assign(measurement_type);
		}
		else{
			GPS_policy1.measurement_type.clear();
		}
	}

	//GPS::sensorPolicy : sensor measurement topic
	if(ret){
		string measurement_topic = jsonBuffer["gps_measurement_topic"];
		//logi("gps_measurement_topic ",measurement_topic );
		if(!measurement_topic.empty()){
			GPS_policy1.measurement_topic.assign(measurement_topic);
		}
		else{
			GPS_policy1.measurement_topic.clear();
		}
	}

	//GPS::sensorPolicy : sensor log message topic
	if(ret){
		string log_msg_topic = jsonBuffer["gps_log_msg_topic"];
		//logi("gps_log_msg_topic ",log_msg_topic );
		if(!log_msg_topic.empty()){
			GPS_policy1.log_msg_topic.assign(log_msg_topic);
		}
		else{
			GPS_policy1.log_msg_topic.clear();
		}
	}

	//GPS::sensorPolicy : sensor peripheral communication interface
	if(ret){
		string peripheral_comm_interface = jsonBuffer["gps_peripheral_comm_interface"];
		//logi("gps_peripheral_comm_interface  ",peripheral_comm_interface );
		if(!peripheral_comm_interface.empty()){
			if(peripheral_comm_interface=="i2c0")
				GPS_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_0;
			else if(peripheral_comm_interface=="i2c1")
				GPS_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::I2C_1;
			else if(peripheral_comm_interface=="uart0")
				GPS_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_0;
			else if(peripheral_comm_interface=="uart1")
				GPS_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_1;
			else if(peripheral_comm_interface=="uart2")
				GPS_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::UART_2;
			else if(peripheral_comm_interface=="lsspi")
				GPS_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::LS_SPI;
			else if(peripheral_comm_interface=="hsspi")
				GPS_policy1.peripheralCommInterface=comm_hardware::sensor_comm_interface::HS_SPI;
			else{}
		}
		else{}
	}

	//GPS::sensorPolicy :  sensor peripheral communication address
	if(ret){
		int peripheral_comm_address_dec = jsonBuffer["gps_peripheral_comm_address_dec"];
		//logi("gps_peripheral_comm_address_dec ",peripheral_comm_address_dec );
		GPS_policy1.peripheralCommAddress=((uint8_t)peripheral_comm_address_dec);
	}

	//BME280::sensorPolicy : sensor telemetry communication interface
	if(ret){
		string telemetry_interface = jsonBuffer["gps_telemetry_interface"];
		//logi("gps_telemetry_interface ",telemetry_interface );
		if(!telemetry_interface.empty()){
			if(telemetry_interface=="mqtt")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::MQTT;
			else if(telemetry_interface=="wifi_tcp")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::TCP_SOCKET;
			else if(telemetry_interface=="wifi_udp")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::UDP_SOCKET;
			else if(telemetry_interface=="web_socket")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::WEBSOCKET;
			else if(telemetry_interface=="ble_client_1")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_1;
			else if(telemetry_interface=="ble_client_2")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_2;
			else if(telemetry_interface=="ble_client_3")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_3;
			else if(telemetry_interface=="ble_client_4")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_4;
			else if(telemetry_interface=="ble_client_5")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_5;
			else if(telemetry_interface=="ble_client_6")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_6;
			else if(telemetry_interface=="ble_client_7")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_CLIENT_CONN_7;
			else if(telemetry_interface=="ble_server")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::BLE_SERVER;
			else if(telemetry_interface=="sub_ghz_868mhz")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::SUB_GHZ_868MHZ;
			else if(telemetry_interface=="influx")
				GPS_policy1.telemetryInterface=comm_protocol::gateway_comm_interface::INFLUXCLIENT;
			else{}
		}
		else{}
	}

	//GPS_sensorPolicy : sampling frequency
	if (ret) {
		uint32_t gps_sampling_frequency = jsonBuffer["gps_sampling_frequency"];
		//logi("gps_sampling_frequency ",gps_sampling_frequency );
		GPS_policy1.sample_frequency= (float)gps_sampling_frequency;
	}

	if(ret==false){
		//logi(CONFIG_MANAGER_CALLBACK_TAG,"Failed to update Sensor configuration");
	}else{
		//logi(CONFIG_MANAGER_CALLBACK_TAG,"Sensor configuration complete ");
	}

	return ret;
}


bool configManager::updateProtocolConfigurationFromStorageMedia(){
	bool ret = true;
	StaticJsonDocument<jsonFileSizeInBytes> jsonBuffer;
	string jsonFile;
	ret = SDCardStorage::read("/sys/protocol.txt",jsonFile,jsonFileSizeInBytes);

	if(ret){
		if(deserializeJson(jsonBuffer, jsonFile)!= DeserializationError::Ok){
			ret = false;
		}
	}


	//logi(CONFIG_MANAGER_CALLBACK_TAG, "Protocol configuration");

	//Protocol attributes are updated based on parsed JSON
	//Protocol attributes are updated based on parsed JSON

	//MQTT protocol
	//mqttClient_t::policy_t : mqtt client enable
	if (ret) {
		bool en = jsonBuffer["mqttc_en"];
		//logi("mqttc_en  ", en);
		if (en) {
			protocol_usage_policy1.MQTTClient_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.MQTTClient_en =  comm_protocol::selector::DISABLE;
		}
	}


	//mqttClient_t::policy_t : mqtt client uri
	if(ret){
		string uri = jsonBuffer["mqttb_uri"];
		//logi("mqttb_uri  ", uri);
		if(!uri.empty()){
			mqtt_client_policy1.MQTTClient_URI.assign(uri);
		}
		else{
			mqtt_client_policy1.MQTTClient_URI.clear();
		}
	}

	//mqttClient_t::policy_t : mqtt client port
	if(ret){
		int port = jsonBuffer["mqttb_port"];
		//logi("mqttb_port  ",port );
		mqtt_client_policy1.MQTTClient_port=(int)port;
	}

	//mqttClient_t::policy_t : mqtt client timeout
	if(ret){
		int keep_alive_timeout = jsonBuffer["mqttc_keep_alive_timeout"];
		//logi("mqttc_keep_alive_timeout ",keep_alive_timeout );
		mqtt_client_policy1.MQTTClient_keepAliveTimeout=(int)keep_alive_timeout;
	}

	//mqttClient_t::policy_t : mqtt client quality of service (qos)
	if(ret){
		int qos = jsonBuffer["mqttc_qos"];
		//logi("mqttc_qos  ",qos );
		mqtt_client_policy1.MQTTClient_qos=(int)qos;
	}

	//mqttClient_t::policy_t : mqtt client enable clean session
	if (ret) {
		bool enable_clean_session = jsonBuffer["mqttc_enable_clean_session"];
		//logi("mqttc_enable_clean_session ",enable_clean_session );
		if (enable_clean_session) {
			mqtt_client_policy1.MQTTClient_enableCleanSession = true;
		}
		else {
			mqtt_client_policy1.MQTTClient_enableCleanSession = false;
		}
	}

	//mqttClient_t::policy_t : mqtt client enable auto reconnect
	if (ret) {
		bool enable_auto_reconnect = jsonBuffer["mqttc_enable_auto_reconnect"];
		//logi("mqttc_enable_auto_reconnect ",enable_auto_reconnect );
		if (enable_auto_reconnect) {
			mqtt_client_policy1.MQTTClient_enableAutoReconnect = true;
		}
		else {
			mqtt_client_policy1.MQTTClient_enableAutoReconnect = false;
		}
	}

	//mqttClient_t::policy_t : mqtt client last will topic
	if(ret){
		string last_will_topic = jsonBuffer["mqttc_last_will_topic"];
		//logi("mqttc_last_will_topic ",last_will_topic );
		if(!last_will_topic.empty()){
			mqtt_client_policy1.MQTTClient_lastWillTopic.assign(last_will_topic);
		}
		else{
			mqtt_client_policy1.MQTTClient_lastWillTopic.clear();
		}
	}

	//mqttClient_t::policy_t : mqtt client last will message
	if(ret){
		string last_will_msg = jsonBuffer["mqttc_last_will_msg"];
		//logi("mqttc_last_will_msg ",last_will_msg );
		if(!last_will_msg.empty()){
			mqtt_client_policy1.MQTTClient_lastWillMsg.assign(last_will_msg);
		}
		else{
			mqtt_client_policy1.MQTTClient_lastWillMsg.clear();
		}
	}


	//INFLUX DB client
	//influxdb_cpp::policy_t : influx db enable
	if (ret) {
		bool en = jsonBuffer["influxc_en"];
		//logi("influxc_en ", en);
		if (en) {
			protocol_usage_policy1.influxClient_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.influxClient_en =  comm_protocol::selector::DISABLE;
		}
	}

	//influxdb_cpp::policy_t : host ip address
	if(ret){
		string host = jsonBuffer["influxc_host"];
		//logi("influxc_host  ",host );
		if(!host.empty()){
			influxdb_client_policy1.host_.assign(host);
		}
		else{
			influxdb_client_policy1.host_.clear();
		}
	}

	//influxdb_cpp::policy_t : host post number
	if(ret){
		int port = jsonBuffer["influxc_port"];
		//logi("influxc_port  ",port );
		influxdb_client_policy1.port_=(int)port;
	}

	//influxdb_cpp::policy_t : DB Name
	if(ret){
		string db_name = jsonBuffer["influxc_db_name"];
		//logi("influxc_db_name  ",db_name );
		if(!db_name.empty()){
			influxdb_client_policy1.db_.assign(db_name);
		}
		else{
			influxdb_client_policy1.db_.clear();
		}
	}

	//influxdb_cpp::policy_t : DB UserName
	if(ret){
		string usr_name = jsonBuffer["influxc_usr_name"];
		//logi("influxc_usr_name ",usr_name );
		if(!usr_name.empty()){
			influxdb_client_policy1.usr_.assign(usr_name);
		}
		else{
			influxdb_client_policy1.usr_.clear();
		}
	}

	//influxdb_cpp::policy_t : DB Password
	if(ret){
		string password = jsonBuffer["influxc_password"];
		//logi("influxc_password  ", password);
		if(!password.empty()){
			influxdb_client_policy1.pwd_.assign(password);
		}
		else{
			influxdb_client_policy1.pwd_.clear();
		}
	}


	//Bluetooth configration policy

	//Bluetooth client 1
	//BLEClientProfile_MultiByteUART : bluetooth client1 enable
	if (ret) {
		bool client1_en = jsonBuffer["ble_client1_en"];
		//logi("ble_client1_en  ",client1_en );
		if (client1_en) {
			protocol_usage_policy1.BLEClientConnection1_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.BLEClientConnection1_en =  comm_protocol::selector::DISABLE;
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client1 name
	if(ret){
		string client1_name = jsonBuffer["ble_client1_name"];
		//logi("ble_client1_name  ",client1_name );
		if(!client1_name.empty()){
			ble_client_uart_policy1.deviceName.assign(client1_name);
		}
		else{
			ble_client_uart_policy1.deviceName.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client1 max devices to scan
	if(ret){
		int client1_max_device_to_scan = (uint8_t)jsonBuffer["ble_client1_max_device_to_scan"];
		//logi("ble_client1_max_device_to_scan  ",client1_max_device_to_scan );
		ble_client_uart_policy1.maxDeviceToScan=client1_max_device_to_scan;
	}

	//BLEClientProfile_MultiByteUART : bluetooth client1 service uuid
	if(ret){
		string client1_service_uuid = jsonBuffer["ble_client1_service_uuid"];
		//logi("ble_client1_service_uuid  ",client1_service_uuid );
		if(!client1_service_uuid.empty()){
			ble_client_uart_policy1.service_uuid.assign(client1_service_uuid);
		}
		else{
			ble_client_uart_policy1.service_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client1 transmission 'tx' uuid
	if(ret){
		string client1_tx_uuid = jsonBuffer["ble_client1_tx_uuid"];
		//logi("ble_client1_tx_uuid  ",client1_tx_uuid );
		if(!client1_tx_uuid.empty()){
			ble_client_uart_policy1.tx_char_uuid.assign(client1_tx_uuid);
		}
		else{
			ble_client_uart_policy1.tx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client1 reception 'rx' uuid
	if(ret){
		string client1_rx_uuid = jsonBuffer["ble_client1_rx_uuid"];
		//logi("ble_client1_rx_uuid  ", client1_rx_uuid);
		if(!client1_rx_uuid.empty()){
			ble_client_uart_policy1.rx_char_uuid.assign(client1_rx_uuid);
		}
		else{
			ble_client_uart_policy1.rx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client1 bonded device address
	if(ret){
		string client1_bonded_dev_address = jsonBuffer["ble_client1_bonded_dev_address"];
		//logi("ble_client1_bonded_dev_address  ",client1_bonded_dev_address );
		if(!client1_bonded_dev_address.empty()){
			ble_client_uart_policy1.bondedDevAddress.assign(client1_bonded_dev_address);
		}
		else{
			ble_client_uart_policy1.bondedDevAddress.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client1 bonded device address type
	if(ret){
		string client1_bonded_dev_address_type = jsonBuffer["ble_client1_bonded_dev_address_type"];
		//logi("ble_client1_bonded_dev_address_type  ",client1_bonded_dev_address_type );
		if(!client1_bonded_dev_address_type.empty()){
			if(client1_bonded_dev_address_type=="public")
				ble_client_uart_policy1.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client1_bonded_dev_address_type=="random")
				ble_client_uart_policy1.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RANDOM; // @suppress("Symbol is not resolved")
			else if(client1_bonded_dev_address_type=="rpa_public")
				ble_client_uart_policy1.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client1_bonded_dev_address_type=="rpa_random")
				ble_client_uart_policy1.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_RANDOM; // @suppress("Symbol is not resolved")
			else{}
		}
		else{}
	}

	//Bluetooth client 2
	//BLEClientProfile_MultiByteUART : bluetooth client2 enable
	if (ret) {
		bool client2_en = jsonBuffer["ble_client2_en"];
		//logi("ble_client2_en  ",client2_en );
		if (client2_en) {
			protocol_usage_policy1.BLEClientConnection2_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.BLEClientConnection2_en =  comm_protocol::selector::DISABLE;
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client2 name
	if(ret){
		string client2_name = jsonBuffer["ble_client2_name"];
		//logi("ble_client2_name  ",client2_name );
		if(!client2_name.empty()){
			ble_client_uart_policy2.deviceName.assign(client2_name);
		}
		else{
			ble_client_uart_policy2.deviceName.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client2 max devices to scan
	if(ret){
		int client2_max_device_to_scan = (uint8_t)jsonBuffer["ble_client2_max_device_to_scan"];
		//logi("ble_client2_max_device_to_scan  ",client2_max_device_to_scan );
		ble_client_uart_policy2.maxDeviceToScan=client2_max_device_to_scan;
	}

	//BLEClientProfile_MultiByteUART : bluetooth client2 service uuid
	if(ret){
		string client2_service_uuid = jsonBuffer["ble_client2_service_uuid"];
		//logi("ble_client2_service_uuid  ", client2_service_uuid);
		if(!client2_service_uuid.empty()){
			ble_client_uart_policy2.service_uuid.assign(client2_service_uuid);
		}
		else{
			ble_client_uart_policy2.service_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client2 transmission 'tx' uuid
	if(ret){
		string client2_tx_uuid = jsonBuffer["ble_client2_tx_uuid"];
		//logi("ble_client2_tx_uuid  ",client2_tx_uuid );
		if(!client2_tx_uuid.empty()){
			ble_client_uart_policy2.tx_char_uuid.assign(client2_tx_uuid);
		}
		else{
			ble_client_uart_policy2.tx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client2 reception 'rx' uuid
	if(ret){
		string client2_rx_uuid = jsonBuffer["ble_client2_rx_uuid"];
		//logi("ble_client2_rx_uuid  ",client2_rx_uuid );
		if(!client2_rx_uuid.empty()){
			ble_client_uart_policy2.rx_char_uuid.assign(client2_rx_uuid);
		}
		else{
			ble_client_uart_policy2.rx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client2 bonded device address
	if(ret){
		string client2_bonded_dev_address = jsonBuffer["ble_client2_bonded_dev_address"];
		//logi("ble_client2_bonded_dev_address  ",client2_bonded_dev_address );
		if(!client2_bonded_dev_address.empty()){
			ble_client_uart_policy2.bondedDevAddress.assign(client2_bonded_dev_address);
		}
		else{
			ble_client_uart_policy2.bondedDevAddress.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client2 bonded device address type
	if(ret){
		string client2_bonded_dev_address_type = jsonBuffer["ble_client2_bonded_dev_address_type"];
		//logi("ble_client2_bonded_dev_address_type  ",client2_bonded_dev_address_type );
		if(!client2_bonded_dev_address_type.empty()){
			if(client2_bonded_dev_address_type=="public")
				ble_client_uart_policy2.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client2_bonded_dev_address_type=="random")
				ble_client_uart_policy2.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RANDOM; // @suppress("Symbol is not resolved")
			else if(client2_bonded_dev_address_type=="rpa_public")
				ble_client_uart_policy2.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client2_bonded_dev_address_type=="rpa_random")
				ble_client_uart_policy2.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_RANDOM; // @suppress("Symbol is not resolved")
			else{}
		}
		else{}
	}


	//Bluetooth client 3
	//BLEClientProfile_MultiByteUART : bluetooth client3 enable
	if (ret) {
		bool client3_en = jsonBuffer["ble_client3_en"];
		//logi("ble_client3_en  ",client3_en );
		if (client3_en) {
			protocol_usage_policy1.BLEClientConnection3_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.BLEClientConnection3_en =  comm_protocol::selector::DISABLE;
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client3 name
	if(ret){
		string client3_name = jsonBuffer["ble_client3_name"];
		//logi("ble_client3_name  ",client3_name );
		if(!client3_name.empty()){
			ble_client_uart_policy3.deviceName.assign(client3_name);
		}
		else{
			ble_client_uart_policy3.deviceName.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client3 max devices to scan
	if(ret){
		int client3_max_device_to_scan = (uint8_t)jsonBuffer["ble_client3_max_device_to_scan"];
		//logi("ble_client3_max_device_to_scan  ",client3_max_device_to_scan );
		ble_client_uart_policy3.maxDeviceToScan=client3_max_device_to_scan;
	}

	//BLEClientProfile_MultiByteUART : bluetooth client3 service uuid
	if(ret){
		string client3_service_uuid = jsonBuffer["ble_client3_service_uuid"];
		//logi(" ble_client3_service_uuid ", client3_service_uuid);
		if(!client3_service_uuid.empty()){
			ble_client_uart_policy3.service_uuid.assign(client3_service_uuid);
		}
		else{
			ble_client_uart_policy3.service_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client3 transmission 'tx' uuid
	if(ret){
		string client3_tx_uuid = jsonBuffer["ble_client3_tx_uuid"];
		//logi("ble_client3_tx_uuid  ", client3_tx_uuid);
		if(!client3_tx_uuid.empty()){
			ble_client_uart_policy3.tx_char_uuid.assign(client3_tx_uuid);
		}
		else{
			ble_client_uart_policy3.tx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client3 reception 'rx' uuid
	if(ret){
		string client3_rx_uuid = jsonBuffer["ble_client3_rx_uuid"];
		//logi("ble_client3_rx_uuid  ",client3_rx_uuid );
		if(!client3_rx_uuid.empty()){
			ble_client_uart_policy3.rx_char_uuid.assign(client3_rx_uuid);
		}
		else{
			ble_client_uart_policy3.rx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client3 bonded device address
	if(ret){
		string client3_bonded_dev_address = jsonBuffer["ble_client3_bonded_dev_address"];
		//logi("ble_client3_bonded_dev_address  ", client3_bonded_dev_address);
		if(!client3_bonded_dev_address.empty()){
			ble_client_uart_policy3.bondedDevAddress.assign(client3_bonded_dev_address);
		}
		else{
			ble_client_uart_policy3.bondedDevAddress.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client3 bonded device address type
	if(ret){
		string client3_bonded_dev_address_type = jsonBuffer["ble_client3_bonded_dev_address_type"];
		//logi("ble_client3_bonded_dev_address_type  ",client3_bonded_dev_address_type );
		if(!client3_bonded_dev_address_type.empty()){
			if(client3_bonded_dev_address_type=="public")
				ble_client_uart_policy3.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client3_bonded_dev_address_type=="random")
				ble_client_uart_policy3.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RANDOM; // @suppress("Symbol is not resolved")
			else if(client3_bonded_dev_address_type=="rpa_public")
				ble_client_uart_policy3.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client3_bonded_dev_address_type=="rpa_random")
				ble_client_uart_policy3.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_RANDOM; // @suppress("Symbol is not resolved")
			else{}
		}
		else{}
	}


	//Bluetooth client 4
	//BLEClientProfile_MultiByteUART : bluetooth client4 enable
	if (ret) {
		bool client4_en = jsonBuffer["ble_client4_en"];
		//logi("ble_client4_en  ", client4_en);
		if (client4_en) {
			protocol_usage_policy1.BLEClientConnection4_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.BLEClientConnection4_en =  comm_protocol::selector::DISABLE;
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client4 name
	if(ret){
		string client4_name = jsonBuffer["ble_client4_name"];
		//logi("ble_client4_name  ", client4_name);
		if(!client4_name.empty()){
			ble_client_uart_policy4.deviceName.assign(client4_name);
		}
		else{
			ble_client_uart_policy4.deviceName.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client4 max devices to scan
	if(ret){
		int client4_max_device_to_scan = (uint8_t)jsonBuffer["ble_client4_max_device_to_scan"];
		//logi("ble_client4_max_device_to_scan  ", client4_max_device_to_scan);
		ble_client_uart_policy4.maxDeviceToScan=client4_max_device_to_scan;
	}

	//BLEClientProfile_MultiByteUART : bluetooth client4 service uuid
	if(ret){
		string client4_service_uuid = jsonBuffer["ble_client4_service_uuid"];
		//logi("ble_client4_service_uuid  ",client4_service_uuid );
		if(!client4_service_uuid.empty()){
			ble_client_uart_policy4.service_uuid.assign(client4_service_uuid);
		}
		else{
			ble_client_uart_policy4.service_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client4 transmission 'tx' uuid
	if(ret){
		string client4_tx_uuid = jsonBuffer["ble_client4_tx_uuid"];
		//logi("ble_client4_tx_uuid  ",client4_tx_uuid );
		if(!client4_tx_uuid.empty()){
			ble_client_uart_policy4.tx_char_uuid.assign(client4_tx_uuid);
		}
		else{
			ble_client_uart_policy4.tx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client4 reception 'rx' uuid
	if(ret){
		string client4_rx_uuid = jsonBuffer["ble_client4_rx_uuid"];
		//logi("ble_client4_rx_uuid  ",client4_rx_uuid );
		if(!client4_rx_uuid.empty()){
			ble_client_uart_policy4.rx_char_uuid.assign(client4_rx_uuid);
		}
		else{
			ble_client_uart_policy4.rx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client4 bonded device address
	if(ret){
		string client4_bonded_dev_address = jsonBuffer["ble_client4_bonded_dev_address"];
		//logi("ble_client4_bonded_dev_address  ",client4_bonded_dev_address );
		if(!client4_bonded_dev_address.empty()){
			ble_client_uart_policy4.bondedDevAddress.assign(client4_bonded_dev_address);
		}
		else{
			ble_client_uart_policy4.bondedDevAddress.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client4 bonded device address type
	if(ret){
		string client4_bonded_dev_address_type = jsonBuffer["ble_client4_bonded_dev_address_type"];
		//logi("ble_client4_bonded_dev_address_type  ",client4_bonded_dev_address_type );
		if(!client4_bonded_dev_address_type.empty()){
			if(client4_bonded_dev_address_type=="public")
				ble_client_uart_policy4.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client4_bonded_dev_address_type=="random")
				ble_client_uart_policy4.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RANDOM; // @suppress("Symbol is not resolved")
			else if(client4_bonded_dev_address_type=="rpa_public")
				ble_client_uart_policy4.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client4_bonded_dev_address_type=="rpa_random")
				ble_client_uart_policy4.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_RANDOM; // @suppress("Symbol is not resolved")
			else{}
		}
		else{}
	}

	//Bluetooth client 5
	//BLEClientProfile_MultiByteUART : bluetooth client5 enable
	if (ret) {
		bool client5_en = jsonBuffer["ble_client5_en"];
		//logi("ble_client5_en  ", client5_en);
		if (client5_en) {
			protocol_usage_policy1.BLEClientConnection5_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.BLEClientConnection5_en =  comm_protocol::selector::DISABLE;
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client5 name
	if(ret){
		string client5_name = jsonBuffer["ble_client5_name"];
		//logi("ble_client5_name  ",client5_name );
		if(!client5_name.empty()){
			ble_client_uart_policy5.deviceName.assign(client5_name);
		}
		else{
			ble_client_uart_policy5.deviceName.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client5 max devices to scan
	if(ret){
		int client5_max_device_to_scan = (uint8_t)jsonBuffer["ble_client5_max_device_to_scan"];
		//logi("ble_client5_max_device_to_scan  ",client5_max_device_to_scan );
		ble_client_uart_policy5.maxDeviceToScan=client5_max_device_to_scan;
	}

	//BLEClientProfile_MultiByteUART : bluetooth client5 service uuid
	if(ret){
		string client5_service_uuid = jsonBuffer["ble_client5_service_uuid"];
		//logi("ble_client5_service_uuid  ",client5_service_uuid );
		if(!client5_service_uuid.empty()){
			ble_client_uart_policy5.service_uuid.assign(client5_service_uuid);
		}
		else{
			ble_client_uart_policy5.service_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client5 transmission 'tx' uuid
	if(ret){
		string client5_tx_uuid = jsonBuffer["ble_client5_tx_uuid"];
		//logi("ble_client5_tx_uuid  ", client5_tx_uuid);
		if(!client5_tx_uuid.empty()){
			ble_client_uart_policy5.tx_char_uuid.assign(client5_tx_uuid);
		}
		else{
			ble_client_uart_policy5.tx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client5 reception 'rx' uuid
	if(ret){
		string client5_rx_uuid = jsonBuffer["ble_client5_rx_uuid"];
		//logi("ble_client5_rx_uuid  ",client5_rx_uuid );
		if(!client5_rx_uuid.empty()){
			ble_client_uart_policy5.rx_char_uuid.assign(client5_rx_uuid);
		}
		else{
			ble_client_uart_policy5.rx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client5 bonded device address
	if(ret){
		string client5_bonded_dev_address = jsonBuffer["ble_client5_bonded_dev_address"];
		//logi("ble_client5_bonded_dev_address  ", client5_bonded_dev_address);
		if(!client5_bonded_dev_address.empty()){
			ble_client_uart_policy5.bondedDevAddress.assign(client5_bonded_dev_address);
		}
		else{
			ble_client_uart_policy5.bondedDevAddress.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client5 bonded device address type
	if(ret){
		string client5_bonded_dev_address_type = jsonBuffer["ble_client5_bonded_dev_address_type"];
		//logi("ble_client5_bonded_dev_address_type  ", client5_bonded_dev_address_type);
		if(!client5_bonded_dev_address_type.empty()){
			if(client5_bonded_dev_address_type=="public")
				ble_client_uart_policy5.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client5_bonded_dev_address_type=="random")
				ble_client_uart_policy5.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RANDOM; // @suppress("Symbol is not resolved")
			else if(client5_bonded_dev_address_type=="rpa_public")
				ble_client_uart_policy5.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client5_bonded_dev_address_type=="rpa_random")
				ble_client_uart_policy5.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_RANDOM; // @suppress("Symbol is not resolved")
			else{}
		}
		else{}
	}

	//Bluetooth client 6
	//BLEClientProfile_MultiByteUART : bluetooth client6 enable
	if (ret) {
		bool client6_en = jsonBuffer["ble_client6_en"];
		//logi("ble_client6_en  ",client6_en );
		if (client6_en) {
			protocol_usage_policy1.BLEClientConnection6_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.BLEClientConnection6_en =  comm_protocol::selector::DISABLE;
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client6 name
	if(ret){
		string client6_name = jsonBuffer["ble_client6_name"];
		//logi("ble_client6_name  ",client6_name );
		if(!client6_name.empty()){
			ble_client_uart_policy6.deviceName.assign(client6_name);
		}
		else{
			ble_client_uart_policy6.deviceName.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client6 max devices to scan
	if(ret){
		int client6_max_device_to_scan = (uint8_t)jsonBuffer["ble_client6_max_device_to_scan"];
		//logi("ble_client6_max_device_to_scan  ",client6_max_device_to_scan );
		ble_client_uart_policy6.maxDeviceToScan=client6_max_device_to_scan;
	}

	//BLEClientProfile_MultiByteUART : bluetooth client6 service uuid
	if(ret){
		string client6_service_uuid = jsonBuffer["ble_client6_service_uuid"];
		//logi("ble_client6_service_uuid  ", client6_service_uuid);
		if(!client6_service_uuid.empty()){
			ble_client_uart_policy6.service_uuid.assign(client6_service_uuid);
		}
		else{
			ble_client_uart_policy6.service_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client6 transmission 'tx' uuid
	if(ret){
		string client6_tx_uuid = jsonBuffer["ble_client6_tx_uuid"];
		//logi("ble_client6_tx_uuid  ",client6_tx_uuid);
		if(!client6_tx_uuid.empty()){
			ble_client_uart_policy6.tx_char_uuid.assign(client6_tx_uuid);
		}
		else{
			ble_client_uart_policy6.tx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client6 reception 'rx' uuid
	if(ret){
		string client6_rx_uuid = jsonBuffer["ble_client6_rx_uuid"];
		//logi("ble_client6_rx_uuid  ",client6_rx_uuid );
		if(!client6_rx_uuid.empty()){
			ble_client_uart_policy6.rx_char_uuid.assign(client6_rx_uuid);
		}
		else{
			ble_client_uart_policy6.rx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client6 bonded device address
	if(ret){
		string client6_bonded_dev_address = jsonBuffer["ble_client6_bonded_dev_address"];
		//logi("ble_client6_bonded_dev_address  ", client6_bonded_dev_address);
		if(!client6_bonded_dev_address.empty()){
			ble_client_uart_policy6.bondedDevAddress.assign(client6_bonded_dev_address);
		}
		else{
			ble_client_uart_policy6.bondedDevAddress.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client6 bonded device address type
	if(ret){
		string client6_bonded_dev_address_type = jsonBuffer["ble_client6_bonded_dev_address_type"];
		//logi("ble_client6_bonded_dev_address_type  ",client6_bonded_dev_address_type );
		if(!client6_bonded_dev_address_type.empty()){
			if(client6_bonded_dev_address_type=="public")
				ble_client_uart_policy6.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client6_bonded_dev_address_type=="random")
				ble_client_uart_policy6.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RANDOM; // @suppress("Symbol is not resolved")
			else if(client6_bonded_dev_address_type=="rpa_public")
				ble_client_uart_policy6.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client6_bonded_dev_address_type=="rpa_random")
				ble_client_uart_policy6.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_RANDOM; // @suppress("Symbol is not resolved")
			else{}
		}
		else{}
	}

	//Bluetooth client 7
	//BLEClientProfile_MultiByteUART : bluetooth client7 enable
	if (ret) {
		bool client7_en = jsonBuffer["ble_client7_en"];
		//logi("ble_client7_en  ", client7_en);
		if (client7_en) {
			protocol_usage_policy1.BLEClientConnection7_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.BLEClientConnection7_en =  comm_protocol::selector::DISABLE;
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client7 name
	if(ret){
		string client7_name = jsonBuffer["ble_client7_name"];
		//logi("ble_client7_name  ",client7_name );
		if(!client7_name.empty()){
			ble_client_uart_policy7.deviceName.assign(client7_name);
		}
		else{
			ble_client_uart_policy7.deviceName.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client7 max devices to scan
	if(ret){
		int client7_max_device_to_scan = (uint8_t)jsonBuffer["ble_client7_max_device_to_scan"];
		//logi("ble_client7_max_device_to_scan  ", client7_max_device_to_scan);
		ble_client_uart_policy7.maxDeviceToScan=client7_max_device_to_scan;
	}

	//BLEClientProfile_MultiByteUART : bluetooth client7 service uuid
	if(ret){
		string client7_service_uuid = jsonBuffer["ble_client7_service_uuid"];
		//logi("ble_client7_service_uuid  ", client7_service_uuid);
		if(!client7_service_uuid.empty()){
			ble_client_uart_policy7.service_uuid.assign(client7_service_uuid);
		}
		else{
			ble_client_uart_policy7.service_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client7 transmission 'tx' uuid
	if(ret){
		string client7_tx_uuid = jsonBuffer["ble_client7_tx_uuid"];
		//logi("ble_client7_tx_uuid  ", client7_tx_uuid);
		if(!client7_tx_uuid.empty()){
			ble_client_uart_policy7.tx_char_uuid.assign(client7_tx_uuid);
		}
		else{
			ble_client_uart_policy7.tx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client7 reception 'rx' uuid
	if(ret){
		string client7_rx_uuid = jsonBuffer["ble_client7_rx_uuid"];
		//logi("ble_client7_rx_uuid  ",client7_rx_uuid );
		if(!client7_rx_uuid.empty()){
			ble_client_uart_policy7.rx_char_uuid.assign(client7_rx_uuid);
		}
		else{
			ble_client_uart_policy7.rx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client7 bonded device address
	if(ret){
		string client7_bonded_dev_address = jsonBuffer["ble_client7_bonded_dev_address"];
		//logi("ble_client7_bonded_dev_address  ",client7_bonded_dev_address );
		if(!client7_bonded_dev_address.empty()){
			ble_client_uart_policy7.bondedDevAddress.assign(client7_bonded_dev_address);
		}
		else{
			ble_client_uart_policy7.bondedDevAddress.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth client7 bonded device address type
	if(ret){
		string client7_bonded_dev_address_type = jsonBuffer["ble_client7_bonded_dev_address_type"];
		//logi("ble_client7_bonded_dev_address_type  ",client7_bonded_dev_address_type );
		if(!client7_bonded_dev_address_type.empty()){
			if(client7_bonded_dev_address_type=="public")
				ble_client_uart_policy7.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client7_bonded_dev_address_type=="random")
				ble_client_uart_policy7.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RANDOM; // @suppress("Symbol is not resolved")
			else if(client7_bonded_dev_address_type=="rpa_public")
				ble_client_uart_policy7.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_PUBLIC; // @suppress("Symbol is not resolved")
			else if(client7_bonded_dev_address_type=="rpa_random")
				ble_client_uart_policy7.bondedDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_RANDOM; // @suppress("Symbol is not resolved")
			else{}
		}
		else{}
	}



	//Bluetooth server
	//BLEServer_ProfileMultiByteUART: bluetooth server enable
	if (ret) {
		bool server_en = jsonBuffer["ble_server_en"];
		//logi("ble_server_en  ",server_en );
		if (server_en) {
			protocol_usage_policy1.BLEServer_en = comm_protocol::selector::ENABLE;
		}
		else {
			protocol_usage_policy1.BLEServer_en =  comm_protocol::selector::DISABLE;
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth server name
	if(ret){
		string server_name = jsonBuffer["ble_server_name"];
		//logi("ble_server_name  ",server_name );
		if(!server_name.empty()){
			ble_server_uart_policy.deviceName.assign(server_name);
		}
		else{
			ble_server_uart_policy.deviceName.clear();
		}
	}


	//BLEClientProfile_MultiByteUART : bluetooth server service uuid
	if(ret){
		string server_service_uuid = jsonBuffer["ble_server_service_uuid"];
		//logi("ble_server_service_uuid  ",server_service_uuid );
		if(!server_service_uuid.empty()){
			ble_server_uart_policy.service_uuid.assign(server_service_uuid);
		}
		else{
			ble_server_uart_policy.service_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth server transmission 'tx' uuid
	if(ret){
		string server_tx_uuid = jsonBuffer["ble_server_tx_uuid"];
		//logi("ble_server_tx_uuid  ",server_tx_uuid );
		if(!server_tx_uuid.empty()){
			ble_server_uart_policy.tx_char_uuid.assign(server_tx_uuid);
		}
		else{
			ble_server_uart_policy.tx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth server reception 'rx' uuid
	if(ret){
		string server_rx_uuid = jsonBuffer["ble_server_rx_uuid"];
		//logi("ble_server_rx_uuid  ",server_rx_uuid );
		if(!server_rx_uuid.empty()){
			ble_server_uart_policy.rx_char_uuid.assign(server_rx_uuid);
		}
		else{
			ble_server_uart_policy.rx_char_uuid.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth server device address
	if(ret){
		string server_dev_address = jsonBuffer["ble_server_dev_address"];
		//logi("ble_server_dev_address  ",server_dev_address );
		if(!server_dev_address.empty()){
			ble_server_uart_policy.serverDevAddress.assign(server_dev_address);
		}
		else{
			ble_server_uart_policy.serverDevAddress.clear();
		}
	}

	//BLEClientProfile_MultiByteUART : bluetooth server device address type
	if(ret){
		string server_dev_address_type = jsonBuffer["ble_server_dev_address_type"];
		//logi("ble_server_dev_address_type  ",server_dev_address_type );
		if(!server_dev_address_type.empty()){
			if(server_dev_address_type=="public")
				ble_server_uart_policy.serverDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_PUBLIC; // @suppress("Symbol is not resolved")
			else if(server_dev_address_type=="random")
				ble_server_uart_policy.serverDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RANDOM; // @suppress("Symbol is not resolved")
			else if(server_dev_address_type=="rpa_public")
				ble_server_uart_policy.serverDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_PUBLIC; // @suppress("Symbol is not resolved")
			else if(server_dev_address_type=="rpa_random")
				ble_server_uart_policy.serverDevAddressType=esp_ble_addr_type_t::BLE_ADDR_TYPE_RPA_RANDOM; // @suppress("Symbol is not resolved")
			else{}
		}
		else{}
	}

	if(ret==false){
		//logi(CONFIG_MANAGER_CALLBACK_TAG,"Failed to update Protocol configuration");
	}else{
		//logi(CONFIG_MANAGER_CALLBACK_TAG,"Protocol configuration complete ");
	}

	return ret;

}

bool configManager::updateStorageConfigurationFromStorageMedia(){
	bool ret = true;
	StaticJsonDocument<jsonFileSizeInBytes> jsonBuffer;
	string jsonFile;
	ret = SDCardStorage::read("/sys/storage.txt",jsonFile,jsonFileSizeInBytes);

	if(ret){
		if(deserializeJson(jsonBuffer, jsonFile)!= DeserializationError::Ok){
			ret = false;
		}
	}



	//Storage attributes are updated based on parsed JSON
	//SDCardStorage:: storage enable
	if (ret) {
		bool en = jsonBuffer["sdcard_en"];
		//logi("sdcard_en  ",en );
		if (en) {
			uptime_sensor_node_comm_hardware_policy.sdcard_en = SDCardStorage::selector::ENABLE;
		}
		else {
			uptime_sensor_node_comm_hardware_policy.sdcard_en = SDCardStorage::selector::DISABLE;
		}
	}

	//SDCardStorage : peripheral communication interface
	if(ret){
		string peripheral_comm_interface = jsonBuffer["sdcard_peripheral_comm_interface"];
		//logi("sdcard_peripheral_comm_interface  ",peripheral_comm_interface );
		if(!peripheral_comm_interface.empty()){
			if(peripheral_comm_interface=="i2c_0")
				uptime_sensor_node_comm_hardware_policy.sdcard_interface=comm_hardware::sensor_comm_interface::I2C_0;
			else if(peripheral_comm_interface=="i2c_1")
				uptime_sensor_node_comm_hardware_policy.sdcard_interface=comm_hardware::sensor_comm_interface::I2C_1;
			else if(peripheral_comm_interface=="uart_0")
				uptime_sensor_node_comm_hardware_policy.sdcard_interface=comm_hardware::sensor_comm_interface::UART_0;
			else if(peripheral_comm_interface=="uart_1")
				uptime_sensor_node_comm_hardware_policy.sdcard_interface=comm_hardware::sensor_comm_interface::UART_1;
			else if(peripheral_comm_interface=="uart_2")
				uptime_sensor_node_comm_hardware_policy.sdcard_interface=comm_hardware::sensor_comm_interface::UART_2;
			else if(peripheral_comm_interface=="ls_spi")
				uptime_sensor_node_comm_hardware_policy.sdcard_interface=comm_hardware::sensor_comm_interface::LS_SPI;
			else if(peripheral_comm_interface=="hs_spi")
				uptime_sensor_node_comm_hardware_policy.sdcard_interface=comm_hardware::sensor_comm_interface::HS_SPI;

		}

	}

	if(ret==false){
		logi(CONFIG_MANAGER_CALLBACK_TAG,"Failed to update Storage configuration");
	}else{
		logi(CONFIG_MANAGER_CALLBACK_TAG,"Storage configuration complete ");
	}

	return ret;

}




