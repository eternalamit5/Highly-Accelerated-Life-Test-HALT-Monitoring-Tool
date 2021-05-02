/*
 * ledApp.h
 *
 *  Created on: Feb 18, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_UPTIMEAPP_LEDAPP_H_
#define COMPONENTS_UPTIMEAPP_LEDAPP_H_

#include "../Driver/errorLED.h"



class errorIndicatorApp{
public:
	typedef enum{
		RUNNING,
		STOPPED
	}status_t;

	typedef enum{
		IND_OFF=0,
		IND_OK=1,
		IND_ERR=2,
		IND_CALIB=3,
		IND_NET_SETUP=4,
		IND_ON=255
	}blinkStatus_e;

	static errorIndicatorApp* instance;
private:
	errorLED led;
	uint8_t ledgpio;
	status_t status;
	esp_timer_handle_t led_periodic_timer;

	errorIndicatorApp(uint8_t ledgpio);
	static void timerCB(void* arg);
public:
	~errorIndicatorApp();
	static errorIndicatorApp* getInstance();
	static errorIndicatorApp* startService(uint8_t ledgpio);
	static bool stopService();
	static bool process(blinkStatus_e status);
};




#endif /* COMPONENTS_UPTIMEAPP_LEDAPP_H_ */
