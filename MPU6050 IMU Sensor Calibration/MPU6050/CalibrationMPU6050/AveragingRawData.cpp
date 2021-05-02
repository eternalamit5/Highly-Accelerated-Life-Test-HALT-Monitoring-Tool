/*
 * MPU6050_raw.cpp
 *
 *  Created on: Mar 4, 2020
 *      Author: amit
 */

// I2C device class (I2Cdev) demonstration Arduino sketch for MPU6050 class
// 10/7/2011 by Jeff Rowberg <jeff@rowberg.net>
// Updates should (hopefully) always be available at https://github.com/jrowberg/i2cdevlib
//
// Changelog:
//      2013-05-08 - added multiple output formats
//                 - added seamless Fastwire support
//      2011-10-07 - initial release
/* ============================================
 I2Cdev device library code is placed under the MIT license
 Copyright (c) 2011 Jeff Rowberg

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ===============================================
 */

// I2Cdev and MPU6050 must be installed as libraries, or else the .cpp/.h files
// for both classes must be in the include path of your project
#include "stdlib.h"
#include "string.h"
#include "../../../components/MPU6050/MPU6050.h"
#include "../../../components/arduino-esp32/libraries/Wire/src/Wire.h"
#include "../../../components/MPU6050/I2Cdev.h"

using namespace std;

int16_t sensor_temperature;
// Arduino Wire library is required if I2Cdev I2CDEV_ARDUINO_WIRE implementation
// is used in I2Cdev.h
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE

#endif

// class default I2C address is 0x68
// specific I2C addresses may be passed as a parameter here
// AD0 low = 0x68 (default for InvenSense evaluation board)
// AD0 high = 0x69
MPU6050 accelgyro;
//MPU6050 accelgyro(0x69); // <-- use for AD0 high

int16_t ax, ay, az;
int16_t gx, gy, gz;

//void printData();
// uncomment "OUTPUT_READABLE_ACCELGYRO" if you want to see a tab-separated
// list of the accel X/Y/Z and then gyro X/Y/Z values in decimal. Easy to read,
// not so easy to parse, and slow(er) over UART.
#define OUTPUT_READABLE_ACCELGYRO

// uncomment "OUTPUT_BINARY_ACCELGYRO" to send all 6 axes of data as 16-bit
// binary, one right after the other. This is very fast (as fast as possible
// without compression or data loss), and easy to parse, but impossible to read
// for a human.
//#define OUTPUT_BINARY_ACCELGYRO

#define LED_PIN 13
#define Acc_scaling_factor 16384
#define Gyro_scaling_factor 131
#define BUFFER_SIZE 200
bool blinkState = false;

float gyro[BUFFER_SIZE];

