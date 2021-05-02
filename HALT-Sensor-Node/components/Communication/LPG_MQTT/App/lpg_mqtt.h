/*
 * lpg_mqtt.h
 *
 *  Created on: Nov 27, 2019
 *      Author: karsh
 */

#ifndef COMPONENTS_LPG_MQTT_LPG_MQTT_H_
#define COMPONENTS_LPG_MQTT_LPG_MQTT_H_



#include "commons.h"
#include "mqtt_client.h"
#include "../components/ErrorHandler/errorHandler.h"

using namespace std;


typedef void(*mqttClientRecvDataCallback_t)(string topic,string data);

class mqttClient_t{
public:
	typedef enum{
		MQTT_CONNECTED=0,
		MQTT_DISCONNECTED=1
	}connectionStatus_t;

	typedef struct{
		string MQTTClient_URI;
		int MQTTClient_port;
		int MQTTClient_keepAliveTimeout;
		mqttClientRecvDataCallback_t MQTTClient_appEventCB;
		int MQTTClient_qos;
		bool MQTTClient_enableCleanSession;
		bool MQTTClient_enableAutoReconnect;
		string MQTTClient_lastWillTopic;
		string MQTTClient_lastWillMsg;
	}policy_t;

private:
	static mqttClient_t* instance;
	esp_mqtt_client_handle_t handle;
	esp_mqtt_client_config_t configuration;
	connectionStatus_t connectionStatus;
	mqttClientRecvDataCallback_t recvDataEventCB;
private:

	/**
	 * @brief constructor
	 * @details sets configuration and starts mqtt service.
	 * 			Following are tasks performed in this function
	 * 			#Task 1: set MQTT configuration
	 * 			#Task 2: set handle
	 * 			#Task 3: clear topic list
	 *
	 *
	 *
	 * @param uri:  universal resource indicator of endpoint (mqtt-broker) to which mqtt-client need to be connected.
	 * @param port: port number of endpoint (mqtt-broker) to which mqtt-client need to be connected.
	 * @param keepAliveInterval: time interval in seconds for sending keepAlive messages
	 * @param qos: quality of service (0,1,2)
	 * 					0: At most once
	 * 					1: At least once
	 * 					2: Exactly once
	 * @param enableCleanSession:
	 * 							True: 	When the clean session flag is set to true, the client does not want a persistent session.
	 * 									If the client disconnects for any reason, all information and messages that are queued from a
	 * 									previous persistent session are lost.
	 *
	 * 							False:  When the clean session flag is set to false, the broker creates a persistent session for the client.
	 * 									All information and messages are preserved until the next time that the client requests a clean session.
	 * 									If the clean session flag is set to false and the broker already has a session available for the client,
	 * 									it uses the existing session and delivers previously queued messages to the client.
	 * @param enableAutoReconnect:
	 * 							True:	Automatically tries to connect MQTT broker( endpoint) if connection is lost
	 * 							False:  Does not try to reconnect if connection is lost.
	 * @param lastWillTopic: last will topic is the last message topic sent to the mqtt broker (endpoint) before disconnection.
	 * @param lastWillMsg: last will message is the last message sent using last will topic to the mqtt broker (endpoint) before disconnection.
	 *
	 * @return None
	 * @see
	 *
	 */
	mqttClient_t(policy_t& policy);

	//Non copyable class
	mqttClient_t(const mqttClient_t& refObj)=delete;
	mqttClient_t& operator=(const mqttClient_t& refObj)=delete;
public:

	/**
	 * @brief startService
	 * @details sets configuration and starts mqtt service.
	 * 			Following are the tasks performed in this function
	 * 			#Task 1: check if mqtt-client service instance exists
	 * 			#Task 2: If not, the create a new instance for mqtt-client
	 * 			#Task 3: start mqtt-client service, if mqtt-service is not running.
	 *
	 * @param uri:  universal resource indicator of endpoint (mqtt-broker) to which mqtt-client need to be connected.
	 * @param port: port number of endpoint (mqtt-broker) to which mqtt-client need to be connected.
	 * @param keepAliveInterval: time interval in seconds for sending keepAlive messages
	 * @param qos: quality of service (0,1,2)
	 * 					0: At most once
	 * 					1: At least once
	 * 					2: Exactly once
	 * @param enableCleanSession:
	 * 							True: 	When the clean session flag is set to true, the client does not want a persistent session.
	 * 									If the client disconnects for any reason, all information and messages that are queued from a
	 * 									previous persistent session are lost.
	 *
	 * 							False:  When the clean session flag is set to false, the broker creates a persistent session for the client.
	 * 									All information and messages are preserved until the next time that the client requests a clean session.
	 * 									If the clean session flag is set to false and the broker already has a session available for the client,
	 * 									it uses the existing session and delivers previously queued messages to the client.
	 * @param enableAutoReconnect:
	 * 							True:	Automatically tries to connect MQTT broker( endpoint) if connection is lost
	 * 							False:  Does not try to reconnect if connection is lost.
	 * @param lastWillTopic: last will topic is the last message topic sent to the mqtt broker (endpoint) before disconnection.
	 * @param lastWillMsg: last will message is the last message sent using last will topic to the mqtt broker (endpoint) before disconnection.
	 *
	 * @return
	 * 			EMU_SUCCESS: On success
	 * 			EMU_FAILURE: On failure(Already running) or exception
	 * @see
	 *
	 */
	static mqttClient_t* startService(policy_t& policy);
	static mqttClient_t* startServiceBlockingCall(policy_t& policy, uint32_t timeoutsec=10);

