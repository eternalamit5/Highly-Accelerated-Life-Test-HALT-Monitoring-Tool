/*
 * mqtt_C_Binding.c
 *
 *  Created on: May 27, 2020
 *      Author: karsh
 */
#include "mqtt_C_Binding.h"

static char MQTT_C_TAG[]={"MQTT_C_binding:"};

esp_mqtt_client_handle_t mqtt_app_start(const char* uri,int port,int keepAliveInterval,int lastWillQos,
		bool enableCleanSession,bool enableAutoReconnect,const char* lastWillTopic, const char* lastWillMsg)
{
    esp_mqtt_client_config_t mqtt_cfg = { // @suppress("Invalid arguments")
        .uri = uri,
		.keepalive=keepAliveInterval,
		.disable_clean_session=!enableCleanSession,
        .disable_auto_reconnect=!enableAutoReconnect,
		.lwt_msg=lastWillMsg,
		.lwt_topic=lastWillTopic,
		.lwt_qos=lastWillQos,
    };

    esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
    if(client==NULL){
    	ESP_LOGW(MQTT_C_TAG,"{mqtt_app_start}, Init configuration failed");
    }else{
    	ESP_LOGI(MQTT_C_TAG,"{mqtt_app_start}, Init configuration, OK");
    }
    return client;
}

