/*
 * MovingAvgFilter.cpp
 *
 *  Created on: Mar 6, 2020
 *      Author: biba
 */

#include "MovingAvgFilter.h"

//Moving average filter.

int MovingAvgFilter(int a) {
	static int m[N];
	static int n;
	m[n] = a;
	n = (n + 1) % N;
	a = 0;
	for (int j = 0; j < N; j++) {
		a = a + m[j];
	}
	return a / N;
}


//Moving average recursive filter.

int RecursiveMovingAvgFilter(int x)
{ static int n;
static int m[N];
static int y;
y=y+(x*m[n]);
m[n]=x;
n=(n+1)%N;
return y/N;
}

