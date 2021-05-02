/*
 * configurationManager.h
 *
 *  Created on: Jun 9, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_UPTIMEAPP_CONFIGURATIONMANAGER_H_
#define COMPONENTS_UPTIMEAPP_CONFIGURATIONMANAGER_H_

#include "commons.h"
#include "../components/ArduinoJson/ArduinoJson.h"
#include "../components/Communication/httpClient/httpClientApp.h"
#include "../components/Storage/SDcard/App/storage.h"

using namespace std;

struct  configManager {
static bool updateSystemConfigurationFromStorageMedia();
static bool updateSensorConfigurationFromStorageMedia();
static bool updateProtocolConfigurationFromStorageMedia();
static bool updateStorageConfigurationFromStorageMedia();
static bool downloadConfiguration(string uri,string deviceid);
};




#endif /* COMPONENTS_UPTIMEAPP_CONFIGURATIONMANAGER_H_ */
