#include <math.h>
#include "./kalmanFilter1D.h"

kalmanFilter1D::kalmanFilter1D(float measurement_err, float model_err, float convergence_factor) : measurement_error(measurement_err), estimation_error(convergence_factor * measurement_err), model_error(model_err),
                                                                                                   currentEstimate(0), lastEstimate(0), kalmanGain(0)
{
}

float kalmanFilter1D::updateEstimate(float measurement)
{
    kalmanGain = estimation_error / (estimation_error + measurement_error);
    currentEstimate = lastEstimate + kalmanGain * (measurement - lastEstimate);
    estimation_error = (1.0 - kalmanGain) * estimation_error + fabs(lastEstimate - currentEstimate) * model_error;
    lastEstimate = currentEstimate;
    return currentEstimate;
}

void kalmanFilter1D::setMeasurementError(float measurement_error)
{
    this->measurement_error = measurement_error;
}

void kalmanFilter1D::setEstimateError(float estimation_error)
{
    this->estimation_error = estimation_error;
}

void kalmanFilter1D::setProcessNoise(float model_error)
{
    this->model_error = model_error;
}

float kalmanFilter1D::getKalmanGain()
{
    return kalmanGain;
}

float kalmanFilter1D::getEstimateError()
{
    return estimation_error;
}