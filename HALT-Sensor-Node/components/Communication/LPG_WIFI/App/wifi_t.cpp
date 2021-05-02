/*
 * lpg_wifi.cpp
 *
 *  Created on: Nov 25, 2019
 *      Author: karsh
 */

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "nvs_flash.h"
#include "tcpip_adapter.h"
#include "esp_event_base.h"
#include "esp_err.h"
#include "stdbool.h"
#include "sdkconfig.h"
#include <string.h>
#include <wifi_t.h>
#include "lwip/err.h"
#include "lwip/sys.h"
#include "lwip/ip_addr.h"
#include "esp_smartconfig.h"
#include "commons.h"

extern "C"{
//extern EventGroupHandle_t s_wifi_event_group;
bool wifi_init_sta();
char * convertIPToString(ip_event_got_ip_t* event);
void wifi_event_handler(void* arg, esp_event_base_t event_base,
		int32_t event_id, void* event_data);
}


static char LPG_WIFI_TAG[]={"LPG_WIFI "}; // @suppress("Unused variable declaration in file scope")
static const int CONNECTED_BIT = BIT0;
static const int ESPTOUCH_DONE_BIT = BIT1;
static bool stopSmartConnect= false;

wifi_t* wifi_t::instance=NULL;
wifi_t::smartConnectStatus_e wifi_t::smart_wifi_connectionStatus=wifi_t::smartConnectStatus_e::DEACTIVATED;
wifi_t::wifiDisconnectionUserAppCb_t wifi_t::disconnectionUserAppcb=NULL;
wifi_t::wifiConnectionUserAppCb_t wifi_t::connectionUserAppcb=NULL;

const int WIFI_CONNECTED_BIT = BIT0;

extern "C" {extern EventGroupHandle_t s_wifi_event_group;}


/* @description smart WIFI task function
 * 				Using this feature user can connect set the SSID and password of the esp32 device using
 * 				mobile application esp32 connect app at android play stores.
 * @param parm smart wifi connect configuration parameter
 * @return NA
 *
 */
static void smartWIFITask(void * parm)
{
	//local event variable
	EventBits_t uxBits;

	//Set smart WIFI default configuration
	ESP_ERROR_CHECK( esp_smartconfig_set_type(SC_TYPE_ESPTOUCH) ); // @suppress("Invalid arguments")
	smartconfig_start_config_t cfg = SMARTCONFIG_START_CONFIG_DEFAULT(); // @suppress("Function cannot be resolved") // @suppress("Type cannot be resolved")

	//apply configuration to smart wifi
	ESP_ERROR_CHECK( esp_smartconfig_start(&cfg) ); // @suppress("Invalid arguments")

	//check if smart wifi connect feature is to be stopped by other tasks
	while (stopSmartConnect==false) {

		//check for wifi is connected and esp done bit events
		wifi_t::smart_wifi_connectionStatus=wifi_t::smartConnectStatus_e::SCANNING;
		uxBits = xEventGroupWaitBits(s_wifi_event_group, CONNECTED_BIT | ESPTOUCH_DONE_BIT, true, false, portMAX_DELAY);

		//on connect event
		if(uxBits & CONNECTED_BIT) {
			logi(LPG_WIFI_TAG,"Phone connected to esp32, you can now configure wifi SSID and password from phone");
		}

		//stop on esp done bit event
		if(uxBits & ESPTOUCH_DONE_BIT) {
			logi(LPG_WIFI_TAG,"smart wifi connect task completed");
			esp_smartconfig_stop();
			wifi_t::smart_wifi_connectionStatus=wifi_t::smartConnectStatus_e::STOP_SCAN;
			vTaskDelete(NULL);
		}
	}
	stopSmartConnect=false;
	esp_smartconfig_stop();
	wifi_t::smart_wifi_connectionStatus=wifi_t::smartConnectStatus_e::DEACTIVATED;
	vTaskDelete(NULL);
}



/**
 * @brief constructor
 * @details Inits the wifi attributes
 * 			Wifi connection is described by following attributes
 * 			#ssid: ssid of the access point
 * 			#password: password of the access point
 * 			#ip address: IP address recieved from the access point
 * 			#reconnectAttempt: Number of attempts to connect the access point
 * 			#connection status: connection status
 *
 *
 *
 * @see
 *
 */
