/*
 * BMI160AppCallback.cpp
 *
 *  Created on: Jun 1, 2020
 *      Author: karsh
 */

#include "../components/Sensors/BMI160/App/BMI160App.h"
#include "../components/uptimeApp/timestampGenerator.h"
#include "policies.h"
#include "commons.h"

static char BMI160CB[]={"BMI160 CALLBACK:"};
/* @description BMI160 telemetry functionality, based on policy it can
 * 	Upload the data to MQTT broker in influx inline format
 * 	Upload data to influx db directly using inbuild influx client , using line protocol format
 *
 * 	@param arg calling object
 * 	@return void
 */
void BMI160Telemetry(void* arg){

	BMI160App* senPtr=(BMI160App*)arg;
	BMI160App::measurement_t measure;
	logi(BMI160CB,"Before measurement\n");
	senPtr->processor(BMI160App::MEASURE,BMI160App::ALL,&measure,sizeof(BMI160App::measurement_t));
	timeKeeper::getInstance()->getEpochTime_NanoSec();
	comm_protocol* commProtocol=comm_protocol::getInstance();
	logi(BMI160CB,"After Protocol instance\n");

	if(commProtocol->policy->influxClient_en==comm_protocol::selector::ENABLE){
		logi(BMI160CB,"In Influx\n");
		influxdb_cpp::builder()
			.meas(senPtr->getMeasurementType())
			.tag("deviceUUID", devProperties.deviceUUID)
			.tag("elementUUID", senPtr->getId())
			.tag("networkUUID", devProperties.networkID)
			.tag("acc_unit","G")
			.tag("gyr_unit","rps")
			.field("accx",to_string(measure.accelerometer_G[0]))
			.field("accy",to_string(measure.accelerometer_G[1]))
			.field("accz",to_string(measure.accelerometer_G[2]))
			.field("gyrx",to_string(measure.gyroscope_RPS[0]))
			.field("gyry",to_string(measure.gyroscope_RPS[1]))
			.field("gyrz",to_string(measure.gyroscope_RPS[2]))
			.send_udp(commProtocol->policy->InfluxdbClientPolicy.host_,commProtocol->policy->InfluxdbClientPolicy.port_);
	}

	if(commProtocol->policy->MQTTClient_en==comm_protocol::selector::ENABLE){
		printf(BMI160CB,"In mqtt\n");
			influxLineFormater uploadString;
			uploadString.appendMeasurement(senPtr->getMeasurementType());
			uploadString.appendTag("deviceUUID",devProperties.deviceUUID);
			uploadString.appendTag("elementUUID",senPtr->getId());
			uploadString.appendTag("networkUUID",devProperties.networkID);
			uploadString.appendTag("acc_unit","G");
			uploadString.appendTag("gyr_unit","rps");
			uploadString.appendfield("accx",to_string(measure.accelerometer_G[0]));
			uploadString.appendfield("accy",to_string(measure.accelerometer_G[1]));
			uploadString.appendfield("accz",to_string(measure.accelerometer_G[2]));
			uploadString.appendfield("gyrx",to_string(measure.gyroscope_RPS[0]));
			uploadString.appendfield("gyry",to_string(measure.gyroscope_RPS[1]));
			uploadString.appendfield("gyrz",to_string(measure.gyroscope_RPS[2]));
			uploadString.addTimestamp(timeKeeper::getInstance()->timeToString());
			//logi(BMI160CB,senPtr->getPolicy()->measurement_topic);
			logi(BMI160CB,uploadString.getInlineString());
			commProtocol->mqttClient->publish(senPtr->getPolicy()->measurement_topic,uploadString.getInlineString());
	}
}


