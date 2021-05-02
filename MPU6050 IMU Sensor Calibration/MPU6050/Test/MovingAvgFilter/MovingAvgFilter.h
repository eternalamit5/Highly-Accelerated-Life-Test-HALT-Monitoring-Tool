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

//extern int MovingAvgFilter(int, int);

//extern unsigned int MovingAvgFilter(unsigned int, int);

//extern char MovingAvgFilter(char , int);
//extern unsigned char MovingAvgFilter(unsigned char , int);
//extern long MovingAvgFilter(long , int);
//extern unsigned long MovingAvgFilter(unsigned long , int);
extern float MovingAvgFilter(float *, int);




/******
 * Moving average recursive filter.
 *
 *
 ******/
extern int RecursiveMovingAvgFilter(float, int);


#endif /* COMPONENTS_MPU6050_MOVINGAVGFILTER_MOVINGAVGFILTER_H_ */
