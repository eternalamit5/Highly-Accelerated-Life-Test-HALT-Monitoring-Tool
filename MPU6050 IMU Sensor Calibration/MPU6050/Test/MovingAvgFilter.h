/*
 * MovingAvgFilter.h
 *
 *  Created on: Mar 6, 2020
 *      Author: biba
 */

#ifndef COMPONENTS_MPU6050_MOVINGAVGFILTER_MOVINGAVGFILTER_H_
#define COMPONENTS_MPU6050_MOVINGAVGFILTER_MOVINGAVGFILTER_H_



/******
 * Moving average filter.
 *
 *
 ******/

#define MAX_DATA_POINTS 2000

class MovingAverageFilter
{
public:
  //construct without coefs
  MovingAverageFilter(unsigned int newDataPointsCount);

  float process(float *in);

private:
  float values[MAX_DATA_POINTS];
  int k; // k stores the index of the current array read to create a circular memory through the array
  int dataPointsCount;
  float out;
  int i; // just a loop counter
};

/******
 * Moving average recursive filter.
 *
 *
 ******/
extern int RecursiveMovingAvgFilter(float, int);


#endif /* COMPONENTS_MPU6050_MOVINGAVGFILTER_MOVINGAVGFILTER_H_ */