wifi_t::wifi_t(bool enableSmartConnect,uint8_t reconnectAttempt,string ssid,string pwd):ssid(ssid),password(pwd),ip(""),
		reconnectAttempt(reconnectAttempt),
		maxReconnectAttempt(reconnectAttempt),
		connectionStatus(DISCONNECTED),enableSmartConnect(enableSmartConnect),tryReconnect(false){

}



/* @description destructor
 * @param NA
 * @return NA
 */
wifi_t::~wifi_t() {

	//Task 1: Disconnect the WIFI connection
	if(disconnect()==EMU_FAILURE){
		logw(LPG_WIFI_TAG,"Failed to disconnect, Force termination");
	}

	//Task 2: delete the instance
	delete this->instance;
}



/* @description Starts Wifi service
 * @param enableSmartConnect if true enable smart connect feature, if false disables it.
 * @param ssid ssid of the router we wish to connect
 * @param pwd password of the router we wish to connect
 * @return instance object of lpg_wifi class
 */
wifi_t* wifi_t::startService(bool enableSmartConnect,uint8_t reconnectAttempt,string ssid,string pwd) {

	//Task 1: Check instance already exists
	if(wifi_t::instance==NULL){

		//Task 2: Create new instance
		wifi_t::instance=new wifi_t(enableSmartConnect,reconnectAttempt,ssid,pwd);
		if(wifi_t::instance==NULL){
			return NULL;
		}

		wifi_t::instance->tryReconnect = true;
		wifi_t::instance->reconnectAttempt = wifi_t::instance->maxReconnectAttempt;

	    //Task 3: Wifi Init
		wifi_init_sta();
	}
	else{
		if(wifi_t::instance->reconnect()!=EMU_SUCCESS){
			loge(LPG_WIFI_TAG,"reconnection failed");
			return NULL;
		}
	}


	return wifi_t::instance;
}


wifi_t* wifi_t::startServiceBlockingCall(bool enableSmartConnect,uint8_t reconnectAttempt,string ssid,string pwd,uint32_t timeoutsec) {

	//Task 1: Check instance already exists
	if(wifi_t::instance==NULL){

		//Task 2: Create new instance
		wifi_t::instance=new wifi_t(enableSmartConnect,reconnectAttempt,ssid,pwd);
		if(wifi_t::instance==NULL){
			return NULL;
		}

		wifi_t::instance->tryReconnect = true;
		wifi_t::instance->reconnectAttempt = wifi_t::instance->maxReconnectAttempt;

	    //Task 3: Wifi Init
		wifi_init_sta();

	}
	else{
		if(wifi_t::instance->reconnect()!=EMU_SUCCESS){
			loge(LPG_WIFI_TAG,"reconnection failed");
			return NULL;
		}
	}

	while((wifi_t::instance->getWifiConnectionStatus()==wifi_t::wifiConnectStatus_e::DISCONNECTED) && (timeoutsec>0)){
		logi(LPG_WIFI_TAG,"Waiting for connection");
		vTaskDelay(1000);
		timeoutsec -=1;
	}

	if(wifi_t::instance->getWifiConnectionStatus()==wifi_t::wifiConnectStatus_e::CONNECTED){
		return wifi_t::instance;
	}

	return NULL;

}

bool wifi_t::stopService(){
	if(wifi_t::instance==NULL){
		return false;
	}

	if(wifi_t::instance->disconnect()==EMU_SUCCESS){
		return true;
	}
	return false;

}

bool wifi_t::stopServiceBlockingCall(uint32_t timeoutsec){
	if(wifi_t::instance==NULL){
		return false;
	}

	if(wifi_t::instance->disconnect()==EMU_SUCCESS){
		return true;
	}

	while((wifi_t::instance->getWifiConnectionStatus()==wifi_t::wifiConnectStatus_e::CONNECTED) && (timeoutsec>0)){
		logi(LPG_WIFI_TAG,"Waiting for disconnection");
		vTaskDelay(1000);
		timeoutsec -=1;
	}

	if(wifi_t::instance->getWifiConnectionStatus()==wifi_t::wifiConnectStatus_e::DISCONNECTED){
		return true;
	}

	return false;

}
/* @description gets instance object of lpg_wifi class
 * @param NA
 * @return instance of lpg_wifi class
 *
 */
