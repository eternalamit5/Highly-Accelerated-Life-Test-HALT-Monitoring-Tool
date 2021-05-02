/*
 * uptimeApp.cpp
 *
 *  Created on: Jan 31, 2020
 *      Author: karsh
 */
#include "commons.h"
#include "../components/Communication/protocol.h"
#include "../components/Sensors/BMI160/App/BMI160App.h"
#include "../components/Sensors/BME280/App/BME280App.h"
#include "../components/Sensors/GPS/App/GPSApp.h"
#include "../components/uptimeApp/policies.h"
#include "../components/Storage/SDcard/App/storage.h"
#include "../components/Communication/BLE/App/UARTProfile/BLEMultiByteUART/Client.h"
#include "../components/Communication/BLE/App/UARTProfile/BLEMultiByteUART/Server.h"
#include "../components/ErrorHandler/ErrorLED/App/errorLEDApp.h"
#include "../../components/uptimeApp/configurationManager.h"
#include "../Sensors/BMI160/Test/BMI160Test.h"
#include "../Sensors/BME280/Test/BME280Test.h"
#include "../Sensors/GPS/Test/GPSAppTest.h"
#include "../components/uptimeApp/timestampGenerator.h"


#define GPS_TASK_ENABLE
#define IMU_TASK_ENABLE
#define MOTOR_CNTRL_ENABLE


/*
 * Note Matilda MQTT end point: 134.102.96.205:1883
 */
static char UPT_GATEWAY_TAG[]={"UptimeGateway:"};
esp_err_t mqttReceiveDataHandler(esp_mqtt_event_handle_t event);


void firstBootUp(){
	SDCardStorage::startService(uptime_sensor_node_comm_hardware_policy);
	comm_hardware::startService(uptime_sensor_node_comm_hardware_policy);
	if(configManager::downloadConfiguration(webServer.url,devProperties.deviceUUID)==false){
		cout<<"Error occurred in download"<<endl;
	}
	configManager::updateSystemConfigurationFromStorageMedia();
	configManager::updateProtocolConfigurationFromStorageMedia();
	configManager::updateSensorConfigurationFromStorageMedia();
	configManager::updateStorageConfigurationFromStorageMedia();
}

void normalBootUp(){
	//Start SD card service
	SDCardStorage::startService(uptime_sensor_node_comm_hardware_policy);

	//Read configuration files from storage Media
	configManager::updateSystemConfigurationFromStorageMedia();
	configManager::updateProtocolConfigurationFromStorageMedia();
	configManager::updateSensorConfigurationFromStorageMedia();
	configManager::updateStorageConfigurationFromStorageMedia();

	comm_hardware::startService(uptime_sensor_node_comm_hardware_policy);
	timeKeeper::startService("de.pool.ntp.org");
	if(configManager::downloadConfiguration(webServer.url,devProperties.deviceUUID)==false){
		cout<<"Error occurred in download"<<endl;
	}

	comm_protocol::startService(protocol_usage_policy1);

//	timeKeeper::getInstance()->getEpochTime_NanoSec();
//	logi("Timestamp:",timeKeeper::getInstance()->timeToString());

	// Start sensor tasks
	//xTaskCreate(envSensingTask,"Env sensing task",10000,NULL,1,NULL);
	xTaskCreate(motionSensingTask,"Motion sensing task",20000,NULL,1,NULL);
	//xTaskCreate(locSensingTask,"Location sensing task",20000,NULL,1,NULL);
}
void uptimeTest(void*arg)
{
	//firstBootUp();
	normalBootUp();
	vTaskDelete(NULL);
}

//void uptimeTest(void*arg){
	//comm_hardware::startService(board_sensor_node_comm_hardware_policy);
	//comm_hardware::startService(uptime_sensor_node_comm_hardware_policy);
