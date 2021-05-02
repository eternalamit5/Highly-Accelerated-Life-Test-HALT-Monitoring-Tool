/*
 * MovingAvgFilter.h
 *
 *  Created on: Mar 6, 2020
 *      Author: biba
 */

#ifndef COMPONENTS_MPU6050_MOVINGAVGFILTER_MOVINGAVGFILTER_H_
#define COMPONENTS_MPU6050_MOVINGAVGFILTER_MOVINGAVGFILTER_H_

#define N (4)

/******
 * Moving average filter.
 *
 *
 ******/

extern int MovingAvgFilter(int a);

/******
 * Moving average recursive filter.
 *
 *
 ******/
extern int RecursiveMovingAvgFilter(int x);


#endif /* COMPONENTS_MPU6050_MOVINGAVGFILTER_MOVINGAVGFILTER_H_ */
