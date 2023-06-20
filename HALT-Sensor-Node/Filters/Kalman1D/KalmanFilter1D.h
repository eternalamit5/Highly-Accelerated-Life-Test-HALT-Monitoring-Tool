

#ifndef kalmanFilter1D_h
#define kalmanFilter1D_h

#include "commons.h"

class kalmanFilter1D
{

public:
    kalmanFilter1D(float measurement_err = 1, float model_err = 0.1, float convergence_factor = 1);
    float updateEstimate(float measurement);
    void setMeasurementError(float measurement_error);
    void setEstimateError(float estimation_error);
    void setProcessNoise(float model_error);
    float getKalmanGain();
    float getEstimateError();

private:
    float measurement_error;
    float estimation_error;
    float model_error;
    float currentEstimate;
    float lastEstimate;
    float kalmanGain;
};

class kalmanIn3Axis
{
public:
    typedef struct
    {
        bool enable;
        float modelError_Xaxis;
        float modelError_Yaxis;
        float modelError_Zaxis;
        float measurementError_Xaxis;
        float measurementError_Yaxis;
        float measurementError_Zaxis;
        float convergenceFactor_Xaxis;
        float convergenceFactor_Yaxis;
        float convergenceFactor_Zaxis;
    } policy;

private:
    policy &filterPolicy;
    kalmanFilter1D *x;
    kalmanFilter1D *y;
    kalmanFilter1D *z;

public:
    kalmanIn3Axis(policy &kalmanPolicy) : filterPolicy(kalmanPolicy), x(NULL), y(NULL), z(NULL)
    {
        x = new kalmanFilter1D(kalmanPolicy.measurementError_Xaxis, kalmanPolicy.modelError_Xaxis, kalmanPolicy.convergenceFactor_Xaxis);
        y = new kalmanFilter1D(kalmanPolicy.measurementError_Yaxis, kalmanPolicy.modelError_Yaxis, kalmanPolicy.convergenceFactor_Yaxis);
        z = new kalmanFilter1D(kalmanPolicy.measurementError_Zaxis, kalmanPolicy.modelError_Zaxis, kalmanPolicy.convergenceFactor_Zaxis);
    }

    void updateFilter(float val_x, float val_y, float val_z, float &res_x, float &res_y, float &res_z)
    {
        if (filterPolicy.enable)
        {
            res_x = x->updateEstimate(val_x);
            res_y = y->updateEstimate(val_y);
            res_z = z->updateEstimate(val_z);
        }
        else
        {
            res_x = val_x;
            res_y = val_y;
            res_z = val_z;
        }
    }

    bool isEnabled()
    {
        return this->filterPolicy.enable;
    }
};
#endif
