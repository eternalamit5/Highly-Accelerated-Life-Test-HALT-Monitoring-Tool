

#ifndef anamolyDetect_h
#define anamolyDetect_h
#include "commons.h"

class anamolyDetect
{

public:
  anamolyDetect(float measurement_err=1,float model_err=0.1,float convergence_factor=1);
  float updateDetection(float measurement);
  void setMeasurementError(float measurement_error);
  void setEstimateError(float estimation_error);
  void setProcessNoise(float model_error);
  float getGain();
  float getEstimateError();

private:
  float measurement_error;
  float estimation_error;
  float model_error;
  float currentEstimate;
  float lastEstimate;
  float gain;
  float mahabolnis_distance;
  float forgettingFactor;
  float shapeParam;
};

class anamolyIn3Axis{
public:
	typedef struct{
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
	}policy;

private:
	policy& anamolyPolicy;
	anamolyDetect* x;
	anamolyDetect* y;
	anamolyDetect* z;
public:
	anamolyIn3Axis(policy& anamolyPolicy):anamolyPolicy(anamolyPolicy),x(NULL),y(NULL),z(NULL){

		x = new anamolyDetect(anamolyPolicy.measurementError_Xaxis,anamolyPolicy.modelError_Xaxis,anamolyPolicy.convergenceFactor_Xaxis);
		y = new anamolyDetect(anamolyPolicy.measurementError_Yaxis,anamolyPolicy.modelError_Yaxis,anamolyPolicy.convergenceFactor_Yaxis);
		z = new anamolyDetect(anamolyPolicy.measurementError_Zaxis,anamolyPolicy.modelError_Zaxis,anamolyPolicy.convergenceFactor_Zaxis);
	}

	void updateDetection(float val_x, float val_y, float val_z, float& res_x, float& res_y, float& res_z){
		if(this->anamolyPolicy.enable){
			res_x = x->updateDetection(val_x);
			res_y = y->updateDetection(val_y);
			res_z = z->updateDetection(val_z);

		}else{
			res_x = val_x;
			res_y = val_y;
			res_z = val_z;
		}
	}

	bool isEnabled(){
		return this->anamolyPolicy.enable;
	}
};


#endif
