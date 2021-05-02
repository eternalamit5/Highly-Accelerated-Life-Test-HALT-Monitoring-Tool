/*
 * BMI160App.cpp
 *
 *  Created on: Dec 1, 2019
 *      Author: karsh
 */

#include "BMI160HAL.h"
#include "esp_log.h"

static char BMI160HAL_TAG[]={"BMI160HAL: "};


/* @description Constructor
 * @param i2cInterface i2c interface
 * @param i2cAddress i2c address
 * @param gyroRange gyro range
 * @param accelRange accelerometer range
 * @return NA
 */
BMI160HAL::BMI160HAL(TwoWire* i2cInterface,int i2cAddress,gyroRange_t gyroRange,accelRange_t accelRange)
:gyroRange(gyroRange),accelRange(accelRange){

	logi(BMI160HAL_TAG,"");
	//Create BMI160 driver instance
	this->sensor=new BMI160Driver();
	if(this->sensor==NULL){
		reportError(EMU_FAILURE,"BMI160 Driver failed to create");
		abort();
	}

	logi(BMI160HAL_TAG,"");
	if(sensor->begin(BMI160Driver::I2C_MODE,i2cInterface,NULL,i2cAddress)==false){
		reportError(EMU_FAILURE,"BMI160 Driver failed to create");
		abort();
	}

	logi(BMI160HAL_TAG,"");
	//Set gyro range parameter
	sensor->setGyroRange(int(gyroRange));

	//set accelerometer range parameter
	sensor->setAccelerometerRange(int(accelRange));
}



/* @description destructor
 * @param NA
 * @return NA
 */
BMI160HAL::~BMI160HAL(){
	if(this->sensor!=NULL){
		delete this->sensor;
	}
}

/* @decsription Take measurement from BME 280 (sensor measurement is taken here)
 * @param type measurement type
 * 				> ALL (Gyro and accelerometer)
 * 				> GYRO (only gyroscope)
 * 				> ACCEL (only accelerometer)
 * @param measurement: BMEmeasurement contains
 * 						> temperature,
 * 						> pressure,
 * 						> altitude,
 * 						> humidity
 * @return true on success, false on failure
 */
bool BMI160HAL::measure(IMUMeasurementType_t type,IMUMeasurement_t* measurement){

	int gxRaw,gyRaw,gzRaw,axRaw,ayRaw,azRaw;

	switch(type){
	case GYRO_ACCEL:
		logi(BMI160HAL_TAG,"Measure: GYRO_ACCEL");
		this->sensor->readMotionSensor(axRaw, ayRaw, azRaw,gxRaw, gyRaw, gzRaw);
		measurement->gyroscope_RPS[0] = convertRawGyro(gxRaw,this->gyroRange);
		measurement->gyroscope_RPS[1] = convertRawGyro(gyRaw,this->gyroRange);
		measurement->gyroscope_RPS[2] = convertRawGyro(gzRaw,this->gyroRange);
		measurement->accelerometer_G[0] = convertRawAccel(axRaw,this->accelRange);
		measurement->accelerometer_G[1] = convertRawAccel(ayRaw,this->accelRange);
		measurement->accelerometer_G[2] = convertRawAccel(azRaw,this->accelRange);
		break;
	case GYRO:
		logi(BMI160HAL_TAG,"Measure: GYRO");
		this->sensor->readGyro(gxRaw, gyRaw, gzRaw);
		measurement->gyroscope_RPS[0] = convertRawGyro(gxRaw,this->gyroRange);
		measurement->gyroscope_RPS[1] = convertRawGyro(gyRaw,this->gyroRange);
		measurement->gyroscope_RPS[2] = convertRawGyro(gzRaw,this->gyroRange);
		break;
	case ACCEL:
		logi(BMI160HAL_TAG,"Measure: ACCEL");
		this->sensor->readAccelerometer(axRaw, ayRaw, azRaw);
		measurement->accelerometer_G[0] = convertRawAccel(axRaw,this->accelRange);
		measurement->accelerometer_G[1] = convertRawAccel(ayRaw,this->accelRange);
		measurement->accelerometer_G[2] = convertRawAccel(azRaw,this->accelRange);
		break;
	}
	measurement->type = type;

	return true;
}


