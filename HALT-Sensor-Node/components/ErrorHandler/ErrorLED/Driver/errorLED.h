/*
 * led.h
 *
 *  Created on: Feb 18, 2020
 *      Author: karsh
 */

#ifndef LED_H_
#define LED_H_

#include <stdio.h>
#include "driver/gpio.h"
#include "commons.h"





class errorLED{

private:
	gpio_num_t pin;
	uint8_t blinkStatus;

public:
	typedef enum{
		LED_LOW=0,
		LED_HIGH=1
	}ledLogicLevel_e;

	errorLED(uint8_t gpiopin,ledLogicLevel_e level);
	~errorLED();

	void setOutput(ledLogicLevel_e level);
	ledLogicLevel_e getOutput();
	uint8_t getBlinkStatus();
	void setBlinkStatus(uint8_t status);
	void toggle();
	void blink(int blinkCnt,long int msDuration);
};



#endif /* LED_H_ */
