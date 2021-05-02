
/*
 * peripheral_communication.cpp
 *
 *  Created on: Mar 5, 2020
 *      Author: karsh
 */
#include "peripheral_communication.h"
#include "../components/uptimeApp/policies.h"

comm_hardware* comm_hardware::instance=NULL;

comm_hardware::comm_hardware(usage_policy& usagePolicy):
		uart0_AccessSem(NULL),uart1_AccessSem(NULL),uart2_AccessSem(NULL),
		i2c0_AccessSem(NULL),i2c1_AccessSem(NULL),hsspi_AccessSem(NULL),lsspi_AccessSem(NULL),
		ind_AccessSem(NULL),policy(&usagePolicy){

	if(usagePolicy.uart0_en==comm_hardware::selector::ENABLE){
		uart0=&Serial;
		uart0->begin(usagePolicy.uart0_baud,usagePolicy.uart0_config,usagePolicy.uart0_rxpin,usagePolicy.uart0_txpin);
		uart0_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( uart0_AccessSem );
	}

	if(usagePolicy.uart1_en==comm_hardware::selector::ENABLE){
		uart1=&Serial;
		uart1->begin(usagePolicy.uart1_baud,usagePolicy.uart1_config,usagePolicy.uart1_rxpin,usagePolicy.uart1_txpin);
		uart1_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( uart1_AccessSem );
	}

	if(usagePolicy.uart2_en==comm_hardware::selector::ENABLE){
		uart2=&Serial;
		uart2->begin(usagePolicy.uart2_baud,usagePolicy.uart2_config,usagePolicy.uart2_rxpin,usagePolicy.uart2_txpin);
		uart2_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( uart2_AccessSem );
	}

	if(usagePolicy.i2c0_en==comm_hardware::selector::ENABLE){
		i2c0=&Wire;
		i2c0->begin(usagePolicy.i2c0_sda,usagePolicy.i2c0_scl,usagePolicy.i2c0_frequency);
		i2c0_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( i2c0_AccessSem );
	}

	if(usagePolicy.i2c1_en==comm_hardware::selector::ENABLE){
		i2c1=&Wire;
		i2c1->begin(usagePolicy.i2c1_sda,usagePolicy.i2c1_scl,usagePolicy.i2c1_frequency);
		i2c1_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( i2c1_AccessSem );
	}

	if(usagePolicy.HSSPI_en==comm_hardware::selector::ENABLE && usagePolicy.sdcard_interface !=comm_hardware::sensor_comm_interface::HS_SPI){
		HSSPI=&SPI;
		HSSPI->begin(usagePolicy.HSSPI_sck,usagePolicy.HSSPI_miso,usagePolicy.HSSPI_mosi,usagePolicy.HSSPI_ss);
		hsspi_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( hsspi_AccessSem );
	}

	if(usagePolicy.LSSPI_en==comm_hardware::selector::ENABLE && usagePolicy.sdcard_interface !=comm_hardware::sensor_comm_interface::LS_SPI){
		LSSPI=&slowSPI;
		LSSPI->begin(usagePolicy.LSSPI_sck,usagePolicy.LSSPI_miso,usagePolicy.LSSPI_mosi,usagePolicy.LSSPI_ss);
		lsspi_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( lsspi_AccessSem );
	}

	if(usagePolicy.wifi_en==comm_hardware::selector::ENABLE){
		wifi_t::registerDisconnectionCb(usagePolicy.wifi_disconnectionUsercb);
		wifi_t::registerConnectionCb(usagePolicy.wifi_connectionUsercb);
		logi("startServiceBlockingCall: ssid",usagePolicy.wifi_ssid);
		logi("startServiceBlockingCall: password",usagePolicy.wifi_password);
		wifi = wifi_t::startServiceBlockingCall(usagePolicy.wifi_enable_smartConnect,usagePolicy.wifi_reconnAttempt,usagePolicy.wifi_ssid,usagePolicy.wifi_password);
		if(wifi == NULL){
			throw EMU_ERR_NULL;
		}
	}

	if(usagePolicy.indicator_en==comm_hardware::selector::ENABLE){
		indicator = errorIndicatorApp::startService(27);
		ind_AccessSem = xSemaphoreCreateBinary();
		xSemaphoreGive( ind_AccessSem );
	}
}

comm_hardware* comm_hardware::startService(usage_policy& policy) {
	if(comm_hardware::instance==NULL){
		comm_hardware::instance=new comm_hardware(policy);
	}
	return comm_hardware::instance;
}

comm_hardware* comm_hardware::getInstance() {
	return comm_hardware::instance;
}

comm_hardware::~comm_hardware() {
	if(comm_hardware::instance!=NULL){
		delete comm_hardware::instance;
	}
}

bool comm_hardware::lockSensorCommResource(sensor_comm_interface interface) {
	bool ret=false;

	comm_hardware* comm = comm_hardware::getInstance();
	if(comm==NULL){
		return false;
	}

	switch(interface){
		case comm_hardware::I2C_0:
			if(xSemaphoreTake( comm->i2c0_AccessSem, portMAX_DELAY) == pdTRUE){
				ret=true;
			}
		break;

		case comm_hardware::I2C_1:
		if(xSemaphoreTake( comm->i2c1_AccessSem, portMAX_DELAY) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::UART_0:
		if(xSemaphoreTake( comm->uart0_AccessSem, portMAX_DELAY) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::UART_1:
		if(xSemaphoreTake( comm->uart1_AccessSem, portMAX_DELAY) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::UART_2:
		if(xSemaphoreTake( comm->uart2_AccessSem, portMAX_DELAY) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::HS_SPI:
		if(xSemaphoreTake( comm->hsspi_AccessSem, portMAX_DELAY) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::LS_SPI:
		if(xSemaphoreTake( comm->lsspi_AccessSem, portMAX_DELAY) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::IND_LED:
		if(xSemaphoreTake( comm->ind_AccessSem, portMAX_DELAY) == pdTRUE){
			ret=true;
		}
		break;
	}

	return ret;
}

bool comm_hardware::unlockSensorCommResource(sensor_comm_interface interface) {
	bool ret=false;

	comm_hardware* comm = comm_hardware::getInstance();
	if(comm==NULL){
		return false;
	}

	switch(interface){
		case comm_hardware::I2C_0:
			if(xSemaphoreGive( comm->i2c0_AccessSem) == pdTRUE){
				ret=true;
			}
		break;

		case comm_hardware::I2C_1:
		if(xSemaphoreGive( comm->i2c1_AccessSem) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::UART_0:
		if(xSemaphoreGive( comm->uart0_AccessSem) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::UART_1:
		if(xSemaphoreGive( comm->uart1_AccessSem) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::UART_2:
		if(xSemaphoreGive( comm->uart2_AccessSem) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::HS_SPI:
		if(xSemaphoreTake( comm->hsspi_AccessSem, 0) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::LS_SPI:
		if(xSemaphoreGive( comm->lsspi_AccessSem) == pdTRUE){
			ret=true;
		}
		break;

		case comm_hardware::IND_LED:
		if(xSemaphoreGive( comm->ind_AccessSem) == pdTRUE){
			ret=true;
		}
		break;
	}

	return ret;
}

comm_hardware::usage_policy* comm_hardware::getPolicy() {
	return policy;
}