//	delay(1000);
//	comm_protocol::startService(uptime_comm_protocol_usage_policy);
//
//	BMI160App* sen1 = new BMI160App(uptimeBMI160Policy);
//	sen1->registerTimerCB((SensorBase::sensor_loop_cb_t)BMI160Telemetry_MQTT);
//	float BMI160samplerate=10;
//	BMI160App::measurement_t sampleData;
//
//	BME280App* sen2 = new BME280App(uptimeBME280Policy);
//	sen2->registerTimerCB((SensorBase::sensor_loop_cb_t)BME280Telemetry_MQTT);
//	float BME280samplerate=10;
//
//	unsigned int samples=500;
//	sen1->processor(BMI160App::CALIBRATE,BMI160App::LINEAR_REGRESSION,&samples,sizeof(unsigned int));
//
//
//	GPSApp* sen3 = new GPSApp(uptimeGPSPolicy);
//	sen3->registerTimerCB((SensorBase::sensor_loop_cb_t)BME280Telemetry_MQTT);
//	float GPSsamplerate=10;
//
//	sen1->processor(BMI160App::START,NO_SUB_CMD,&BMI160samplerate,sizeof(float));
//	sen2->processor(BME280App::START,NO_SUB_CMD,&BME280samplerate,sizeof(float));
//	sen3->processor(GPSApp::START,NO_SUB_CMD,&GPSsamplerate,sizeof(float));
//
//	sen3->processor(GPSApp::START);


//	sen1->processor(BMI160App::STOP);
//	sen2->processor(BME280App::STOP);
//	sen3->processor(GPSApp::STOP);

//	NVSApp nvsConfigStorage("config");
//	string recvData;
//	if(nvsConfigStorage.storeData("dummy",string("blablabla"))==false){
//		cout<<"Fail to store: ";
//	}
//	if(nvsConfigStorage.getData("dummy",recvData)==false){
//		cout<<"Fail to get: ";
//	}
//	cout<<"recvData: "<<recvData<<endl;

// 	string SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb";
//	string CHARACTERISTIC_UUID_RX = "0000fff1-0000-1000-8000-00805f9b34fb";//"6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
//	string CHARACTERISTIC_UUID_TX = "0000fff2-0000-1000-8000-00805f9b34fb";//"6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
//	string readData;
//
//	//Instantiate
//	BLEServerBase server("UP");
//
//	//Add service-characteristic
//	server.addService(SERVICE_UUID);
//	server.addCharacteristic(SERVICE_UUID,CHARACTERISTIC_UUID_TX,BLEServerBase::access_t::NOTIFY);
//	server.addCharacteristic(SERVICE_UUID,CHARACTERISTIC_UUID_RX,BLEServerBase::access_t::WRITE_ONLY);
//
//	//Start service
//	server.startService(SERVICE_UUID);
//
//	//Advertise
//	server.startAdvertisement(SERVICE_UUID);
//	auto count = 0;
//
//	BLEServerMultiByteUART server(ble_server_uart_policy);
//	while(1){
//		//server.writeValueInCharacteristic(SERVICE_UUID,CHARACTERISTIC_UUID_TX,"HI"+to_string(count++));
//		delay(10);
//	}
//
////	BLEClientMultiByteUART client(ble_client_uart_policy);
////	BLEClientMultiByteUART client2(ble_client_uart_policy);
//	while(1){
//		delay(100);
//	}
//}
//
//
//
//void uptimeGatewayTask(void* arg){
//
//	try{
//		/*Initialize Serial UART communication
//			Tx: GPIO 1
//			Rx: GPIO 3
//			Baud rate: 115200
//		*/
//		Serial.begin(115200);
//
//
//		/*Initialize I2C communication
//			SDA: GPIO 23
//			SCL: GPIO 22
//			Clock: 400*1000 Hz
//
//			Wire.begin(23,22,400*1000);
//			Wire.begin();
//			Wire.begin(33,32,400*1000);
//		*/
//		Wire.begin(23,22,50*1000);
//
//		//Start smart-connect
//		wifi_t* wifi=wifi_t::startService(true);
//		if(wifi==NULL){
//			throw EMU_ERR_NULL;
//		}
//
//		while(wifi_t::getSmartConnectStatus()==wifi_t::smartConnectStatus_e::STOP_SCAN){
//			vTaskDelay(1000);
//			printf("{uptimeGateway} Waiting for wifi setup. Use {espSmartConnect} App on phone! \n");
//		}
//
//
//		printf("{uptimeGateway} Running application tasks\n");
//
//		//Start Mqtt
//		logi(UPT_GATEWAY_TAG,"{uptimeGateway} Start MQTT !!!");
//		mqttClient_t::startService(mqtt_client_policy1);
//		mqttClient_t* mqttClient=mqttClient_t::getInstance();
//		if(mqttClient==NULL){
//			throw EMU_ERR_OUT_OF_MEMORY;
//		}
//
//		//wait for mqtt broker to accept the connection
//		while(mqttClient->getConnectionStatus()==mqttClient_t::MQTT_DISCONNECTED){
//			logi(UPT_GATEWAY_TAG,"{uptimeGateway} Connecting to MQTT !!!");
//			vTaskDelay(1000);
//		}
//
//
//		logi(UPT_GATEWAY_TAG,"{uptimeGateway} Start Sensor Tasks !!!");
//		delay(5000);
//
//		//start BMI160 task
//	#ifdef IMU_TASK_ENABLE
//		//BMI160_Task_CMD_Processor(BMI160_TASK_START);
//	#endif
//
//	#ifdef GPS_TASK_ENABLE
//		//Start GPS task
//		//GPS_Task_CMD_Processor(GPS_TASK_START);
//	#endif
//
//#ifdef MOTOR_CNTRL_ENABLE
//		mqttClient->subscribe("incontrol/motorcontrol");
//#endif
//
//
//		while(1){
//			if(wifi->getConnectionStatus()==wifi_t::wifiConnectStatus_e::CONNECTED){
//				//Here uptime application handles MQTT disconnection
//				if(mqttClient->getConnectionStatus()==mqttClient_t::MQTT_DISCONNECTED){
//
//					logi(UPT_GATEWAY_TAG,"{uptimeGateway} Mqtt Connection lost, reconnecting !!!");
//				}else{/*All of MQTT connected*/}
//			}
//			else{
//
//				if(wifi->getReconnectAttempt()<=0){
//					logi(UPT_GATEWAY_TAG,"{uptimeGateway} wifi reconnection attempt exhausted, trying disconnect then connect again !!!");
//					if(wifi->disconnect()==EMU_SUCCESS){
//						vTaskDelay(1000);// timeout for wifi disconnection at radio level
//						logi(UPT_GATEWAY_TAG,"{uptimeGateway} wifi disconnect !!!");
//						if(wifi->reconnect()==EMU_SUCCESS){
//							vTaskDelay(1000);// timeout for wifi reconnection at radio level
//							logi(UPT_GATEWAY_TAG,"{uptimeGateway} wifi reconnection attempted !!!");
//						}else{loge(UPT_GATEWAY_TAG,"{uptimeGateway} wifi failed to disconnect");}
//					}else{loge(UPT_GATEWAY_TAG,"{uptimeGateway} wifi failed to reconnect");}
//				}
//			}
//
//			vTaskDelay(1000);//uptime loop delay
//		}
//	}
//	catch(exception& err){
//		logw(UPT_GATEWAY_TAG,"{uptimeGateway}, Exception: "<<err.what());
//	}
//	catch(emu_err_t& err){
//		logw(UPT_GATEWAY_TAG,"{uptimeGateway}, Exception: ");
//	}
//
//	vTaskDelete(NULL);
//
//}
//
//bool is_number(const std::string& s)
//{
//    return( strspn( s.c_str(), "-.0123456789" ) == s.size() );
//}
//