wifi_t* wifi_t::getInstance(){
	return wifi_t::instance;
}


/* @description disconnect wifi
 * @param NA
 * @return error status
 *
 */
emu_err_t wifi_t::disconnect() {

	emu_err_t ret=EMU_SUCCESS;

	//stop wifi
	if(connectionStatus==CONNECTED){

		tryReconnect=false; //Disable reconnection
		reconnectAttempt = wifi_t::instance->maxReconnectAttempt;

		if(esp_wifi_stop()!=ESP_OK){
			return EMU_FAILURE;
		}
	}

	//Update ret
	logi(LPG_WIFI_TAG,"Wifi disconnected successfully");
	ret=EMU_SUCCESS;

	return ret;

}


/* @description reconnect wifi
 * @param NA
 * @return error status
 *
 */
emu_err_t wifi_t::reconnect() {

	emu_err_t ret=EMU_SUCCESS;

	if(wifi_t::instance==NULL){
		return EMU_ERR_NULL;
	}

	//stop wifi
	if(wifi_t::instance->connectionStatus==DISCONNECTED){
		if(esp_wifi_start()!=ESP_OK){
			return EMU_FAILURE;
		}
	}


	//Update ret
	logi(LPG_WIFI_TAG,"reconnect request sent to router successfully");
	return EMU_SUCCESS;

}


/* @description get wifi connection status
 * @param NA
 * @return wifi connection status
 *
 */
wifi_t::wifiConnectStatus_e wifi_t::getWifiConnectionStatus() {
	return wifi_t::instance->getConnectionStatus();
}


/* @description stops smart wifi connect task
 * @param NA
 * @return true on success, false on failure
 *
 */
bool wifi_t::stopSmartConnectTask(){
	if(wifi_t::getSmartConnectStatus()==wifi_t::smartConnectStatus_e::SCANNING){
		stopSmartConnect=false;
		return true;
	}
	return false;
}


/* @description gets smart wifi connect status
 * @param NA
 * @return smart wifi connect status
 */
wifi_t::smartConnectStatus_e wifi_t::getSmartConnectStatus(){
	return wifi_t::smart_wifi_connectionStatus;
}


/* @description gets wifi connect status
 * @param NA
 * @return wifi connection status
 */
wifi_t::wifiConnectStatus_e wifi_t::getConnectionStatus() {
	return connectionStatus;
}


/* @description sets smart wifi connect status
 * @param smart wifi connection status
 * @return NA
 */
void wifi_t::setConnectionStatus(wifiConnectStatus_e connectionStatus) {
	this->connectionStatus = connectionStatus;
}


/* @description gets IP address
 * @param NA
 * @return IP address in string format
 */
const string& wifi_t::getIp() const {
	return ip;
}


/* @description sets IP address
 * @param ip ip address in string format
 * @return NA
 */
void wifi_t::setIp(const string &ip) {
	this->ip = ip;
}


/* @description gets wifi password
 * @param NA
 * @return wifi password in string format
 */
const string& wifi_t::getPassword() const {
	return password;
}





/* @description Gets wifi SSID
 * @param NA
 * @return ssid in string format
 */
const string& wifi_t::getSsid() const {
	return ssid;
}




/* @description gets number of reconnect attempts
 * @param NA
 * @return number of reconnect attempts
 */
uint8_t wifi_t::getReconnectAttempt() const {
	return reconnectAttempt;
}

/* @description sets wifi password
 * @param password password in string format
 * @return NA
 */
void wifi_t::setPassword(string &password) {
	this->password.assign(password);
}

/* @description sets SSID password
 * @param ssid ssid in string format
 * @return NA
 */
void wifi_t::setSsid(string &ssid) {
	this->ssid.assign(ssid);
}

/* @description check if smart wifi connect is enabled or disabled
 * @param NA
 * @return true on success, false on failure
 */
bool wifi_t::isSmartConnectActive() const {
	return enableSmartConnect;
}

