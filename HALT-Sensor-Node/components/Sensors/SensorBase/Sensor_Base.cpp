/*
 * BME280_Task.cpp
 *
 *  Created on: Mar 2, 2020
 *      Author: karsh
 */

#include "../SensorBase/Sensor_Base.h"

using namespace std;


static char SENSOR_TASK_TAG[]="Sensor Base: ";

extern "C"{
	/* @description sensorTimerCB is a callback function called when periodic timer of the sensor instance elapses
	 * @param arg argument to the function, this is usually the calling object
	 * @return NA
	 */
	static void sensorTimerCB(void* arg);
	void sensorTimerCB(void* arg) {
		logi(SENSOR_TASK_TAG,"{sensorLoop}, running");
		SensorBase* task_instance = (SensorBase*)arg;
		SensorBase::sensor_loop_cb_t callback = task_instance->getTimerCb();
		if(callback != NULL){
			callback(arg);
		}
	}
}



/* @description constructor
 * @param sensorElementID ID assigned to sensor element
 * @param desc description of the sensor
 * @param dataPrefix prefix string that is attached before the data
 * @return NA
 *
 */
SensorBase::SensorBase(string sensorElementID,string desc,string dataPrefix,float sampleRate):
		ID(sensorElementID),description(desc),sampleRate(sampleRate),dataPrefix(dataPrefix),periodicTimer(NULL),timer_cb(NULL),isPeriodicTimerRunning(false),userApp_cb(NULL) {

	/*Get sensor comm interface*/
	comm = comm_hardware::getInstance();
	if(comm==NULL){
		reportError(EMU_ERR_NULL,"Communication interface can't be NULL");
		abort();
	}

	/*set config parameter for periodic timer*/
	string taskName=string("SensorTask_elementID_")+ sensorElementID;
	const esp_timer_create_args_t periodic_timer_args = { // @suppress("Invalid arguments")
			.callback = sensorTimerCB,
			.arg = this,
			.dispatch_method = ESP_TIMER_TASK,
			.name = taskName.c_str()
	};

	//create periodic timer
	if(esp_timer_create(&periodic_timer_args, &this->periodicTimer)!=ESP_OK){
		reportError( EMU_FAILURE,"Failed to create periodic timer");
		abort();
	}

	//verify creation of periodic timer
	if(periodicTimer==NULL){
		reportError(EMU_ERR_OUT_OF_MEMORY, "periodic timer instance can't be NULL");
		abort();
	}
}




/* @description destructor
 * @param NA
 * @return NA
 */
SensorBase::~SensorBase() {

	//stop timer before deleting the object
	if(this->isPeriodicTimerRunning==true){
		esp_timer_stop(this->periodicTimer);
		this->isPeriodicTimerRunning=false;
	}
}




/* @description Command processor for sensor
 * @param cmd application main command
 * @param subcmd sub command
 * @param arg1 first argument
 * @param arg1Size size of first argument
 * @return true on success , false on failure
 *
 */
bool SensorBase::processor(unsigned char cmd,unsigned char subcmd,void* arg1,size_t arg1Size){

	bool ret=false;
	switch(cmd){
		case START:
		case STOP:
		case UPDATE_DATA_PREFIX:
		case UPDATE_DESCRIPTION:
		case UPDATE_SAMPLE_RATE:
			ret=this->generalCmdProcessor(cmd,arg1,arg1Size);
			break;
		case MEASURE:
		case CALIBRATE:
			ret=this->dev_specific_cmd_Processor(cmd,subcmd,arg1,arg1Size);
			break;
		default:
			logw(SENSOR_TASK_TAG,"{processor}, unknown command");
			break;
	}
	return ret;
}

/* @description generalCmdProcessor Command processor for sensor
 * @param cmd application main command
 * @param subcmd sub command
 * @param arg1 first argument
 * @param arg1Size size of first argument
 * @return true on success , false on failure
 *
 */
