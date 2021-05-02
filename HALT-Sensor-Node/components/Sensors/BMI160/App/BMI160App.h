/*
 * BMI160App.h
 *
 *  Created on: Mar 6, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_SENSORS_BMI160_APP_BMI160APP_H_
#define COMPONENTS_SENSORS_BMI160_APP_BMI160APP_H_

#include "../../SensorBase/Sensor_Base.h"
#include "../components/Sensors/BMI160/HAL/BMI160HAL.h"
#include "../components/Communication/protocol.h"
//#include "../components/Algorithms/linearRegression/LinearRegression.h"

/* @description BMI160 Class implementation
 *
 */
class BMI160App: public SensorBase
{
public:

	typedef BMI160HAL::IMUMeasurement_t measurement_t;

	/* @description sensor policy attributes
	 *
	 */
	typedef struct{
		SensorBase::selector sensor_en;
		string sensorElementID;
		string description;
		string measurement_type;
		string measurement_topic;
		string log_msg_topic;
		comm_hardware::sensor_comm_interface peripheralCommInterface;
		uint8_t peripheralCommAddress;
		comm_protocol::gateway_comm_interface telemetryInterface;

		BMI160HAL::gyroRange_t gyroscopeRange;
		float gyro_x_offset;
		float gyro_y_offset;
		float gyro_z_offset;
		float gyro_scaleCorrection;
		float gyro_bais;

		BMI160HAL::accelRange_t accelerometerRange;
		float acc_x_offset;
		float acc_y_offset;
		float acc_z_offset;
		float acc_scaleCorrection;
		float sample_frequency;
	}sensorPolicy;

	/* @description sub command for this module
	 *
	 */
	typedef enum{
		NONE=0,
		ALL,
		ACCELERATION_IN_G,
		ANGULAR_VELOCITY_RPS,
		LINEAR_REGRESSION
	}SUB_CMD_e;


	/* @description contructor
	 * @param policy policy describing sensor configuration
	 * @return NA
	 */
	BMI160App(sensorPolicy& policy);

	/* @description destructor
	 * @param NA
	 * @return NA
	 */
	~BMI160App();

	/* @description gets sensor policy stored
	 * @param NA
	 * @return pointer sensor policy
	 */
	const sensorPolicy* getPolicy() const;

private:
	BMI160HAL* BMI160HALInstance;
	sensorPolicy* policy;

	/* @description device specific command processor
	 * @param cmd application main command
	 * @param subcmd sun command
	 * @param arg1 first argument
	 * @param arg1Size first argument size
	 * @return true if success, false on failure
	 *
	 */
	bool dev_specific_cmd_Processor(unsigned char cmd,unsigned char subcmd,void* arg1,size_t arg1Size);
};




#endif /* COMPONENTS_SENSORS_BMI160_APP_BMI160APP_H_ */