/* @description enable/disables smart wifi connect features
 * @param enableSmartConnect true to enable , false to disable  smart wifi connect feature
 * @return NA
 */
void wifi_t::setSmartConnectActivationStatus(bool enableSmartConnect) {
	this->enableSmartConnect = enableSmartConnect;
}

/* @description sets number of reconnect attempts
 * @param reconnectAttempt number of reconnect attempt
 * @return NA
 */
void wifi_t::setReconnectAttempt(uint8_t reconnectAttempt) {
	this->reconnectAttempt = reconnectAttempt;
}

bool wifi_t::isTryReconnect() const {
	return tryReconnect;
}

/* @description reports error
 * @param err error number
 * @param message error message
 * @return NA
 */
void wifi_t::reportError(emu_err_t err,string message){
	logw(LPG_WIFI_TAG,message<<", Exception Number: "<<to_string(err));
}



extern "C"{
	EventGroupHandle_t s_wifi_event_group;

	/* @description wifi initialization for station
	 * @param NA
	 * @return true on success, false on failure
	 */
	bool wifi_init_sta()
	{
		bool ret=true;

		if(ret){
			//Task 1: Create event group for wifi
			s_wifi_event_group = xEventGroupCreate();

			//Task 2: Init TCPIP adapter
			tcpip_adapter_init();

			//Task 3: create default event loop for wifi
			if(esp_event_loop_create_default()!=ESP_OK){
				ret=false;
				ESP_LOGW(LPG_WIFI_TAG,"{wifi_init_sta}, fail to create event loop, Fail");
			}
		}

		if(ret){
			//Task 4: set init configuration
			wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT(); // @suppress("Invalid arguments")
			if(esp_wifi_init(&cfg)!=ESP_OK){
				ret=false;
				ESP_LOGW(LPG_WIFI_TAG,"{wifi_init_sta}, fail to set config, Fail");
			}
		}

		if(ret){
			//Task 5: Set handler for any Event related to WIFI
			if(esp_event_handler_register(WIFI_EVENT, ESP_EVENT_ANY_ID, wifi_event_handler, NULL)!=ESP_OK){ // @suppress("Invalid arguments") // @suppress("Symbol is not resolved")
				ret=false;
				ESP_LOGW(LPG_WIFI_TAG,"{wifi_init_sta}, fail to set handler for all events, Fail");
			}
		}

		if(ret){
			//Task 6: Set handler for receiving IP
			if(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, wifi_event_handler, NULL)!=ESP_OK){// @suppress("Invalid arguments") // @suppress("Symbol is not resolved")
				ret=false;
				ESP_LOGW(LPG_WIFI_TAG,"{wifi_init_sta}, fail to set handler for IP receive, Fail");
			}
		}

		if(ret){
			//Task 7: Set handler Smart configuration event
			if(esp_event_handler_register(SC_EVENT, ESP_EVENT_ANY_ID, wifi_event_handler, NULL)!=ESP_OK){// @suppress("Invalid arguments") // @suppress("Symbol is not resolved")
				ret=false;
				ESP_LOGW(LPG_WIFI_TAG,"{wifi_init_sta}, fail to set handler for IP receive, Fail");
			}
		}


		if(ret){
			//Task 7: set mode
			if(esp_wifi_set_mode(WIFI_MODE_STA)!=ESP_OK){ // @suppress("Invalid arguments")
				ret=false;
				ESP_LOGW(LPG_WIFI_TAG,"{wifi_init_sta}, fail to set mode wifi-station, Fail");
			}
		}


		if(ret){
			//Task 8:
			esp_wifi_set_mode(WIFI_MODE_STA); // @suppress("Invalid arguments")
		}

	//	if(ret){
	//		//Task 8: set mode configuration
	//		wifi_config_t wifi_config = {
	//			.sta = {
	//				.ssid = CONFIG_ESP_WIFI_SSID,
	//				.password = CONFIG_ESP_WIFI_PASSWORD
	//			},
	//		};
	//		if(esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config)!=ESP_OK){
	//			ret=false;
	//			ESP_LOGW(LPG_WIFI_TAG,"{wifi_init_sta}, fail to set password and ssid, Fail");
	//		}
	//	}

		if(ret){
			//Task 9: wifi start
			if(esp_wifi_start()!=ESP_OK){
				ret=false;
				ESP_LOGW(LPG_WIFI_TAG,"{wifi_init_sta}, fail to start wifi, Fail");
			}
		}

		if(ret)
			return true;
		else
			return false;
	}

	/* @description convert IP to string
	 *
	 */
	char* convertIPToString(ip_event_got_ip_t* event){ // @suppress("Type cannot be resolved")
		return ip4addr_ntoa(&event->ip_info.ip); // @suppress("Field cannot be resolved") // @suppress("Invalid arguments")
	}


	/* @description wifi event handler function, this is a callback function called by wifi submodule on any events
	 * @return NA
	 */
	void wifi_event_handler(void* arg, esp_event_base_t event_base,
									int32_t event_id, void* event_data)
	{

		//get wifi instance
		wifi_t* wifi=wifi_t::getInstance();
		if(wifi==NULL){
			logw(LPG_WIFI_TAG,"lpg_wifi instance cant be NULL");
			return;
		}

		//service the event
		if(event_base == WIFI_EVENT){ // @suppress("Symbol is not resolved")
				switch(event_id){
					case WIFI_EVENT_STA_START: // @suppress("Symbol is not resolved")
							logi(LPG_WIFI_TAG,"starting wifi connection");
							if(wifi->isSmartConnectActive()==true){
								logi(LPG_WIFI_TAG,"smart wifi connect feature enabled, starting smart wifi connect task");
								xTaskCreate(smartWIFITask, "smartconfig_example_task", 4096, NULL, 3, NULL); // @suppress("Function cannot be resolved")
							}
							else{
								wifi_config_t wifi_config;
								//copy configuration
								bzero(&wifi_config, sizeof(wifi_config_t)); // @suppress("Invalid arguments")
								memcpy(wifi_config.sta.ssid, wifi->getSsid().c_str(), wifi->getSsid().length()); // @suppress("Invalid arguments") // @suppress("Field cannot be resolved")
								memcpy(wifi_config.sta.password, wifi->getPassword().c_str(), wifi->getPassword().length()); // @suppress("Invalid arguments") // @suppress("Field cannot be resolved")

								logi(LPG_WIFI_TAG, "{wifi_event_handler},SSID:"<<wifi->getSsid());
								logi(LPG_WIFI_TAG, "{wifi_event_handler},PASSWORD:"<<wifi->getPassword());

								ESP_ERROR_CHECK( esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config) ); // @suppress("Invalid arguments")
								ESP_ERROR_CHECK( esp_wifi_connect() );
							}
							break;
					case WIFI_EVENT_STA_DISCONNECTED: // @suppress("Symbol is not resolved")
							logw(LPG_WIFI_TAG," wifi connection lost");
							wifi->setConnectionStatus(wifi_t::wifiConnectStatus_e::DISCONNECTED);
							wifi->setIp("");//reset IP address
							if(wifi->isTryReconnect()==true){
								if (wifi->getReconnectAttempt()>0) {
									esp_wifi_connect();
									xEventGroupClearBits(s_wifi_event_group, WIFI_CONNECTED_BIT);
									wifi->setReconnectAttempt(wifi->getReconnectAttempt()-1);
									logi(LPG_WIFI_TAG, "checking reconnection logic");
								}else{
									logw(LPG_WIFI_TAG,"All reconnection attempt exhausted");
									if(wifi_t::disconnectionUserAppcb!=NULL){
										wifi_t::disconnectionUserAppcb(wifi);
									}
								}
							}
							break;
					default:
							break;
				}

		}
		else if(event_base == IP_EVENT){ // @suppress("Symbol is not resolved")
				switch(event_id){
					case IP_EVENT_STA_GOT_IP: // @suppress("Symbol is not resolved")
							ip_event_got_ip_t* event = (ip_event_got_ip_t*) event_data; // @suppress("Type cannot be resolved")

							wifi->setConnectionStatus(wifi_t::wifiConnectStatus_e::CONNECTED);
							wifi->setIp(string(convertIPToString(event)));

							logi(LPG_WIFI_TAG, "got ip:"<<wifi->getIp());
							xEventGroupSetBits(s_wifi_event_group, WIFI_CONNECTED_BIT);
							logi(LPG_WIFI_TAG,"wifi connected successfully");
							xEventGroupSetBits(s_wifi_event_group, ESPTOUCH_DONE_BIT);

							if(wifi_t::connectionUserAppcb!=NULL){
								wifi_t::connectionUserAppcb(wifi);
							}
							break;
				}
		}
		else if(event_base == SC_EVENT){ // @suppress("Symbol is not resolved")
				switch(event_id){
					case SC_EVENT_SCAN_DONE: // @suppress("Symbol is not resolved")
					{
						logi(LPG_WIFI_TAG, "wifi Scan completed");
						break;
					}
					case SC_EVENT_FOUND_CHANNEL: // @suppress("Symbol is not resolved")
					{
						logi(LPG_WIFI_TAG, "smart wifi connect, found channel to talk to phone");
						break;
					}
					case SC_EVENT_GOT_SSID_PSWD: // @suppress("Symbol is not resolved")
					{
						logi(LPG_WIFI_TAG, "Got SSID and password");
						smartconfig_event_got_ssid_pswd_t *evt = (smartconfig_event_got_ssid_pswd_t *)event_data; // @suppress("Type cannot be resolved")
						wifi_config_t wifi_config;
						uint8_t ssid[33] = { 0 };
						uint8_t password[65] = { 0 };

						//copy configuration
						bzero(&wifi_config, sizeof(wifi_config_t)); // @suppress("Invalid arguments")
						memcpy(wifi_config.sta.ssid, evt->ssid, sizeof(wifi_config.sta.ssid)); // @suppress("Invalid arguments") // @suppress("Field cannot be resolved")
						memcpy(wifi_config.sta.password, evt->password, sizeof(wifi_config.sta.password)); // @suppress("Invalid arguments") // @suppress("Field cannot be resolved")
						wifi_config.sta.bssid_set = evt->bssid_set; // @suppress("Field cannot be resolved")
						if (wifi_config.sta.bssid_set == true) { // @suppress("Field cannot be resolved")
							memcpy(wifi_config.sta.bssid, evt->bssid, sizeof(wifi_config.sta.bssid)); // @suppress("Field cannot be resolved") // @suppress("Invalid arguments")
						}


						memcpy(ssid, evt->ssid, sizeof(evt->ssid)); // @suppress("Invalid arguments") // @suppress("Field cannot be resolved")
						memcpy(password, evt->password, sizeof(evt->password)); // @suppress("Invalid arguments") // @suppress("Field cannot be resolved")
						logi(LPG_WIFI_TAG, "{wifi_event_handler},SSID:"<< ssid);
						logi(LPG_WIFI_TAG, "{wifi_event_handler},PASSWORD:"<< password);

						//setting ssid and password

						string _password,_ssid;
						_password.assign(password,password+sizeof(password));
						_ssid.assign(ssid,ssid+sizeof(ssid));
						wifi->setPassword(_password);
						wifi->setSsid(_ssid);


						ESP_ERROR_CHECK( esp_wifi_disconnect() );
						ESP_ERROR_CHECK( esp_wifi_set_config(ESP_IF_WIFI_STA, &wifi_config) ); // @suppress("Invalid arguments")
						ESP_ERROR_CHECK( esp_wifi_connect() );
						break;
					}
					case SC_EVENT_SEND_ACK_DONE: // @suppress("Symbol is not resolved")
					{
						logi(LPG_WIFI_TAG, "SC_EVENT_SEND_ACK_DONE");
						break;
					}
				}
			}
	}
}

bool wifi_t::registerDisconnectionCb(wifiDisconnectionUserAppCb_t cb) {
	if(cb==NULL){
		return false;
	}
	wifi_t::disconnectionUserAppcb = cb;
	return true;
}

bool wifi_t::registerConnectionCb(wifiConnectionUserAppCb_t cb) {
	if(cb==NULL){
		return false;
	}
	wifi_t::connectionUserAppcb = cb;
	return true;
}


void wifi_t::deregisterDisconnectionCb() {
	wifi_t::disconnectionUserAppcb = NULL;
}

void wifi_t::deregisterConnectionCb() {
	wifi_t::connectionUserAppcb = NULL;
}
