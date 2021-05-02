/*
 * BMI160AppCallback.h
 *
 *  Created on: Jun 1, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_SENSORS_BMI160_APP_BMI160APPCALLBACK_H_
#define COMPONENTS_SENSORS_BMI160_APP_BMI160APPCALLBACK_H_


/* @description BMI160 telemetry functionality, based on policy it can
 * 	Upload the data to MQTT broker in influx inline format
 * 	Upload data to influx db directly using inbuild influx client , using line protocol format
 *
 * 	@param arg calling object
 * 	@return void
 */
void BMI160Telemetry(void* arg);


/* To be tested, don't use in deployment
 *
 */
//bool calibration_LMS_Regression(BMI160App* sensor,unsigned int sampleSize);


#endif /* COMPONENTS_SENSORS_BMI160_APP_BMI160APPCALLBACK_H_ */