//esp_err_t mqttReceiveDataHandler(esp_mqtt_event_handle_t event){
//	logi(UPT_GATEWAY_TAG, "{mqttReceiveDataHandler}, This is AppEventCB");
//	string recvTopic = string(event->topic,event->topic_len); // @suppress("Field cannot be resolved") // @suppress("Symbol is not resolved")
//	string recvData = string(event->data,event->data_len); // @suppress("Field cannot be resolved") // @suppress("Symbol is not resolved")
//
//	logi(UPT_GATEWAY_TAG, "{mqttReceiveDataHandler}, recvTopic="<<recvTopic.c_str());
//	logi(UPT_GATEWAY_TAG, "{mqttReceiveDataHandler}, recvData="<<recvData.c_str());
//
//	if(recvTopic==string("incontrol/motorcontrol")){
//		//check if string is a floating or number
//		if(strspn( recvData.c_str(), "-.0123456789" ) == recvData.size()){
//			int val = int(float(stof(recvData)));
//			if(val>=0 && val<=100){
//				logw(UPT_GATEWAY_TAG, "{mqttReceiveDataHandler}, recvData = "<<val);
//				//float conversion= -1.2*val+180;
//				//motorControlProcessor((int)conversion);
//			}
//		}
//		else{
//			logw(UPT_GATEWAY_TAG, "{mqttReceiveDataHandler}, recvData is not number");
//		}
//	}
//
//	return ESP_OK;
//}


