/*
 * errorHandler.cpp
 *
 *  Created on: Sep 21, 2019
 *  Author: karsh
 */
#include "errorHandler.h"
#include "commons.h"


static char ERR_HANDLER_TAG[]="Error handler: ";

errorHandler* errorHandler::instance=NULL;

errorHandler* errorHandler::startService(errorHandler::error_policy_t& policy){
	if(errorHandler::instance==NULL){
		errorHandler::instance = new errorHandler(policy);
		if(errorHandler::instance==NULL){
			logi(ERR_HANDLER_TAG,"Fail to start error handler service");
			abort();
		}
	}

	return errorHandler::instance;
}


void errorHandler::stopService(){
	if(errorHandler::instance!=NULL){
		delete errorHandler::instance;
		errorHandler::instance=NULL;
	}
}


errorHandler* errorHandler::getInstance(){
	return errorHandler::instance;
}

errorHandler::errorHandler(error_policy_t& policy):policy(policy){

}

errorHandler::~errorHandler(){

}

void errorHandler::process(emu_err_t error, appErrorCallback cb,void* arg1,size_t arg1Size)  {
	if(cb!=NULL){
		cb(error,arg1,arg1Size);
	}

	errorHandler* errHandler = errorHandler::getInstance();

	if(errHandler!=NULL){
		switch(errHandler->getErrorCategory(error)){
		case ERROR_MAJOR:
			errHandler->perform_action(errHandler->policy.error_major);
			break;
		case ERROR_MINOR:
			errHandler->perform_action(errHandler->policy.error_minor);
			break;
		case WARN_MAJOR:
			errHandler->perform_action(errHandler->policy.warn_major);
			break;
		case WARN_MINOR:
			errHandler->perform_action(errHandler->policy.error_minor);
			break;
		default:
			break;
		}
	}
}


errorHandler::error_category_t errorHandler::getErrorCategory(emu_err_t error)  {
	if(error>=EMU_ERROR_MAJOR && error<EMU_SUCCESS)
		return ERROR_MAJOR;
	else if(error>=EMU_ERROR_MINOR && error<EMU_ERROR_MAJOR)
		return ERROR_MINOR;
	else if(error>=EMU_WARN_MAJOR && error<EMU_ERROR_MINOR)
		return WARN_MAJOR;
	else
		return WARN_MINOR;

}


void errorHandler::perform_action(error_reporting_action_e action)  {

}





