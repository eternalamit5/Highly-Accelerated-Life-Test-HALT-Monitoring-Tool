/*
 * MovingAvgFilter.cpp
 *
 *  Created on: Mar 6, 2020
 *      Author: biba
 */

#include "MovingAvgFilter.h"

//Moving average filter.

float MovingAvgFilter(float *a, int count)
{
	int N=count;
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

/*

int MovingAvgFilter(int a, int count)
{
	int N=count;
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



unsigned int MovingAvgFilter(unsigned int a , int count)
{
	int N=count;
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
char MovingAvgFilter(char a, int count)
{
	int N=count;
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
unsigned char MovingAvgFilter(unsigned char a , int count)
{
	int N=count;
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
long MovingAvgFilter(long a, int count)
{
	int N=count;
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
unsigned long MovingAvgFilter(unsigned long a , int count)
{
	int N=count;
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

*/

//Moving average recursive filter.

int RecursiveMovingAvgFilter(int x, int count) {
	int N=count;
	static int n;
	static int m[N];
	static int y;
	y = y + (x * m[n]);
	m[n] = x;
	n = (n + 1) % N;
	return y / N;
}

