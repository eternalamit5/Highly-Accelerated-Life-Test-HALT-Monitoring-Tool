/*
 * lpg_mqtt.cpp
 *
 *  Created on: Nov 27, 2019
 *      Author: karsh
 */
#include "lpg_mqtt.h"
#include "../components/Communication/peripheral_communication.h"
#include "mqtt_C_Binding.h"
#include "string.h"

static char MQTT_TAG[]={"MQTT: "};
mqttClient_t* mqttClient_t::instance=NULL;




/**
 * @brief mqtt_event_handler is the event handler for mqtt client
 *
 * @details Following are tasks performed in this function
 * 			#Task 1: get mqtt instance and check for NULL
 * 			#Task 2: Update parameters based on the event received
 * 			#Task 3: Call application specific event CB
 *
 * @param event: event received by the mqtt-client
 * @return
 * 			ESP_OK: if success
 * 			ESP_FAIL: On failure or exception
 *
 * @see
 *
 */



/* @details callback function called when there is an mqtt event
 *
 */
void mqtt_event_CB(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data) {
    esp_mqtt_event_t* event=(esp_mqtt_event_t*)event_data;

	//Task 1: get mqtt instance and check for NULL
	mqttClient_t* client=mqttClient_t::getInstance();
	if(client==NULL){
		mqttClient_t::reportError(EMU_ERR_NULL,"mqtt client failed to me created");
		return;
	}

	//Task 2: Update parameters based on the event recieved
	switch (event->event_id) {
		case MQTT_EVENT_CONNECTED:
			logi(MQTT_TAG, "{mqtt_event_handler}, {event:connected}");
			//Update the status
			client->setConnectionStatus(mqttClient_t::MQTT_CONNECTED);
			break;

		case MQTT_EVENT_DISCONNECTED:
			logi(MQTT_TAG, "{mqtt_event_handler}, {event:disconnected}");
			//update the status
			client->setConnectionStatus(mqttClient_t::MQTT_DISCONNECTED);
			break;

		case MQTT_EVENT_SUBSCRIBED:
			logi(MQTT_TAG, "{mqtt_event_handler}, {event:subscribed} msg_id="<< event->msg_id);
			break;

		case MQTT_EVENT_UNSUBSCRIBED:
			logi(MQTT_TAG, "{mqtt_event_handler}, {event:un-subscribed} msg_id="<< event->msg_id);
			break;

		case MQTT_EVENT_PUBLISHED:
			logi(MQTT_TAG, "{mqtt_event_handler}, {event:published} msg_id="<< event->msg_id);
			break;

		case MQTT_EVENT_DATA:
		{
//			logi(MQTT_TAG, "{mqtt_event_handler}, {event:received data}: "
//					"Topic len: "<< to_string(event->topic_len)<<
//					"topic: "<<event->topic<<
//					"data len: "<<event->data_len<<
//					"data: "<<event->data);


			string topic,data;
			topic.assign(event->topic,event->topic_len);
			data.assign(event->data,event->data_len);

			logi(MQTT_TAG, "event occured: received data event");
			if(client->getRecvDataEventCb()!=NULL){
				client->getRecvDataEventCb()(topic,data);
			}
		}
			break;

		case MQTT_EVENT_ERROR:
			logi(MQTT_TAG, "{mqtt_event_handler}, {event: error}");
			break;

		case MQTT_EVENT_BEFORE_CONNECT:
			logi(MQTT_TAG, "{mqtt_event_handler}, {event:before connect}");
			break;

		default:
			logi(MQTT_TAG, "{mqtt_event_handler}, {event:unknown}");
			break;
	}
}




/**
 * @brief constructor
 * @details sets configuration and starts mqtt service.
 * 			Following are tasks performed in this function
 * 			#Task 1: set MQTT configuration
 * 			#Task 2: set handle
 * 			#Task 3: add application event Handle
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
mqttClient_t::mqttClient_t(policy_t& policy):
				handle(NULL),
				connectionStatus(MQTT_DISCONNECTED),
				recvDataEventCB(NULL)
{
	//Task 1: set MQTT configuration
	this->configuration.uri = policy.MQTTClient_URI.c_str();
	this->configuration.port=policy.MQTTClient_port;
	this->configuration.keepalive = policy.MQTTClient_keepAliveTimeout;
	this->configuration.lwt_topic = policy.MQTTClient_lastWillTopic.c_str();
	this->configuration.lwt_msg = policy.MQTTClient_lastWillMsg.c_str();
	this->configuration.lwt_qos = policy.MQTTClient_qos;
	this->configuration.disable_clean_session =!policy.MQTTClient_enableCleanSession;
	this->configuration.disable_auto_reconnect = !policy.MQTTClient_enableAutoReconnect;

	//Task 2: set handle
	this->handle=mqtt_app_start(this->configuration.uri,this->configuration.port,this->configuration.keepalive,
			this->configuration.lwt_qos,this->configuration.disable_clean_session,this->configuration.disable_auto_reconnect,
			this->configuration.lwt_topic,this->configuration.lwt_msg);
	if(this->handle==NULL){
		reportError(EMU_ERR_NULL,"mqtt client failed to create");
		abort();
	}

	//Task 3: add application event Handle
	if(this->recvDataEventCB!=NULL){
		this->recvDataEventCB=policy.MQTTClient_appEventCB;
	}
}




/**
 * @brief destructor to mqtt-client
 * @details Following task are performed in this function
 * 			#Task 1: Stop mqtt client service
 * 			#Task 2: Destroy the mqtt client handle
 * 			#Task 3: delete the mqtt-client instance
 * @return None
 *
 * @see
 *
 */
