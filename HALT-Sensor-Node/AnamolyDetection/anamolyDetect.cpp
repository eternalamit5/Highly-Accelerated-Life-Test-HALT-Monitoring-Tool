#include <math.h>
#include "anamolyDetect.h"

anamolyDetect::anamolyDetect(float measurement_err,float model_err, float convergence_factor):
				measurement_error(measurement_err),estimation_error(convergence_factor*measurement_err),model_error(model_err),
				currentEstimate(0),lastEstimate(0),gain(0),mahabolnis_distance(0),forgettingFactor(0.2),shapeParam(0.6) {
}

float anamolyDetect::updateDetection(float measurement){
  gain = estimation_error/(estimation_error + measurement_error);
  currentEstimate = lastEstimate + gain * (measurement - lastEstimate);
  estimation_error =  (1.0 - gain)*estimation_error + fabs(lastEstimate-currentEstimate)*model_error;
  lastEstimate=currentEstimate;
  mahabolnis_distance = (mahabolnis_distance*forgettingFactor) + ((1-forgettingFactor)*(sqrt(((measurement - lastEstimate)*(measurement - lastEstimate))/estimation_error)));
  return 1/(1+exp(-mahabolnis_distance+shapeParam));
}

void anamolyDetect::setMeasurementError(float measurement_error){
  this->measurement_error=measurement_error;
}

void anamolyDetect::setEstimateError(float estimation_error){
  this->estimation_error=estimation_error;
}

void anamolyDetect::setProcessNoise(float model_error){
  this->model_error=model_error;
}

float anamolyDetect::getGain(){
  return gain;
}

float anamolyDetect::getEstimateError(){
  return estimation_error;
}