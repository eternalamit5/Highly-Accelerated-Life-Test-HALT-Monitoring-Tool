/*
 * led.cpp
 *
 *  Created on: Feb 18, 2020
 *      Author: karsh
 */
#include "errorLED.h"
#include "../arduino-esp32/cores/esp32/Arduino.h"
#include "../components/ErrorHandler/errorHandler.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "sdkconfig.h"
#include "esp_log.h"



errorLED::errorLED(uint8_t gpiopin,ledLogicLevel_e level){
	this->pin=(gpio_num_t)gpiopin;
	this->blinkStatus=0;
    gpio_pad_select_gpio(gpiopin); // @suppress("Invalid arguments")
    gpio_set_direction(pin, GPIO_MODE_OUTPUT);
    gpio_set_level(pin,(unsigned int)level);
}

errorLED::~errorLED(){
	gpio_set_level(pin,0);
}

void errorLED::setOutput(ledLogicLevel_e level){
	gpio_set_level(pin,(unsigned int)level);
}

errorLED::ledLogicLevel_e errorLED::getOutput(){
	if(gpio_get_level(pin)==1)
		return LED_HIGH;
	return LED_LOW;
}

void errorLED::toggle(){
	if(gpio_get_level(pin)==0){
		gpio_set_level(pin,1);
	}
	else{
		gpio_set_level(pin,0);
	}
}

void errorLED::blink(int blinkCnt,long int msDuration){

	setOutput(LED_LOW);

	for(auto i=0;i<blinkCnt;i++){
		delay(msDuration/(blinkCnt*2)); //ms
		setOutput(LED_HIGH);
		delay(msDuration/(blinkCnt*2)); //ms
		setOutput(LED_LOW);
	}

}

uint8_t errorLED::getBlinkStatus(){
	return this->blinkStatus;
}
void errorLED::setBlinkStatus(uint8_t status){
	this->blinkStatus=status;
}