mqttClient_t::~mqttClient_t()
{
	if(this->handle!=NULL){
		//Task 1: stop mqtt service for the mqtt client
		esp_mqtt_client_stop(this->handle);
		//Task 2: Destroy the mqtt client handle
		esp_mqtt_client_destroy(this->handle);
	}

	//Task 3: delete the mqtt-client instance
	if(this->instance!=NULL){
		delete this->instance;
	}
}






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
mqttClient_t* mqttClient_t::startService(policy_t& policy) {

	//Task 1: check if mqtt-client service instance exists
	if(mqttClient_t::instance==NULL){
		//Task 2: If not, the create a new instance for mqtt-client
		mqttClient_t::instance=new mqttClient_t(policy);
		if(mqttClient_t::instance==NULL){
			mqttClient_t::reportError(EMU_ERR_NULL,"mqtt client failed to me created");
			return NULL;
		}
	}

	//Task 3: start mqtt-client service, if mqtt-service is not running.
	if(mqttClient_t::instance->connectionStatus==MQTT_DISCONNECTED){
		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_ERROR,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_CONNECTED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_DISCONNECTED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_SUBSCRIBED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_UNSUBSCRIBED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_PUBLISHED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_DATA,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_BEFORE_CONNECT,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_start(mqttClient_t::instance->handle);
	}

	return mqttClient_t::instance;
}

mqttClient_t* mqttClient_t::startServiceBlockingCall(policy_t& policy, uint32_t timeoutsec) {

	//Task 1: check if mqtt-client service instance exists
	if(mqttClient_t::instance==NULL){
		//Task 2: If not, the create a new instance for mqtt-client
		mqttClient_t::instance=new mqttClient_t(policy);
		if(mqttClient_t::instance==NULL){
			mqttClient_t::reportError(EMU_ERR_NULL,"mqtt client failed to me created");
			return NULL;
		}
	}

	//Task 3: start mqtt-client service, if mqtt-service is not running.
	if(mqttClient_t::instance->connectionStatus==MQTT_DISCONNECTED){
		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_ERROR,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_CONNECTED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_DISCONNECTED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_SUBSCRIBED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_UNSUBSCRIBED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_PUBLISHED,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_DATA,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_register_event(mqttClient_t::instance->handle, MQTT_EVENT_BEFORE_CONNECT,
				mqtt_event_CB, (void*)mqttClient_t::instance->handle);

		esp_mqtt_client_start(mqttClient_t::instance->handle);
	}

	while((mqttClient_t::instance->connectionStatus==MQTT_DISCONNECTED)&&(timeoutsec>0)){
		vTaskDelay(1000);
		timeoutsec-=1;
	}

	if((mqttClient_t::instance->connectionStatus==MQTT_CONNECTED)){
		return mqttClient_t::instance;
	}

	return NULL;

}

/* @brief stops mqtt service
 * @param NA
 * @return EMU_SUCCESS On success, other values on failure
 *
 */
emu_err_t mqttClient_t::stopService() {

	//Task 1: stop mqtt client (does not destroy the handle)
	mqttClient_t* client=mqttClient_t::getInstance();
	if(client==NULL){
		return EMU_ERR_NULL;
	}
	esp_mqtt_client_stop(client->handle);
//	client->setConnectionStatus(MQTT_DISCONNECTED);

	return EMU_SUCCESS;
}

emu_err_t mqttClient_t::stopServiceBlockingCall(uint32_t timeoutsec) {

	//Task 1: stop mqtt client (does not destroy the handle)
	mqttClient_t* client=mqttClient_t::getInstance();
	if(client==NULL){
		return EMU_ERR_NULL;
	}
	esp_mqtt_client_stop(client->handle);
//	client->setConnectionStatus(MQTT_DISCONNECTED);

	while((mqttClient_t::instance->connectionStatus==MQTT_CONNECTED)&&(timeoutsec>0)){
		vTaskDelay(1000);
		timeoutsec-=1;
	}

	if((mqttClient_t::instance->connectionStatus==MQTT_DISCONNECTED)){
		return EMU_SUCCESS;
	}

	return EMU_FAILURE;
}

