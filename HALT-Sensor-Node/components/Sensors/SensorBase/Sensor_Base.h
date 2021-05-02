/*
 * BME280_Task.h
 *
 *  Created on: Mar 2, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_BME280_SENSOR_TASK_SENSOR_TASK_H_
#define COMPONENTS_BME280_SENSOR_TASK_SENSOR_TASK_H_

#include "commons.h"
#include "../components/Communication/peripheral_communication.h"




class SensorBase{
public:
	using sensor_loop_cb_t = std::function<void(void* arg)>;
	using user_app_cb_t = std::function<void(void* arg)>;

	typedef enum{
		DISABLE=0,
		ENABLE=1
	}selector;


	typedef enum{
		START=0,
		STOP=1,
		UPDATE_SAMPLE_RATE=2,
		UPDATE_DESCRIPTION=3,
		UPDATE_DATA_PREFIX=4,
		MEASURE=5,
		CALIBRATE=6
	}APP_CMD_e;

	typedef enum{
		NONE=0
	}SUB_CMD_e;

	SensorBase(string sensorElementID,string desc,string dataPrefix,float sampleRate=0);
	virtual ~SensorBase();
	bool processor(unsigned char cmd,unsigned char subcmd=SUB_CMD_e::NONE,void* arg1=NULL,size_t arg1Size=0);
	bool registerTimerCB(sensor_loop_cb_t);
	void deregisterTimerCB();
	bool registerUserAppCB(user_app_cb_t);
	void deregisterUserAppCB();
	void runUserApp();

	//getter and setters
	string getId() const;
	const string& getDescription() const;
	uint16_t getSampleRate() const;
	const string& getMeasurementType() const;
	const sensor_loop_cb_t& getTimerCb() const;

private:
	string ID;
	string description;
	float sampleRate; //uint16_t
	string dataPrefix;
	esp_timer_handle_t periodicTimer;
	sensor_loop_cb_t timer_cb;
	bool isPeriodicTimerRunning;
	user_app_cb_t userApp_cb;
protected:
	comm_hardware* comm;
	bool generalCmdProcessor(unsigned char cmd,void* arg1,size_t arg1Size);
	virtual bool dev_specific_cmd_Processor(unsigned char cmd,unsigned char subcmd,void* arg1,size_t arg1Size)=0;
	virtual void reportError(emu_err_t err,string message);
};




#endif /* COMPONENTS_BME280_SENSOR_TASK_SENSOR_TASK_H_ */
