/*
 * BMI160App.h
 *
 *  Created on: Dec 1, 2019
 *      Author: karsh
 */

#ifndef COMPONENTS_BMI160_APP_BMI160APP_H_
#define COMPONENTS_BMI160_APP_BMI160APP_H_

#include "../Driver/BMI160Gen.h"
#include "commons.h"
#include "../components/ErrorHandler/errorHandler.h"


/* @description Class implemetation for BMI160 IMU
 *
 */
class BMI160HAL{

public:
	/* @description IMU measurement types */
	typedef enum{
		GYRO_ACCEL=0,
		GYRO,
		ACCEL
	}IMUMeasurementType_t;


	/* @description gyro range for the given range */
	typedef enum{
		GYRO_125=125,
		GYRO_250=250,
		GYRO_500=500,
		GYRO_1000=1000,
		GYRO_2000=2000
	}gyroRange_t;

	/* @description accelerometer range for the given range */
	typedef enum{
		ACC_2G=2,
		ACC_4G=4,
		ACC_8G=8,
		ACC_16G=16
	}accelRange_t;


	/* @description IMU measurement */
	typedef struct{
		float accelerometer_G[3];
		float gyroscope_RPS[3];
		IMUMeasurementType_t type;
	}IMUMeasurement_t;



	/* @description Constructor
	 * @param i2cInterface i2c interface
	 * @param i2cAddress i2c address
	 * @param gyroRange gyro range
	 * @param accelRange accelerometer range
	 * @return NA
	 */
	BMI160HAL(TwoWire* i2cInterface,int i2cAddress,gyroRange_t gyroRange,accelRange_t accelRange);


	/* @description destructor
	 * @param NA
	 * @return NA
	 */
	~BMI160HAL();

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
	bool measure(IMUMeasurementType_t type,IMUMeasurement_t* measurement);

	/* @description Display measurement stored measurement (measurement is not taken here)
	 * @param measurement: BMEmeasurement contains
	 * 						> temperature,
	 * 						> pressure,
	 * 						> altitude,
	 * 						> humidity
	 * @return true on success, false on failure
	 */
	void displayMeasurement(IMUMeasurement_t measurement);

	/* @description reports error
	 * @param err error number
	 * @param message error message
	 * @return NA
	 */
	void reportError(emu_err_t err,string message);

private:
	BMI160Driver* sensor;
	gyroRange_t gyroRange;
	accelRange_t accelRange;

	/* @description convert gyro raw integer reading to Rotation in degree per seocnd)
	 * @param gRaw gyroscope raw reading
	 * @param range range of gyroscope
	 * @return floating value of rotation in degree per second)
	 */
	float convertRawGyro(int gRaw,gyroRange_t range);

	/* @description convert accelerometer raw integer reading to Gravity in meters per second
	 * @param aRaw accelerometer raw reading
	 * @param range range of accelerometer
	 * @return floating value of Gravity in meter per second
	 */
	float convertRawAccel(int aRaw,accelRange_t range);
};




#endif /* COMPONENTS_BMI160_APP_BMI160APP_H_ */
