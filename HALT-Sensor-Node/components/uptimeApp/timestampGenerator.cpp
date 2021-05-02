/*
 * timestampGenerator.cpp
 *
 *  Created on: Sep 17, 2020
 *      Author: karsh
 */
#include "timestampGenerator.h"

static const char *TIMEKEEPER = "Timekeeper:";
timeKeeper* timeKeeper::instance=NULL;

timeKeeper* timeKeeper::getInstance(){
	return timeKeeper::instance;
}

timeKeeper* timeKeeper::startService(std::string ntp_server_url){
	if(timeKeeper::instance==NULL){
		timeKeeper::instance = new timeKeeper(ntp_server_url);
		if(timeKeeper::instance!=NULL){
			return timeKeeper::instance;
		}
	}
	return NULL;
}

timeKeeper::timeKeeper(std::string ntp_server_url):ntpServerURL(ntp_server_url),timestamp(0)
{
	if(!ntp_server_url.empty()){
		logi(TIMEKEEPER, "Obtaining time from network");
		sntp_setoperatingmode(SNTP_OPMODE_POLL);
		sntp_setservername(0, this->ntpServerURL.c_str());
		sntp_init();

		// wait for time to be set
		int retry = 0;
		const int retry_count = 10;
		while (sntp_get_sync_status() == SNTP_SYNC_STATUS_RESET && ++retry < retry_count) {
			logi(TIMEKEEPER, "Waiting for system time");
			vTaskDelay(2000 / portTICK_PERIOD_MS);
		}
	}else{
		logi(TIMEKEEPER, "NTP server URL missing");
	}
}


bool timeKeeper::getEpochTime_Sec(void)
{
    time_t now;
    struct tm timeinfo;
    time(&now);
    localtime_r(&now, &timeinfo);
    if (timeinfo.tm_year < (2020 - 1900)) {
    	this->timestamp = 0;
        return false;
    }

    struct timeval tv_now;
    gettimeofday(&tv_now, NULL);
    this->timestamp = (uint64_t)tv_now.tv_sec;
    return true;
}

bool timeKeeper::getEpochTime_MilliSec(void)
{
    time_t now;
    struct tm timeinfo;
    time(&now);
    localtime_r(&now, &timeinfo);
    if (timeinfo.tm_year < (2020 - 1900)) {
    	this->timestamp = 0;
        return false;
    }

    struct timeval tv_now;
    gettimeofday(&tv_now, NULL);
    uint64_t time_us = (uint64_t)tv_now.tv_sec * 1000000L + (uint64_t)tv_now.tv_usec;
    this->timestamp = uint64_t(time_us/1000.0);
    return true;
}


bool timeKeeper::getEpochTime_MicroSec(void)
{
    time_t now;
    struct tm timeinfo;
    time(&now);
    localtime_r(&now, &timeinfo);
    if (timeinfo.tm_year < (2020 - 1900)) {
    	this->timestamp = 0;
        return false;
    }

    struct timeval tv_now;
    gettimeofday(&tv_now, NULL);
    uint64_t time_us = (uint64_t)tv_now.tv_sec * 1000000L + (uint64_t)tv_now.tv_usec;
    this->timestamp = time_us;
    return true;
}


bool timeKeeper::getEpochTime_NanoSec(void)
{
    time_t now;
    struct tm timeinfo;
    time(&now);
    localtime_r(&now, &timeinfo);
    if (timeinfo.tm_year < (2020 - 1900)) {
    	this->timestamp = 0;
        return false;
    }

    struct timeval tv_now;
    gettimeofday(&tv_now, NULL);
    uint64_t time_us = (uint64_t)tv_now.tv_sec * 1000000L + (uint64_t)tv_now.tv_usec;
    this->timestamp = uint64_t(time_us*1000.0);
    return true;
}

std::string timeKeeper::timeToString(void) {
    std::ostringstream os;
    os << this->timestamp;
    return os.str();
}

