/*
 * wifiAppUserCallback.cpp
 *
 *  Created on: Jun 3, 2020
 *      Author: karsh
 */
#include "commons.h"

static char WIFI_USER_CALLBACK_TAG[]={"wifi User CB:"};

void wifi_DisconnectionUserCallback(void* arg){
	logi(WIFI_USER_CALLBACK_TAG,"call");
}

void wifi_ConnectionUserCallback(void* arg){
	logi(WIFI_USER_CALLBACK_TAG,"call");
}
