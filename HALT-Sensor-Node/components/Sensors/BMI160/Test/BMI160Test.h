/*
 * BMI160Test.h
 *
 *  Created on: Nov 29, 2019
 *      Author: karsh
 */

#ifndef COMPONENTS_BMI160_TEST_BMI160TEST_H_
#define COMPONENTS_BMI160_TEST_BMI160TEST_H_

#include "../components/Sensors/BMI160/App/BMI160App.h"

void motionSensingTask(void* arg);
extern SemaphoreHandle_t motionTelemetrySemHandle;

#endif /* COMPONENTS_BMI160_TEST_BMI160TEST_H_ */
