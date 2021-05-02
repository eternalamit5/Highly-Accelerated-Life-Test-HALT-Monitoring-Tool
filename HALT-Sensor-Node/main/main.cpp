#include "nvs_flash.h"
#include "commons.h"


#define TEST 1

#if TEST
#include "../components/Communication/protocol.h"
#include "../components/Communication/peripheral_communication.h"
#include "../components/uptimeApp/policies.h"
#include "../Sensors/BMI160/Test/BMI160Test.h"
#include "../UtilityTools/i2cScanner/i2cScanner.h"
#include "../components/Communication/LPG_WIFI/Test/wifiTest.h"
#include "../components/Communication/LPG_MQTT/Test/mqttTest.h"
#include "../components/Communication/BLE/App/UARTProfile/Test/BLEMutiByteUARTTest.h"
#include "../components/Communication/LTE/Test/LTEApp.h"
#include "../components/Sensors/BME280/Test/BME280Test.h"
#include "../components/Storage/NVS/Test/NVSTest.h"
#include "../components/Storage/SDcard/Test/sdcardTest.h"
#include "../components/Communication/httpClient/httpClientTest.h"
#include "../components/uptimeApp/Test/configurationManagerTest.h"
#endif


extern "C"{
	void app_main(void)
	{
		//Initialize NVS
//		esp_err_t ret = nvs_flash_init();
//		if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
//		  ESP_ERROR_CHECK(nvs_flash_erase());
//		  ret = nvs_flash_init();
//		}
//		ESP_ERROR_CHECK(ret);

		/*
		 * Initialize Arduino
		 */
		initArduino();


		/*Initialize Serial UART communication
			Tx: GPIO 1
			Rx: GPIO 3
			Baud rate: 115200
		*/
		Serial.begin(115200);

#if TEST
		/*Initialize I2C communication
			SDA: GPIO 23
			SCL: GPIO 22
			Clock: 400*1000 Hz
		 */
		//Wire.begin(33,32,50*1000);

		//comm_hardware::startService(uptime_sensor_node_comm_hardware_policy);
		//comm_protocol::startService(uptime_comm_protocol_usage_policy);

		//Wire.begin(33,32,400*1000);
		//xTaskCreate(wifiTest,"wifi test",10000,NULL,1,NULL);
		//xTaskCreate(mqttTest,"mqtt test",10000,NULL,1,NULL);
		//xTaskCreate(bleClientTask,"ble client test",10000,NULL,1,NULL);
		//xTaskCreate(bleServerTask,"ble server test",10000,NULL,1,NULL);
		//xTaskCreate(LTERegisterTask,"LTE test",10000,NULL,1,NULL);
		//xTaskCreate(envSensingTask,"Env sensing task",10000,NULL,1,NULL);
		//xTaskCreate(motionSensingTask,"Motion sensing task",20000,NULL,1,NULL);
		//xTaskCreate(NVSTestTask,"NVS task",20000,NULL,1,NULL);
		//xTaskCreate(sdcardTest_StandAloneTask,"SDCard test task",20000,NULL,1,NULL);
		//xTaskCreate(httpClientTask,"http client test",10000,NULL,1,NULL);
		xTaskCreate(configManagerTestTask,"config Man test",10000,NULL,1,NULL);
#else
		Wire.begin(23,22,400*1000);
		I2CScanner(33,32,400*1000);
#endif


		//--------Board start---------------------


		//--------Board end ---------------------


		//xTaskCreate(matidaTask,"matildaTestTask",20000,NULL,1,NULL);

	}
}
