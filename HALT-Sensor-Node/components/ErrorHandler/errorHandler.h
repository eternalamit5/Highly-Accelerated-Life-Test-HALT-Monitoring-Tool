/*
 * errorHandler.h
 *
 *  Created on: Sep 21, 2019
 *  Author: karsh
 */

#ifndef MAIN_ERRORHANDLER_ERRORHANDLER_H_
#define MAIN_ERRORHANDLER_ERRORHANDLER_H_


#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include <string>


using namespace std;

/*     =============== >>>>   Error definition    <<<< ===========================*/
typedef enum{
	EMU_SUCCESS=0,
	EMU_ERROR_MAJOR=-30,
	EMU_ERR_OUT_OF_MEMORY,
	EMU_ERR_NULL,
	EMU_ERR_INVALID_ARG,
	EMU_ERR_STD_EXCEPT,
	EMU_FAILURE,
	EMU_ERROR_MINOR=-60,
	EMU_ERR_INIT_FAILED,
	EMU_WARN_MAJOR=-90,
	EMU_WARN_MINOR=-120,
}emu_err_t;



/***************************************
	class: errorHandler
***************************************/
/**
 * @brief
 * @details
 *
 *
 * @see
 *
 */
class errorHandler{
public:
	typedef enum{
		STD_EXCEPTION=0,
		ERROR_MAJOR,
		ERROR_MINOR,
		WARN_MAJOR,
		WARN_MINOR,
		NOT_AN_ERROR
	}error_category_t;


	typedef enum{
		TURN_LED_OFF=0,
		TURN_LED_ON,
		TOGGLE_LED_1HZ,
		TOGGLE_LED_2HZ,
		TOGGLE_LED_4HZ,
		TURN_LED_RED,
		TURN_LED_GREEN,
		TURN_LED_BLUE,
		TERMINATE,
		SPIN_FOREVER,
		SOFTWARE_RESET,
		SEND_ERROR_MSG_MQTT,
		SEND_ERROR_MSG_TCP,
		SEND_ERROR_MSG_WS,
		SEND_ERROR_MSG_BLE,
		SEND_ERROR_MSG_UART0,
		SEND_ERROR_MSG_UART1,
		SEND_ERROR_MSG_UART2,
		SEND_ERROR_MSG_I2C0,
		SEND_ERROR_MSG_I2C1,
		SEND_ERROR_MSG_HSSPI,
		SEND_ERROR_MSG_LSSPI,
		SEND_ERROR_MSG_SD_CARD_LOGGER,
		JUST_SHOW_DEBUG_LOG
	}error_reporting_action_e;


	typedef struct{
		error_reporting_action_e std_exception;
		error_reporting_action_e error_major;
		error_reporting_action_e error_minor;
		error_reporting_action_e warn_major;
		error_reporting_action_e warn_minor;
	}error_policy_t;

	typedef void (appErrorCallback)(emu_err_t error,void* arg1,size_t arg1Size);

private:
	error_policy_t& policy;
	static errorHandler* instance;
private:
	error_category_t getErrorCategory(emu_err_t error);
	void perform_action(error_reporting_action_e action);
	errorHandler(error_policy_t& policy);
public:

	static errorHandler* getInstance();
	static errorHandler* startService(error_policy_t& policy);
	static void stopService();
	~errorHandler();
	static void process(emu_err_t error,appErrorCallback cb,void* arg1,size_t arg1Size);
};


#endif /* MAIN_ERRORHANDLER_ERRORHANDLER_H_ */