/**
 * @brief gets instance of mqtt-client
 * @details
 * @return
 * 			pointer to the mqtt-client instance, if mqtt-client service not started or destroyed the returns NULL
 * @see
 *
 */
mqttClient_t* mqttClient_t::getInstance() {
	return mqttClient_t::instance;
}

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
emu_err_t mqttClient_t::publish(string topic,string message) {

	//Task 1: get mqtt instance and check for NULL
	mqttClient_t* client=mqttClient_t::getInstance();
	if(client==NULL){
		return EMU_ERR_NULL;
	}

	//Task 2: publish the topic with msg
	/* About Data len : (last but two argument in 'esp_mqtt_client_publish' set as 0 by me)
	 * 					If set to 0 then message length is automatically set based on the payload.
	 * 					If fixed length messages are required then this parameter should be non-zero.
	 *
	 * About retain flag:(last argument in 'esp_mqtt_client_publish' set as false by me)
	 *
	 * 		Retained messages is used to store the “Last Good Message” on a topic. Usually,
	 * 		if an MQTT client subscribes to a topic on a broker it will not recieve any of the messages
	 * 		published on it before subscription. If a client publishes a message to a topic with the
	 * 		retain flag set to True then the broker will save that message as the “Last Good Message” on that topic.
	 * 		This message will be received by any client who subscribes to that topic.
	 */
	if(esp_mqtt_client_publish(client->handle,topic.c_str(),message.c_str(),0,client->configuration.lwt_qos,false)==0){
		return EMU_FAILURE;
	}

	return EMU_SUCCESS;
}



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
emu_err_t mqttClient_t::subscribe(string topic) {



	//Task 1: get mqtt instance and check for NULL
	mqttClient_t* client=mqttClient_t::getInstance();
	if(client==NULL){
		return EMU_ERR_NULL;
	}

	//Task 2: subscribe the topic with msg
	if(esp_mqtt_client_subscribe(client->handle,topic.c_str(),client->configuration.lwt_qos)==-1){
		return EMU_FAILURE;
	}

	return EMU_SUCCESS;
}






/**
 * @brief getter for configuration attribute
 * @param NA
 * @return mqtt configuration
 *
 */
const esp_mqtt_client_config_t& mqttClient_t::getConfiguration() const {
	return configuration;
}


/**
 * @brief getter for connection status attribute
 * @param NA
 * @return mqtt connection status
 */
mqttClient_t::connectionStatus_t mqttClient_t::getConnectionStatus() const {
	return connectionStatus;
}


/**
 * @brief setter for connection status
 * @param connectionStatus connection status
 * @return NA
 *
 */
void mqttClient_t::setConnectionStatus(
		connectionStatus_t connectionStatus) {
	this->connectionStatus = connectionStatus;
}



/**
 * @brief getter for application event callback
 * @param NA
 * @return mqtt event callback function
 *
 */
mqttClientRecvDataCallback_t mqttClient_t::getRecvDataEventCb() const {
	return recvDataEventCB;
}


/**
 * @brief getter for mqtt client handle
 * @param NA
 * @return esp_mqtt_client_handle_t mqtt client handle
 */
esp_mqtt_client_handle_t mqttClient_t::getHandle() const {
	return handle;
}

bool mqttClient_t::enableAutoReconnection() {
//	if(mqttClient_t::stopServiceBlockingCall(60)!=EMU_SUCCESS){
//		return false;
//	}
//	if(mqttClient_t::startServiceBlockingCall()!=EMU_SUCCESS){
//
//	}
	return false;
}

bool mqttClient_t::disableAutoReconnection() {
//	if(mqttClient_t::stopServiceBlockingCall(60)!=EMU_SUCCESS){
//		return false;
//	}
//	if(mqttClient_t::startServiceBlockingCall()!=EMU_SUCCESS){
//
//	}
	return false;
}

/* @description reports error
 * @param err error number
 * @param message error message
 * @return NA
 */
void mqttClient_t::reportError(emu_err_t err,string message){
	logw(MQTT_TAG,message<<", Exception Number: "<<to_string(err));
}

bool mqttClient_t::registerRecvDataEventCb(mqttClientRecvDataCallback_t cb){
	if(cb!=NULL){
		this->recvDataEventCB=cb;
		return true;
	}
	return false;
}


bool mqttClient_t::degregisterRecvDataEventCb(){
	this->recvDataEventCB=NULL;
	return true;
}


