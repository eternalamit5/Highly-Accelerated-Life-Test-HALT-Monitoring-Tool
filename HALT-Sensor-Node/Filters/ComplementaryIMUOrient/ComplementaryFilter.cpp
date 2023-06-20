/*
 * complementaryIMUOrient.cpp
 *
 *  Created on: Oct 14, 2020
 *      Author: amit
 */

#include "complementaryIMUOrient.h"
#include "commons.h"
#include "Arduino.h"

static char COMP_TAG[] = {"Comp filter:"};

complementaryIMU::complementaryIMU(complementaryIMU::policy &policy) : policySettings(policy), accAngleX(0), accAngleY(0), gyroAngleX(0), gyroAngleY(0),
                                                                       sampleRate(policy.sampleFreq), normTrustWeightAcc(0), normTrustWeightGyro(0), roll(0), pitch(0), yaw(0)
{

    this->normTrustWeightAcc = policySettings.trustWeightAccelerometer / (policySettings.trustWeightAccelerometer + policySettings.trustWeightGyroscope);
    this->normTrustWeightGyro = policySettings.trustWeightGyroscope / (policySettings.trustWeightAccelerometer + policySettings.trustWeightGyroscope);
}

void complementaryIMU::update(float gyrx, float gyry, float gyrz, float accx, float accy, float accz)
{

    if (policySettings.enable)
    {
        float elapsedTime = 1.0f / this->sampleRate;

        // Gyro angle calculation
        float gyroAngleX = this->roll + (gyrx * elapsedTime);  // degree
        float gyroAngleY = this->pitch + (gyry * elapsedTime); // degree

        // Acc angle calculation
        float accAngleX = atan2(accy, accz) * RAD_TO_DEG; // radian
        float accAngleY = atan2((-1 * accx), sqrt((accy * accy) + (accz * accz))) * RAD_TO_DEG;

        // fusion using complementary logic
        this->roll = (gyroAngleX * this->normTrustWeightGyro) + (accAngleX * this->normTrustWeightAcc);  // degree
        this->pitch = (gyroAngleY * this->normTrustWeightGyro) + (accAngleY * this->normTrustWeightAcc); // degree
        this->yaw = 0;                                                                                   // this->yaw + gyrz * elapsedTime;
    }
}

float complementaryIMU::getPitch() const
{
    return this->pitch;
}

float complementaryIMU::getRoll() const
{
    return this->roll;
}

float complementaryIMU::getYaw() const
{
    return this->yaw;
}

float complementaryIMU::getSampleRate() const
{
    return sampleRate;
}

void complementaryIMU::setSampleRate(float sampleRate)
{
    this->sampleRate = sampleRate;
}

float complementaryIMU::getPitchRadians() const
{
    return this->pitch * DEG_TO_RAD;
}

float complementaryIMU::getRollRadians() const
{
    return this->roll * DEG_TO_RAD;
}

float complementaryIMU::getYawRadians() const
{
    return this->yaw * DEG_TO_RAD;
}

bool complementaryIMU::isEnable() const
{
    return this->policySettings.enable;
}