	/* @brief stops mqtt service
	 * @param NA
	 * @return EMU_SUCCESS On success, other values on failure
	 *
	 */
	static emu_err_t stopService();
	static emu_err_t stopServiceBlockingCall(uint32_t timeoutsec=10);
	/**
	 * @brief gets instance of mqtt-client
	 * @details
	 * @return
	 * 			pointer to the mqtt-client instance, if mqtt-client service not started or destroyed the returns NULL
	 * @see
	 *
	 */
	static mqttClient_t* getInstance();

	static bool enableAutoReconnection();
	static bool disableAutoReconnection();
	/**
	 * @brief destructor to mqtt-client
	 * @details Following task are performed in this function
	 * 			#Task 1: Stop mqtt client service
	 * 			#Task 2: delete the mqtt-client instance
	 * @return None
	 *
	 * @see
	 *
	 */
	virtual ~mqttClient_t();

	/**
	 * @brief Publishes the mqtt message given the topic and message
	 * @details Following are task performed in this function
	 * 			#Task 1: get mqtt instance and check for NULL
	 * 			#Task 2: publish the topic with msg
	 *
	 *
	 * @param topic: mqtt topic that is to be published
	 * @param message: mqtt topic that is to be published in the topic
	 *
	 * @return
	 * 			EMU_SUCCESS: On success
	 * 			EMU_FAILURE: On failure or exception
	 * @see
	 *
	 */
	emu_err_t publish(string topic,string message);

	/**
	 * @brief Subscribes the mqtt message given the topic with mqtt-broker described by endpoint
	 * @details Following are task performed in this function
	 * 			#Task 1: get mqtt instance and check for NULL
	 * 			#Task 2: subscribe the topic with msg
	 *
	 *
	 * @param topic: mqtt topic that is to be subscribed *
	 *
	 * @return
	 * 			EMU_SUCCESS: On success
	 * 			EMU_FAILURE: On failure or exception
	 * @see
	 *
	 */
	emu_err_t subscribe(string topic);

	/**
	 * @brief getter for configuration attribute
	 * @param NA
	 * @return mqtt configuration
	 *
	 */
	const esp_mqtt_client_config_t& getConfiguration() const;

	/**
	 * @brief getter for connection status attribute
	 * @param NA
	 * @return mqtt connection status
	 */
	connectionStatus_t getConnectionStatus() const;

	/**
	 * @brief setter for connection status
	 * @param connectionStatus connection status
	 * @return NA
	 *
	 */
	void setConnectionStatus(connectionStatus_t connectionStatus);

	/**
	 * @brief getter for mqtt client handle
	 * @param NA
	 * @return esp_mqtt_client_handle_t mqtt client handle
	 */
	esp_mqtt_client_handle_t getHandle() const;

	/**
	 * @brief getter for application event callback
	 * @param NA
	 * @return mqtt event callback function
	 *
	 */
	mqttClientRecvDataCallback_t getRecvDataEventCb() const;

	/* @description register callback that will be called when event occurs
	 * 				Events can be receive mqtt message,
	 * 				disconnection, connection etc
	 *
	 * @param cb callback function
	 * @return true on success, false on failure
	 */
	bool registerRecvDataEventCb(mqttClientRecvDataCallback_t cb);

	/* @description deregister callback that will be called when event occurs
	 * @param NA
	 * @return true on success, false on failure
	 */
	bool degregisterRecvDataEventCb();
	/* @description reports error
	 * @param err error number
	 * @param message error message
	 * @return NA
	 */
	static void reportError(emu_err_t err,string message);

};
#endif /* COMPONENTS_LPG_MQTT_LPG_MQTT_H_ */
