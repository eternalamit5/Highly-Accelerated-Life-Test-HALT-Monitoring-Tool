/*
 * httpClientApp.h
 *
 *  Created on: Jun 8, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_COMMUNICATION_HTTPCLIENT_HTTPCLIENTAPP_H_
#define COMPONENTS_COMMUNICATION_HTTPCLIENT_HTTPCLIENTAPP_H_

#include "commons.h"
#include "esp_tls.h"
#include "esp_http_client.h"

using namespace std;

#define MAX_RECV_BUFFER_SIZE 4096

class httpClientApp{
private:
	esp_http_client_handle_t client;
	string host;
	size_t timeoutms;
	string recvMsgString;

private:
	static httpClientApp* instance;

private:
	httpClientApp(string host, size_t timeoutms);

public:
	static esp_err_t eventHandler(esp_http_client_event_t *evt);
	static httpClientApp* getInstance();
	static httpClientApp* getInstance(string host, size_t timeoutms);
	~httpClientApp();
	bool httpGET(string path);
	bool httpPOST(string path, string data);
	const string& getHost() const;
	void setHost(const string &host);
	size_t getTimeoutms() const;
	void setTimeoutms(size_t timeoutms);
	const string& getServerResponseData() const;
	void setServerResponseData(char* byteBuffer, size_t len);
};


#endif /* COMPONENTS_COMMUNICATION_HTTPCLIENT_HTTPCLIENTAPP_H_ */
