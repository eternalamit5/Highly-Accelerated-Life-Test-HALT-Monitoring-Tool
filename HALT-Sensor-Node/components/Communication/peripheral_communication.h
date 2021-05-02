/*
 * peripheral_communication.h
 *
 *  Created on: Mar 5, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_COMMUNICATION_PERIPHERAL_COMMUNICATION_H_
#define COMPONENTS_COMMUNICATION_PERIPHERAL_COMMUNICATION_H_

#include "commons.h"
#include "../components/Communication/LPG_WIFI/App/wifi_t.h"
#include "../arduino-esp32/cores/esp32/Arduino.h"
#include "../components/Communication/LPG_MQTT/App/lpg_mqtt.h"
#include "../components/arduino-esp32/libraries/Wire/src/Wire.h"
#include "../components/arduino-esp32/libraries/SPI/src/SPI.h"
#include "../components/ErrorHandler/errorHandler.h"
#include "../components/ErrorHandler/ErrorLED/App/errorLEDApp.h"


class comm_hardware{
public:

	typedef enum{
		DISABLE=0,
		ENABLE=1
	}selector;

	typedef enum{
		I2C_0=0,
		I2C_1,
		HS_SPI,
		LS_SPI,
		UART_0,
		UART_1,
		UART_2,
		IND_LED
	}sensor_comm_interface;

	typedef struct{
		selector uart0_en;
		int8_t uart0_txpin;
		int8_t uart0_rxpin;
		uint32_t uart0_config;
		unsigned long uart0_baud;

		selector uart1_en;
		int8_t uart1_txpin;
		int8_t uart1_rxpin;
		uint32_t uart1_config;
		unsigned long uart1_baud;

		selector uart2_en;
		int8_t uart2_txpin;
		int8_t uart2_rxpin;
		uint32_t uart2_config;
		unsigned long uart2_baud;

		selector i2c0_en;
		int i2c0_sda;
		int i2c0_scl;
		uint32_t i2c0_frequency;

		selector i2c1_en;
		int i2c1_sda;
		int i2c1_scl;
		uint32_t i2c1_frequency;

		selector HSSPI_en;
		int8_t HSSPI_sck;
		int8_t HSSPI_miso;
		int8_t HSSPI_mosi;
		int8_t HSSPI_ss;

		selector LSSPI_en;
		int8_t LSSPI_sck;
		int8_t LSSPI_miso;
		int8_t LSSPI_mosi;
		int8_t LSSPI_ss;

		selector wifi_en;
		bool wifi_enable_smartConnect;
		string wifi_ssid;
		string wifi_password;
		uint8_t wifi_reconnAttempt;
		wifi_t::wifiDisconnectionUserAppCb_t wifi_disconnectionUsercb;
		wifi_t::wifiConnectionUserAppCb_t wifi_connectionUsercb;

		bool sdcard_en;
		comm_hardware::sensor_comm_interface sdcard_interface;

		selector indicator_en;
		uint8_t indicator_pin;
	}usage_policy;

public:
	HardwareSerial* uart0;
	SemaphoreHandle_t uart0_AccessSem;
	HardwareSerial* uart1;
	SemaphoreHandle_t uart1_AccessSem;
	HardwareSerial* uart2;
	SemaphoreHandle_t uart2_AccessSem;
	TwoWire* i2c0;
	SemaphoreHandle_t i2c0_AccessSem;
	TwoWire* i2c1;
	SemaphoreHandle_t i2c1_AccessSem;
	SPIClass* HSSPI;
	SemaphoreHandle_t hsspi_AccessSem;
	SPIClass* LSSPI;
	SemaphoreHandle_t lsspi_AccessSem;
	wifi_t* wifi;
	errorIndicatorApp* indicator;
	SemaphoreHandle_t ind_AccessSem;

private:
	static comm_hardware* instance;
	usage_policy* policy;
	comm_hardware(usage_policy& policy);

public:
	usage_policy* getPolicy();
	static comm_hardware* getInstance();
	static comm_hardware* startService(usage_policy& policy);
	static bool lockSensorCommResource(sensor_comm_interface);
	static bool unlockSensorCommResource(sensor_comm_interface);
	~comm_hardware();
};



#endif /* COMPONENTS_COMMUNICATION_PERIPHERAL_COMMUNICATION_H_ */