void mpusetup() {
	Serial.println("MPU 6050 Raw data Callibration TEST!");
	// join I2C bus (I2Cdev library doesn't do this automatically)
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
	Wire.begin();
#elif I2CDEV_IMPLEMENTATION == I2CDEV_BUILTIN_FASTWIRE
        Fastwire::setup(400, true);
    #endif

	// initialize serial communication
	// (38400 chosen because it works as well at 8MHz as it does at 16MHz, but
	// it's really up to you depending on your project)
	//Serial.begin(38400); remove since it has been declared once in the main function

	/* Initialize Device
	 //Gyro initialisation: Full-Scale Range =0 i.e. Sensitivity Scale Factor of 131 corresponds to
	 *  1 degree/rotation.
	 *  Acceleration initialisation: Full-Scale Range =0 i.e. Sensitivity Scale Factor of 16,384 corresponds
	 *   to +-2g acceleration
	 */
	Serial.println("Initializing I2C devices...");
	accelgyro.initialize();

	// verify connection
	Serial.println("\nMPU6050 Calibration");
	delay(2);
	Serial.println(
			"\nYour MPU6050 should be placed in horizontal position, with package letters facing up. \nDon't touch it until you see a finish message.\n");
	delay(3);
	Serial.println(
			accelgyro.testConnection() ?
					"MPU6050 connection successful" :
					"MPU6050 connection failed");

	// use the code below to change accel/gyro offset values
	/*

	 Serial.println("Updating internal sensor offsets...");
	 // -76	-2359	1688	0	0	0
	 Serial.print("Acc offset X:\t");Serial.print(accelgyro.getXAccelOffset()); Serial.print("\t"); // -76
	 Serial.print("Acc offset Y:\t");Serial.print(accelgyro.getYAccelOffset()); Serial.print("\t"); // -2359
	 Serial.print("Acc offset Z:\t");Serial.print(accelgyro.getZAccelOffset()); Serial.print("\t"); // 1688
	 Serial.print("Gyro offset X:\t");Serial.print(accelgyro.getXGyroOffset()); Serial.print("\t"); // 0
	 Serial.print("Gyro offset Y:\t");Serial.print(accelgyro.getYGyroOffset()); Serial.print("\t"); // 0
	 Serial.print("Gyro offset Z:\t");Serial.print(accelgyro.getZGyroOffset()); Serial.print("\t"); // 0
	 Serial.print("\n");
	 accelgyro.setXGyroOffset(220);
	 accelgyro.setYGyroOffset(76);
	 accelgyro.setZGyroOffset(-85);
	 Serial.print(accelgyro.getXAccelOffset()); Serial.print("\t"); // -76
	 Serial.print(accelgyro.getYAccelOffset()); Serial.print("\t"); // -2359
	 Serial.print(accelgyro.getZAccelOffset()); Serial.print("\t"); // 1688
	 Serial.print(accelgyro.getXGyroOffset()); Serial.print("\t"); // 0
	 Serial.print(accelgyro.getYGyroOffset()); Serial.print("\t"); // 0
	 Serial.print(accelgyro.getZGyroOffset()); Serial.print("\t"); // 0
	 Serial.print("\n");

	 */

}

