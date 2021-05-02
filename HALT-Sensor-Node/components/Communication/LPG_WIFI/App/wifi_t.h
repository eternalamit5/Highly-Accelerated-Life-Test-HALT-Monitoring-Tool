/*
 * lpg_wifi.h
 *
 *  Created on: Nov 25, 2019
 *      Author: karsh
 */

#ifndef COMPONENTS_LPG_WIFI_LPG_WIFI_H_
#define COMPONENTS_LPG_WIFI_LPG_WIFI_H_


#include "commons.h"
#include "../components/ErrorHandler/errorHandler.h"
#include "wifiAppUserCallback.h"

using namespace std;

class wifi_t{

public:

	typedef void(*wifiDisconnectionUserAppCb_t)(void* arg);
	typedef void (*wifiConnectionUserAppCb_t)(void* arg);

	/* @description smart wifi connect connection status
	 *
	 */
	typedef enum{
		DEACTIVATED=0,
		STOP_SCAN,
		SCANNING
	}smartConnectStatus_e;

	/* @description wifi connection status
	 *
	 */
	typedef enum{
		CONNECTED=0,
		DISCONNECTED
	}wifiConnectStatus_e;

private:
	wifi_t(const wifi_t& refObj)=delete;
	wifi_t& operator=(const wifi_t& refObj)=delete;

private:
	/**
	 * @brief constructor
	 * @details Inits the wifi attributes
	 * 			Wifi connection is described by following attributes
	 * 			#ssid: ssid of the access point
	 * 			#password: password of the access point
	 * 			#ip address: IP address recieved from the access point
	 * 			#reconnectAttempt: Number of attempts to connect the access point
	 * 			#connection status: connection status
	 */
	wifi_t(bool enableSmartConnect,uint8_t reconnectAttempt,string ssid,string pwd);

public:
	/* @description destructor
	 * @param NA
	 * @return NA
	 */
	~wifi_t();


	/* @description Starts Wifi service
	 * @param enableSmartConnect if true enable smart connect feature, if false disables it.
	 * @param ssid ssid of the router we wish to connect
	 * @param pwd password of the router we wish to connect
	 * @return instance object of lpg_wifi class
	 */
	static wifi_t* startService(bool enableSmartConnect,uint8_t reconnectAttempt=5,string ssid="",string pwd="");
	static wifi_t* startServiceBlockingCall(bool enableSmartConnect,uint8_t reconnectAttempt=5,string ssid="",string pwd="",uint32_t timeoutsec=10);
	/* @description stop wifi service
	 * @param NA
	 * @return error status
	 *
	 */
	static bool stopService();
	static bool stopServiceBlockingCall(uint32_t timeoutsec=10);
	/* @description gets instance object of lpg_wifi class
	 * @param NA
	 * @return instance of lpg_wifi class
	 *
	 */
	static wifi_t* getInstance();

	/* @description reconnect wifi
	 * @param NA
	 * @return error status
	 *
	 */
	static emu_err_t reconnect();

	/* @description get wifi connection status
	 * @param NA
	 * @return wifi connection status
	 *
	 */
	static wifiConnectStatus_e getWifiConnectionStatus();


	/* @description gets IP address
	 * @param NA
	 * @return IP address in string format
	 */
	const string& getIp() const;

	/* @description sets IP address
	 * @param ip ip address in string format
	 * @return NA
	 */
	void setIp(const string &ip);

	/* @description gets wifi password
	 * @param NA
	 * @return wifi password in string format
	 */
	const string& getPassword() const;


	/* @description sets wifi password
	 * @param password password in string format
	 * @return NA
	 */
	void setPassword(string &password);

	/* @description Gets wifi SSID
	 * @param NA
	 * @return ssid in string format
	 */
	const string& getSsid() const;

	/* @description sets SSID password
	 * @param ssid ssid in string format
	 * @return NA
	 */
	void setSsid(string &ssid);

	/*
	 *
	 */
	static bool registerDisconnectionCb(wifiDisconnectionUserAppCb_t cb);

	/*
	 *
	 */
	static bool registerConnectionCb(wifiConnectionUserAppCb_t cb);

	/*
	 *
	 */
	static void deregisterDisconnectionCb();

	/*
	 *
	 */
	static void deregisterConnectionCb();

	/* @description gets wifi connect status
	 * @param NA
	 * @return wifi connection status
	 */
	wifiConnectStatus_e getConnectionStatus();

	/* @description disconnect wifi
	 * @param NA
	 * @return error status
	 *
	 */
	emu_err_t disconnect();

	/* @description sets smart wifi connect status
	 * @param smart wifi connection status
	 * @return NA
	 */
	void setConnectionStatus(wifiConnectStatus_e connectionStatus);

	bool isTryReconnect() const;

	/* @description gets number of reconnect attempts
	 * @param NA
	 * @return number of reconnect attempts
	 */
	uint8_t getReconnectAttempt() const;

	/* @description sets number of reconnect attempts
	 * @param reconnectAttempt number of reconnect attempt
	 * @return NA
	 */
	void setReconnectAttempt(uint8_t reconnectAttempt);



public:

	//================ SMart connect features ===============
	/* @description stops smart wifi connect task
	 * @param NA
	 * @return true on success, false on failure
	 *
	 */
	static bool stopSmartConnectTask();

	/* @description gets smart wifi connect status
	 * @param NA
	 * @return smart wifi connect status
	 */
	static wifi_t::smartConnectStatus_e getSmartConnectStatus();

	/* @description check if smart wifi connect is enabled or disabled
	 * @param NA
	 * @return true on success, false on failure
	 */
	bool isSmartConnectActive() const;

	/* @description enable/disables smart wifi connect features
	 * @param enableSmartConnect true to enable , false to disable  smart wifi connect feature
	 * @return NAwifiDisconnectionUserAppCB
	 */
	void setSmartConnectActivationStatus(bool enableSmartConnect);

	/* @description reports error
	 * @param err error number
	 * @param message error message
	 * @return NA
	 */
	void reportError(emu_err_t err,string message);


private:
	static wifi_t* instance;
	string ssid;
	string password;
	string ip;
	uint8_t reconnectAttempt;
	const uint8_t maxReconnectAttempt;
	wifiConnectStatus_e connectionStatus;
	bool enableSmartConnect;
	bool tryReconnect;

public:
	static smartConnectStatus_e smart_wifi_connectionStatus;
	static wifiDisconnectionUserAppCb_t disconnectionUserAppcb;
	static wifiConnectionUserAppCb_t connectionUserAppcb;
};

#endif /* COMPONENTS_LPG_WIFI_LPG_WIFI_H_ */
