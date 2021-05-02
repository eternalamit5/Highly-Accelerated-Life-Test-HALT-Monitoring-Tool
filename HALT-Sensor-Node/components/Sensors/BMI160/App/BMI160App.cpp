/*
 * BMI160App.cpp
 *
 *  Created on: Mar 6, 2020
 *      Author: karsh
 */

#include "BMI160App.h"
#include "../components/uptimeApp/policies.h"
#include "../components/Communication/protocol.h"
#include "commons.h"

static char BMI160APP_TAG[]={"BMI160App: "};

/* @description contructor
 * @param policy policy describing sensor configuration
 * @return NA
 */
BMI160App::BMI160App(sensorPolicy& policy):SensorBase(policy.sensorElementID,policy.description,policy.measurement_topic,policy.sample_frequency),
		BMI160HALInstance(NULL),policy(&policy) {

	//Verify comm hardware
	this->comm = comm_hardware::getInstance();
	if(this->comm==NULL){
		reportError(EMU_FAILURE,"Communication interface can't be NULL");
		abort();
	}


	//Create sensor instance
	switch(policy.peripheralCommInterface){
		case comm_hardware::sensor_comm_interface::I2C_0:

				//Check if i2c0 interface exists
				if(this->comm->i2c0==NULL){
					throw EMU_ERR_NULL;
				}

				//create sensor instance
				if(comm_hardware::lockSensorCommResource(this->policy->peripheralCommInterface)==true){

					BMI160HALInstance = new BMI160HAL(this->comm->i2c0,policy.peripheralCommAddress,
							(BMI160HAL::gyroRange_t)policy.gyroscopeRange,(BMI160HAL::accelRange_t)policy.accelerometerRange);
					comm_hardware::unlockSensorCommResource(this->policy->peripheralCommInterface);
				}


				//verify the sensor instance
				if(BMI160HALInstance==NULL){

					reportError(EMU_ERR_OUT_OF_MEMORY,"BMI160HAL instance can't be created");
					abort();
				}


			break;
		case comm_hardware::sensor_comm_interface::I2C_1:
				//Check if i2c1 interface exists
				if(this->comm->i2c1==NULL){
					reportError( EMU_ERR_NULL, "communication interface can't be NULL");
					abort();
				}

				//create sensor instance
				if(comm_hardware::lockSensorCommResource(this->policy->peripheralCommInterface)==true){
					BMI160HALInstance = new BMI160HAL(this->comm->i2c1,policy.peripheralCommAddress,
										(BMI160HAL::gyroRange_t)policy.gyroscopeRange,(BMI160HAL::accelRange_t)policy.accelerometerRange);
					comm_hardware::unlockSensorCommResource(this->policy->peripheralCommInterface);
				}
				//verify the sensor instance
				if(BMI160HALInstance==NULL){
					reportError(EMU_ERR_OUT_OF_MEMORY,"BMI160HAL instance can't be created");
					abort();
				}
			break;
		default:
				reportError(EMU_FAILURE, "Communication interface not supported");
				abort();
			break;
	}

}

/* @description destructor
 * @param NA
 * @return NA
 */
BMI160App::~BMI160App() {
	if(BMI160HALInstance != NULL){
		delete BMI160HALInstance;
	}
}

/* @description device specific command processor
 * @param cmd application main command
 * @param subcmd sun command
 * @param arg1 first argument
 * @param arg1Size first argument size
 * @return true if success, false on failure
 *
 */
bool BMI160App::dev_specific_cmd_Processor(unsigned char cmd,unsigned char subcmd,void *arg1,size_t arg1Size) {
	bool ret=true;

	//process based on cmd
	if(ret){
		switch(cmd){
		case BMI160App::APP_CMD_e::MEASURE:

				logi(BMI160APP_TAG,"command: MEASURE");
				if(comm_hardware::lockSensorCommResource(this->policy->peripheralCommInterface)==true){
					//process based on subcmd
					switch(subcmd){
						case BMI160App::ALL:
							logi(BMI160APP_TAG,"sub-command,ALL");
							if(sizeof(BMI160App::measurement_t)==arg1Size){
								BMI160HALInstance->measure(BMI160HAL::GYRO_ACCEL,(BMI160App::measurement_t*)arg1);
							}else{reportError(EMU_ERR_INVALID_ARG, "Invalid argument"); ret = false;}
							break;

						case BMI160App::ACCELERATION_IN_G:
							logi(BMI160APP_TAG,"sub-command,ACCELERATION_IN_G");
							if(sizeof(BMI160App::measurement_t)==arg1Size){
								BMI160HALInstance->measure(BMI160HAL::ACCEL,(BMI160App::measurement_t*)arg1);
							}else{reportError(EMU_ERR_INVALID_ARG, "Invalid argument"); ret = false;}
							break;

						case BMI160App::ANGULAR_VELOCITY_RPS:
							logi(BMI160APP_TAG,"sub-command,ANGULAR_VELOCITY_RPS");
							if(sizeof(BMI160App::measurement_t)==arg1Size){
								BMI160HALInstance->measure(BMI160HAL::GYRO,(BMI160App::measurement_t*)arg1);
							}else{reportError(EMU_ERR_INVALID_ARG, "Invalid argument"); ret = false;}
							break;
						default:
							ret = false;
							break;
					}
					comm_hardware::unlockSensorCommResource(this->policy->peripheralCommInterface);
				}
			break;
		case BMI160App::APP_CMD_e::CALIBRATE:
					logi(BMI160APP_TAG,"command: CALIBRATE");
					//process based on subcmd
					switch(subcmd){
						case LINEAR_REGRESSION:
							logi(BMI160APP_TAG,"sub-command,LINEAR_REGRESSION");
							if(sizeof(unsigned int)==arg1Size){
								//calibration_LMS_Regression(this,*((unsigned int*)arg1));
							}else{reportError(EMU_ERR_INVALID_ARG, "Invalid argument");}
							break;
						default:
							ret = false;
							break;
					}
			break;
		default:
			ret = false;
			break;
		}
	}

	return ret;
}


/* @description gets sensor policy stored
 * @param NA
 * @return pointer sensor policy
 */
const BMI160App::sensorPolicy* BMI160App::getPolicy() const {
	return policy;
}






