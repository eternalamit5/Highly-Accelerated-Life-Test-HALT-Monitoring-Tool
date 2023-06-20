/*
 * complementaryIMUOrient.h
 *
 *  Created on: Oct 14, 2020
 *      Author: amit
 */

#ifndef COMPONENTS_COMPLEMENTARYFILTERORIENTATION_COMPLEMENTARYIMUORIENT_H_
#define COMPONENTS_COMPLEMENTARYFILTERORIENTATION_COMPLEMENTARYIMUORIENT_H_

class complementaryIMU
{
public:
    typedef struct
    {
        bool enable;
        float sampleFreq;
        float xAxisAngle_error;
        float yAxisAngle_error;
        float zAxisAngle_error;
        float accelerometerError_x;
        float accelerometerError_y;
        float accelerometerError_z;
        float gyroscopeError_x;
        float gyroscopeError_y;
        float gyroscopeError_z;
        float trustWeightAccelerometer;
        float trustWeightGyroscope;
    } policy;

private:
    complementaryIMU::policy &policySettings;
    float accAngleX;
    float accAngleY;
    float gyroAngleX;
    float gyroAngleY;
    float sampleRate;
    float normTrustWeightAcc;
    float normTrustWeightGyro;
    float roll;
    float pitch;
    float yaw;

public:
    complementaryIMU(complementaryIMU::policy &policy);
    void update(float gyrx, float gyry, float gyrz, float accx, float accy, float accz);
    bool isEnable() const;
    float getPitch() const;
    float getRoll() const;
    float getYaw() const;
    float getPitchRadians() const;
    float getRollRadians() const;
    float getYawRadians() const;
    float getSampleRate() const;
    void setSampleRate(float sampleRate);
};

#endif /* COMPONENTS_COMPLEMENTARYFILTERORIENTATION_COMPLEMENTARYIMUORIENT_H_ */