bool SensorBase::generalCmdProcessor(unsigned char cmd,void* arg1,size_t arg1Size){
	bool ret=true;

	switch(cmd){

		case START:
				//update sample rate from arg1, if passed
				if(ret){
					if(arg1!=NULL && arg1Size==sizeof(float)){
						this->sampleRate = *((float*)(arg1));
					}else{
						ret = false;
					}
				}

				//start periodic timer if sample rate is configured and timer is not running already
				if(ret){
					if(this->sampleRate>0 && this->isPeriodicTimerRunning==false){
						uint64_t ticksCount = (1/this->sampleRate)*1000.0*1000.0;
						if(esp_timer_start_periodic(this->periodicTimer, ticksCount)!=ESP_OK){
							 reportError(EMU_FAILURE,"Failed start periodic timer");
							 ret = false;
						}
					}
				}

				if(ret){
					this->isPeriodicTimerRunning=true;
					logi(SENSOR_TASK_TAG,"START, new sample rate = "<<this->sampleRate);
				}
			break;
		case STOP:
				//Stop periodic timer if running
				if(ret){
					if(this->isPeriodicTimerRunning==true){
						if(esp_timer_stop(this->periodicTimer)!=ESP_OK){
							reportError(EMU_FAILURE,"Failed start periodic timer");
							ret = false;
						}
					}
				}

				if(ret){
					this->isPeriodicTimerRunning=false;
					logi(SENSOR_TASK_TAG,"{configuration_cmd_Processor},STOP");
				}
			break;
		case UPDATE_SAMPLE_RATE:
				//Stop periodic timer if running
				if(ret){
					if(this->isPeriodicTimerRunning==true){
						if(esp_timer_stop(this->periodicTimer)!=ESP_OK){
							reportError(EMU_FAILURE,"Failed start periodic timer");
							ret = false;
						}
					}
				}

				if(ret){
					this->isPeriodicTimerRunning=false;
				}


				//update sample rate from arg1, if passed
				if(ret){
					if(arg1!=NULL && arg1Size==sizeof(float)){
							this->sampleRate = *((float*)(arg1));
					}
				}

				//start periodic timer if sample rate is configured and timer is not running already
				if(ret){
					if(this->sampleRate>0 && this->isPeriodicTimerRunning==false){
						uint64_t ticksCount = (1/this->sampleRate)*1000.0*1000.0;
						if(esp_timer_start_periodic(this->periodicTimer, ticksCount)!=ESP_OK){
							reportError(EMU_FAILURE,"Failed start periodic timer");
							ret = false;
						}

					}
				}

				if(ret){
					this->isPeriodicTimerRunning=true;
					logi(SENSOR_TASK_TAG,"{configuration_cmd_Processor},UPDATE_SAMPLE_RATE, new sample rate = "<<this->sampleRate);
				}
			break;
		case UPDATE_DESCRIPTION:
				//Stop periodic timer if running
				if(ret){
					if(this->isPeriodicTimerRunning==true){
						if(esp_timer_stop(this->periodicTimer)!=ESP_OK){
							reportError(EMU_FAILURE,"Failed start periodic timer");
							ret = false;
						}
					}
				}

				if(ret){
					this->isPeriodicTimerRunning=false;
				}

				//update description, if passed
				if(ret){
					this->description.assign(*(std::string*)arg1);
				}

				//start periodic timer if sample rate is configured and timer is not running already
				if(ret){
					if(this->sampleRate>0 && this->isPeriodicTimerRunning==false){
						if(esp_timer_start_periodic(this->periodicTimer, (uint64_t)((1/this->sampleRate)*1000*1000))!=ESP_OK){
							reportError(EMU_FAILURE,"Failed start periodic timer");
							ret = false;
						}

					}
				}

				if(ret){
					this->isPeriodicTimerRunning=true;
					logi(SENSOR_TASK_TAG,"{configuration_cmd_Processor},UPDATE_DESCRIPTION, new description="<<this->description.c_str());
				}
			break;
		case UPDATE_DATA_PREFIX:
				//Stop periodic timer if running
				if(ret){
					if(this->isPeriodicTimerRunning==true){
						if(esp_timer_stop(this->periodicTimer)!=ESP_OK){
							reportError(EMU_FAILURE,"Failed start periodic timer");
							ret = false;
						}
					}
				}

				if(ret){
					this->isPeriodicTimerRunning=false;
				}

				//update data prefix, if passed
				if(ret){
					this->dataPrefix.assign(*(std::string*)arg1);
				}

				//start periodic timer if sample rate is configured and timer is not running already
				if(ret){
					if(this->sampleRate>0 && this->isPeriodicTimerRunning==false){
						if(esp_timer_start_periodic(this->periodicTimer, (uint64_t)((1/this->sampleRate)*1000*1000))!=ESP_OK){
							reportError(EMU_FAILURE,"Failed start periodic timer");
							ret = false;
						}

					}
				}

				if(ret){
					this->isPeriodicTimerRunning=true;
					logi(SENSOR_TASK_TAG,"{configuration_cmd_Processor},UPDATE_DATA_PREFIX, new data_prefix="<<this->dataPrefix.c_str());
				}
			break;
		default:
				logi(SENSOR_TASK_TAG,"{configuration_cmd_Processor},command Unknown");
			break;
	}

	return ret;
}



/* @description registers periodic Timer Callback
 * @param cbFunc callback function
 * @return true on success , false on failure
 *
 */
bool SensorBase::registerTimerCB(sensor_loop_cb_t cbFunc)  {
	if(cbFunc != NULL){
		this->timer_cb=cbFunc;
		return true;
	}
	return false;
}

/* @description de-register periodic timer callback function
 * @param NA
 * @return NA
 *
 */
void SensorBase::deregisterTimerCB()  {
	this->timer_cb = NULL;
}


/* @description registers user application Callback
 * @param cbFunc callback function
 * @return true on success , false on failure
 *
 */
bool SensorBase::registerUserAppCB(user_app_cb_t cbFunc)  {
	if(cbFunc != NULL){
		this->userApp_cb=cbFunc;
		return true;
	}
	return false;
}

/* @description de-register user application callback function
 * @param NA
 * @return NA
 *
 */
void SensorBase::deregisterUserAppCB()  {
	this->userApp_cb = NULL;
}

void SensorBase::runUserApp(){
	if(this->userApp_cb != NULL){
		this->userApp_cb(this);
	}
}

/* @description reports error
 * @param err error number
 * @param message error message
 * @return NA
 */
void SensorBase::reportError(emu_err_t err,string message){
	logw(SENSOR_TASK_TAG,message<<", Exception Number: "<<to_string(err));
}


/*
 *
 */
const string& SensorBase::getMeasurementType() const {
	return dataPrefix;
}


/*
 *
 */
const string& SensorBase::getDescription() const {
	return description;
}


/*
 *
 */
string SensorBase::getId() const {
	return ID;
}



/*
 *
 */
uint16_t SensorBase::getSampleRate() const {
	return sampleRate;
}


/*
 *
 */
const SensorBase::sensor_loop_cb_t& SensorBase::getTimerCb() const {
	return timer_cb;
}