//bool calibration_LMS_Regression(BMI160App* sensor,unsigned int sampleSize){
//
//	ESP_LOGI(BMI160APP_TAG,"{calibration_LMS_Regression},samplesize=%d",sampleSize);
//	BMI160App::measurement_t measurement;
//
//
//	linear_regression<float> regression=linear_regression<float>(sampleSize);
//
//	//Accelerometer
//	ESP_LOGI(BMI160APP_TAG,"{calibration_LMS_Regression} Rotate in about X axis \n ");
//	delay(10000);
//	for(unsigned int loopCounter=0;loopCounter<sampleSize;loopCounter++){
//		if(sensor->processor(BMI160App::APP_CMD_e::MEASURE,BMI160App::SUB_CMD_e::ALL,&measurement,sizeof(BMI160App::measurement_t))==false){
//			return false;
//		}
//		regression.addDataPoint(loopCounter,measurement.accelerometer_G[0]);
//		delay(10); //10 ms delay
//	}
//	regression.compute();
//	printf("accelerometer Z axis: m=%f, c=%f, r=%f, POV=%f\n",
//			regression.getSlope(),regression.getOffset(),regression.getCorrelation(),
//			regression.getCoefficientOfDetermination());
//	regression.reset();
//
//
//
//	ESP_LOGI(BMI160APP_TAG,"{calibration_LMS_Regression} Rotate in about Y axis \n ");
//	delay(10000);
//	for(unsigned int loopCounter=0;loopCounter<sampleSize;loopCounter++){
//		if(sensor->processor(BMI160App::APP_CMD_e::MEASURE,BMI160App::SUB_CMD_e::ALL,&measurement,sizeof(BMI160App::measurement_t))==false){
//			return false;
//		}
//		regression.addDataPoint(loopCounter,measurement.accelerometer_G[1]);
//		delay(10); //10 ms delay
//	}
//	regression.compute();
//	printf("accelerometer Z axis: m=%f, c=%f, r=%f, POV=%f\n",
//			regression.getSlope(),regression.getOffset(),regression.getCorrelation(),
//			regression.getCoefficientOfDetermination());
//	regression.reset();
//
//
//
//
//	//Gyroscope
//	ESP_LOGI(BMI160APP_TAG,"{calibration_LMS_Regression} Rotate in about Z axis \n ");
//	delay(10000);
//	for(unsigned int loopCounter=0;loopCounter<sampleSize;loopCounter++){
//		if(sensor->processor(BMI160App::APP_CMD_e::MEASURE,BMI160App::SUB_CMD_e::ALL,&measurement,sizeof(BMI160App::measurement_t))==false){
//			return false;
//		}
//		regression.addDataPoint(loopCounter,measurement.accelerometer_G[2]);
//		delay(10); //10 ms delay
//	}
//	regression.compute();
//	printf("accelerometer Z axis: m=%f, c=%f, r=%f, POV=%f\n",
//			regression.getSlope(),regression.getOffset(),regression.getCorrelation(),
//			regression.getCoefficientOfDetermination());
//	regression.reset();
//
//
//
//	ESP_LOGI(BMI160APP_TAG,"{calibration_LMS_Regression} Gyro X keep still \n ");
//	delay(1000);
//	for(unsigned int loopCounter=0;loopCounter<sampleSize;loopCounter++){
//		if(sensor->processor(BMI160App::APP_CMD_e::MEASURE,BMI160App::SUB_CMD_e::ALL,&measurement,sizeof(BMI160App::measurement_t))==false){
//			return false;
//		}
//		regression.addDataPoint(loopCounter,measurement.gyroscope_RPS[0]);
//		delay(100); //10 ms delay
//	}
//	regression.compute();
//	printf("gyro x axis: m=%f, c=%f, r=%f, POV=%f\n",
//			regression.getSlope(),regression.getOffset(),regression.getCorrelation(),
//			regression.getCoefficientOfDetermination());
//	regression.reset();
//
//
//	ESP_LOGI(BMI160APP_TAG,"{calibration_LMS_Regression} Gyro Y keep still \n ");
//	delay(1000);
//	for(unsigned int loopCounter=0;loopCounter<sampleSize;loopCounter++){
//		if(sensor->processor(BMI160App::APP_CMD_e::MEASURE,BMI160App::SUB_CMD_e::ALL,&measurement,sizeof(BMI160App::measurement_t))==false){
//			return false;
//		}
//		regression.addDataPoint(loopCounter,measurement.gyroscope_RPS[1]);
//		delay(100); //10 ms delay
//	}
//	regression.compute();
//	printf("gyro y axis: m=%f, c=%f, r=%f, POV=%f\n",
//			regression.getSlope(),regression.getOffset(),regression.getCorrelation(),
//			regression.getCoefficientOfDetermination());
//	regression.reset();
//
//
//	ESP_LOGI(BMI160APP_TAG,"{calibration_LMS_Regression} Gyro Z keep still \n ");
//	delay(1000);
//	for(unsigned int loopCounter=0;loopCounter<sampleSize;loopCounter++){
//		if(sensor->processor(BMI160App::APP_CMD_e::MEASURE,BMI160App::SUB_CMD_e::ALL,&measurement,sizeof(BMI160App::measurement_t))==false){
//			return false;
//		}
//		regression.addDataPoint(loopCounter,measurement.gyroscope_RPS[2]);
//		delay(100); //10 ms delay
//	}
//	regression.compute();
//	printf("gyro z axis: m=%f, c=%f, r=%f, POV=%f\n",
//			regression.getSlope(),regression.getOffset(),regression.getCorrelation(),
//			regression.getCoefficientOfDetermination());
//	regression.reset();
//
//	return true;
//
//}
//
