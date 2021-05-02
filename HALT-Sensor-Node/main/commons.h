/*
 * commons.h
 *
 *  Created on: May 21, 2020
 *      Author: karsh
 */

#ifndef MAIN_COMMONS_H_
#define MAIN_COMMONS_H_

#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "stdbool.h"
#include "esp_system.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"
#include "freertos/event_groups.h"
#include "freertos/semphr.h"
#include "esp_timer.h"
#include "sdkconfig.h"


#define TICK_PER_SECOND CONFIG_FREERTOS_HZ

#ifdef __cplusplus
#include <iostream>
#include <string>
#include <sstream>
#include "bits/std_function.h"
#include "../arduino-esp32/cores/esp32/Arduino.h"
#include "../arduino-esp32/libraries/Wire/src/Wire.h"
#include "list"
#include "vector"
#endif

#define LOG_PRINT (1)

#ifdef __cplusplus
#define RAW(x,y)		{if(LOG_PRINT){std::stringstream buf; buf<<y<<"\n";ESP_LOGI(x,"%s",buf.str().c_str());}}
#define ERROR(x,y) 	{if(LOG_PRINT){std::stringstream buf; buf<<"[ERR  ]"<<" {FUN:"<<__func__<<"} {LINE:"<<__LINE__<<"} {MSG:"<<y<<"}\n";ESP_LOGE(x,"%s",buf.str().c_str());}}
#define WARN(x,y) 	{if(LOG_PRINT){std::stringstream buf; buf<<"[WARN ]"<<" {FUN:"<<__func__<<"} {LINE:"<<__LINE__<<"} {MSG:"<<y<<"}\n";ESP_LOGW(x,"%s",buf.str().c_str());}}
#define INFO(x,y) 	{if(LOG_PRINT){std::stringstream buf; buf<<"[INFO ]"<<" {FUN:"<<__func__<<"} {LINE:"<<__LINE__<<"} {MSG:"<<y<<"}\n";ESP_LOGI(x,"%s",buf.str().c_str());}}
#define DEBUG(x,y) 	{if(LOG_PRINT){std::stringstream buf; buf<<"[TRACE]"<<" {FUN:"<<__func__<<"} {LINE:"<<__LINE__<<"} {MSG:"<<y<<"}\n";ESP_LOGD(x,"%s",buf.str().c_str());}}

#define logr(x,y)	RAW(x,y)
#define loge(x,y) 	ERROR(x,y)
#define logw(x,y) 	WARN(x,y)
#define logi(x,y) 	INFO(x,y)
#define logd(x,y) 	DEBUG(x,y)

#define DELAY_MS(x) {delay(x);}
#endif

#ifdef __cplusplus
#endif

#endif /* MAIN_COMMONS_H_ */
