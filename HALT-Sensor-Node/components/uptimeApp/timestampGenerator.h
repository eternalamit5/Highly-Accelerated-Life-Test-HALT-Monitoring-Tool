/*
 * timestampGenerator.h
 *
 *  Created on: Sep 17, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_UPTIMEAPP_TIMESTAMPGENERATOR_H_
#define COMPONENTS_UPTIMEAPP_TIMESTAMPGENERATOR_H_

#include "commons.h"
#include <time.h>
#include <sys/time.h>
#include "esp_event.h"
#include "esp_log.h"
#include "esp_attr.h"
#include "esp_sleep.h"
#include "nvs_flash.h"
#include "esp_sntp.h"

class timeKeeper {
private:
	std::string ntpServerURL;
	uint64_t timestamp;
	static timeKeeper* instance;
	timeKeeper(std::string ntp_server_url);
public:
	static timeKeeper* getInstance();
	static timeKeeper* startService(std::string ntp_server_url);
	bool getEpochTime_Sec(void);
	bool getEpochTime_MilliSec(void);
	bool getEpochTime_MicroSec(void);
	bool getEpochTime_NanoSec(void);
	std::string timeToString(void);
};



#endif /* COMPONENTS_UPTIMEAPP_TIMESTAMPGENERATOR_H_ */