void mpuRawCallibrationTask(void *arg) {
	mpusetup();
	const int samples = 5000;
	while (1) {
		//sensor_temperature = (accelgyro.getTemperature() + 12412) / 340;

		//accelgyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

		int loopCounter = 0;
		float avg_ax = 0;
		float avg_ay = 0;
		float avg_az = 0;
		float avg_gx = 0;
		float avg_gy = 0;
		float avg_gz = 0;
		int sampleNum = 0;

		float aax[BUFFER_SIZE];
		float aay[BUFFER_SIZE];
		float aaz[BUFFER_SIZE];
		float agx[BUFFER_SIZE];
		float agy[BUFFER_SIZE];
		float agz[BUFFER_SIZE];

		for (int i = 0; i < 20; i++) {

			for (loopCounter = 0; loopCounter < samples; loopCounter++) {
				// read raw accel/gyro measurements from device
				accelgyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

				avg_ax = (avg_ax + ax);
				avg_ay = (avg_ay + ay);
				avg_az = (avg_az + az);
				avg_gx = (avg_gx + gx);
				avg_gy = (avg_gy + gy);
				avg_gz = (avg_gz + gz);
				delay(1);
			}

			avg_ax /= samples;
			avg_ay /= samples;
			avg_az /= samples;
			avg_gx /= samples;
			avg_gy /= samples;
			avg_gz /= samples;

			//gyro[0]=avg_gx;
			//gyro[1]=avg_gy;
			//gyro[2]=avg_gz;
			aax[sampleNum] = avg_ax;
			aay[sampleNum] = avg_ay;
			aaz[sampleNum] = avg_az;
			agx[sampleNum] = avg_gx;
			agy[sampleNum] = avg_gy;
			agz[sampleNum] = avg_gz;

			sampleNum++;

			// if(sampleNum > 20) {
			//  sampleNum = 0;
			Serial.println("Raw Acceleration average value stored in the buffer");
			printf(" ACC_x[%d] is %f\n", i, aax[i]);
			printf(" ACC_y[%d] is %f\n", i, aay[i]);
			printf(" ACC_z[%d] is %f\n", i, aaz[i]);
			Serial.print("\n");
			Serial.print("\n");

			Serial.println("Raw Gyro average value stored in the buffer");
			printf(" Gyro_X[%d] is %f\n", i, agx[i]);
			printf(" Gyro_Y[%d] is %f\n", i, agy[i]);
			printf(" Gyro_Z[%d] is %f\n", i, agz[i]);
			Serial.print(
					"===========================================================================================================");
			Serial.print("\n");
		}

		//}

		/*for (int i=0;i<3;i++){
		 Serial.print(
		 "===========================================================================================================");
		 Serial.print("\n");

		 Serial.println("Raw gyro average value in the buffer");
		 printf(" Gyro_X is %f\n",gyro[0]);
		 printf(" Gyro_Y is %f\n", gyro[1]);
		 printf(" Gyro_Z is %f\n", gyro[2]);

		 Serial.print("\n");
		 Serial.print("\n");


		 }
		 */

		/*
		 Serial.print(
		 "===========================================================================================================");
		 Serial.print("\n");
		 Serial.println("Final Acc average value");
		 Serial.print("Acc(x):\t");
		 Serial.println(avg_ax/Acc_scaling_factor ); //Acc_scaling_factor
		 Serial.print("Acc(y):\t");
		 Serial.println(avg_ay/Acc_scaling_factor);
		 Serial.print("Acc(z):\t");
		 Serial.println(avg_az/Acc_scaling_factor);
		 Serial.print("\n");
		 Serial.print("\n");
		 Serial.println("Final Gyro average value");
		 Serial.print("Gyro(x):\t");
		 Serial.println(avg_gx /Gyro_scaling_factor); //Gyro_scaling_factor=131
		 Serial.print("Gyro(y):\t");
		 Serial.println(avg_gy / Gyro_scaling_factor);
		 Serial.print("Gyro(z):\t");
		 Serial.println(avg_gz / Gyro_scaling_factor);
		 Serial.print("\n");
		 Serial.print("\n");

		 */

#ifdef OUTPUT_READABLE_ACCELGYRO
		// display tab-separated accel/gyro x/y/z values

#endif

	}
}

/*void printData() {
 Serial.print(
 "===========================================================================================================");
 Serial.print("\n");
 Serial.print("temp: ");
 Serial.print(sensor_temperature);
 Serial.print("\t");
 Serial.print("Acc(x):\t");
 Serial.print(ax);
 Serial.print("\t");
 Serial.print("Acc(y):\t");
 Serial.print(ay);
 Serial.print("\t");
 Serial.print("Acc(z):\t");
 Serial.print(az);
 Serial.print("\t");
 Serial.print("Gyro(x):\t");
 Serial.print(gx);
 Serial.print("\t");
 Serial.print("Gyro(y):\t");
 Serial.print(gy);
 Serial.print("\t");
 Serial.print("Gyro(z):\t");
 Serial.println(gz);
 delay(500);
 Serial.print("\n");
 Serial.print("\n");
 Serial.print(
 "===========================================================================================================");
 Serial.print("\n");
 }
 Serial.print("Acc offset X:\t");
 Serial.print(off_ax);
 Serial.print("\t");
 Serial.print("Acc offset Y:\t");
 Serial.print(off_ay);
 Serial.print("\t");
 Serial.print("Acc offset Z:\t");
 Serial.print(off_az);
 Serial.print("\t");
 Serial.print("Gyro offset X:\t");
 Serial.print(off_gx);
 Serial.print("\t");
 Serial.print("Gyro offset Y:\t");
 Serial.print(off_gy);
 Serial.print("\t");
 Serial.print("Gyro offset Z:\t");
 Serial.print(off_gz);
 Serial.print("\t");
 Serial.print("\n");
 Serial.print("\n");
 Serial.print(
 "===========================================================================================================");


 }
 */