/* @description Display measurement stored measurement (measurement is not taken here)
 * @param measurement: BMEmeasurement contains
 * 						> temperature,
 * 						> pressure,
 * 						> altitude,
 * 						> humidity
 * @return true on success, false on failure
 */
void BMI160HAL::displayMeasurement(IMUMeasurement_t measurement){

	switch(measurement.type){
	case GYRO_ACCEL:
		logi(BMI160HAL_TAG,"{Measurement type} "<<measurement.type);
		logi(BMI160HAL_TAG,"{displayMeasurement} Gyro: [x] "<< measurement.gyroscope_RPS[0]<<
				" [y] "<< measurement.gyroscope_RPS[1]<<" [z] "<<measurement.gyroscope_RPS[2]);

		logi(BMI160HAL_TAG,"{displayMeasurement} Accel: [x] "<< measurement.accelerometer_G[0]<<
				" [y] "<< measurement.accelerometer_G[1]<<" [z] "<<measurement.accelerometer_G[2]);
		break;

	case GYRO:
		logi(BMI160HAL_TAG,"{Measurement type} "<<measurement.type);
		logi(BMI160HAL_TAG,"{displayMeasurement} Gyro: [x] "<< measurement.gyroscope_RPS[0]<<
				" [y] "<< measurement.gyroscope_RPS[1]<<" [z] "<<measurement.gyroscope_RPS[2]);
		break;

	case ACCEL:
		logi(BMI160HAL_TAG,"{Measurement type} "<<measurement.type);
		logi(BMI160HAL_TAG,"{displayMeasurement} Accel: [x] "<< measurement.accelerometer_G[0]<<
				" [y] "<< measurement.accelerometer_G[1]<<" [z] "<<measurement.accelerometer_G[2]);
		break;
	}
}


/* @description convert gyro raw integer reading to Rotation in degree per seocnd)
 * @param gRaw gyroscope raw reading
 * @param range range of gyroscope
 * @return floating value of rotation in degree per second)
 */
float BMI160HAL::convertRawGyro(int gRaw,gyroRange_t range) {

  uint16_t scaleRange=0;
  switch(range){
	  case GYRO_125:
		  scaleRange =125;
		  break;
	  case GYRO_250:
		  scaleRange =250;
		  break;
	  case GYRO_500:
		  scaleRange =500;
		  break;
	  case GYRO_1000:
		  scaleRange =1000;
		  break;
	  case GYRO_2000:
		  scaleRange =2000;
		  break;
  }

  // since we are using 250 degrees/seconds range
  // -250 maps to a raw value of -32768
  // +250 maps to a raw value of 32767
  float g = (gRaw * (scaleRange*1.0)) / 32768.0;

  return g;
}


/* @description convert accelerometer raw integer reading to Gravity in meters per second
 * @param aRaw accelerometer raw reading
 * @param range range of accelerometer
 * @return floating value of Gravity in meter per second
 */
float BMI160HAL::convertRawAccel(int gRaw,accelRange_t range) {

  uint16_t scaleRange=0;
  switch(range){
	  case ACC_2G:
		  scaleRange =16384;
		  break;
	  case ACC_4G:
		  scaleRange =8192;
		  break;
	  case ACC_8G:
		  scaleRange =4096;
		  break;
	  case ACC_16G:
		  scaleRange =2048;
		  break;
  }
  float g = (gRaw /(scaleRange*1.0));

  return g;
}

/* @description reports error
 * @param err error number
 * @param message error message
 * @return NA
 */
void BMI160HAL::reportError(emu_err_t err,string message){
	logw(BMI160HAL_TAG,message<<", Exception Number: "<<to_string(err));
}

