/*
 * mqtt_C_Binding.h
 *
 *  Created on: May 27, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_COMMUNICATION_LPG_MQTT_APP_MQTT_C_BINDING_H_
#define COMPONENTS_COMMUNICATION_LPG_MQTT_APP_MQTT_C_BINDING_H_

#include "mqtt_client.h"

#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"
#include "freertos/event_groups.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"

#include "esp_log.h"

#ifdef __cplusplus
extern "C"{
#endif
esp_mqtt_client_handle_t mqtt_app_start(const char* uri,int port,int keepAliveInterval,int lastWillQos,
		bool enableCleanSession,bool enableAutoReconnect,const char* lastWillTopic, const char* lastWillMsg);
#ifdef __cplusplus
}
#endif

#endif /* COMPONENTS_COMMUNICATION_LPG_MQTT_APP_MQTT_C_BINDING_H_ */
