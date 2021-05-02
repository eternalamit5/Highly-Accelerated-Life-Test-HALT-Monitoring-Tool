/*
 * httpClientApp.cpp
 *
 *  Created on: Jun 8, 2020
 *      Author: karsh
 */

/* ESP HTTP Client Example

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/

#include "httpClientApp.h"

static char HTTP_CLIENT_TAG[] = "httpClientApp";

httpClientApp* httpClientApp::instance=NULL;

esp_err_t httpClientApp::eventHandler(esp_http_client_event_t *evt)
{
	httpClientApp* client = httpClientApp::getInstance();
	if(client!=NULL){

		switch(evt->event_id) {
			case HTTP_EVENT_ERROR:
				logi(HTTP_CLIENT_TAG, "HTTP_EVENT_ERROR");
				break;
			case HTTP_EVENT_ON_CONNECTED:
				logi(HTTP_CLIENT_TAG, "HTTP_EVENT_ON_CONNECTED");
				break;
			case HTTP_EVENT_HEADER_SENT:
				logi(HTTP_CLIENT_TAG, "HTTP_EVENT_HEADER_SENT");
				break;
			case HTTP_EVENT_ON_HEADER:
				logi(HTTP_CLIENT_TAG, "HTTP_EVENT_ON_HEADER, key="<<evt->header_key<<" value="<<evt->header_value);
				break;
			case HTTP_EVENT_ON_DATA:
				logi(HTTP_CLIENT_TAG, "HTTP_EVENT_ON_DATA, len="<< evt->data_len);
				if (!esp_http_client_is_chunked_response(evt->client)) {
					// Write out data
					client->setServerResponseData((char*)evt->data,(size_t)evt->data_len);
					logi(HTTP_CLIENT_TAG,"Reccieved data: "<<client->getServerResponseData());
				}
				break;
			case HTTP_EVENT_ON_FINISH:
				logi(HTTP_CLIENT_TAG, "HTTP_EVENT_ON_FINISH");
				break;
			case HTTP_EVENT_DISCONNECTED:
				logi(HTTP_CLIENT_TAG, "HTTP_EVENT_DISCONNECTED");
				int mbedtls_err = 0;
				esp_err_t err = esp_tls_get_and_clear_last_error((esp_tls_error_handle_t)evt->data, &mbedtls_err, NULL);
				if (err != 0) {
					loge(HTTP_CLIENT_TAG, "Last esp error code:"<< err);
					loge(HTTP_CLIENT_TAG, "Last mbedtls failure:"<< mbedtls_err);
				}
				break;
		}
	}
    return ESP_OK;
}




httpClientApp::httpClientApp(string host, size_t timeoutms):client(NULL),host(host),timeoutms(timeoutms) {

	esp_http_client_config_t config ={ .url=this->host.c_str(),.path="/",
			.timeout_ms=(int)this->timeoutms,.event_handler=eventHandler,
			.transport_type=HTTP_TRANSPORT_OVER_TCP,.buffer_size=MAX_RECV_BUFFER_SIZE};

    this->client = esp_http_client_init(&config);
    if(this->client==NULL){
    	loge(HTTP_CLIENT_TAG,"esp http client init failed");
    	abort();
    }
}

httpClientApp::~httpClientApp() {
	esp_http_client_cleanup(this->client);
}

bool httpClientApp::httpGET(string path) {
	recvMsgString.clear();
	esp_http_client_set_url(this->client, path.c_str());
    esp_err_t err = esp_http_client_perform(this->client);
    if (err == ESP_OK) {
        logi(HTTP_CLIENT_TAG, "HTTP GET Status = "<< esp_http_client_get_status_code(this->client)<<
        		"content_length = " << esp_http_client_get_content_length(this->client));
        return true;
    } else {
    	loge(HTTP_CLIENT_TAG, "HTTP GET request failed: "<< esp_err_to_name(err));
    	return false;
    }
}

bool httpClientApp::httpPOST(string path, string data) {
	recvMsgString.clear();
    esp_http_client_set_url(this->client, path.c_str());
    esp_http_client_set_method(this->client, HTTP_METHOD_POST);
    esp_http_client_set_post_field(this->client, data.c_str(), data.length());
    esp_err_t err = esp_http_client_perform(this->client);
    if (err == ESP_OK) {
        logi(HTTP_CLIENT_TAG, "HTTP GET Post = "<< esp_http_client_get_status_code(this->client)<<
        		"content_length = " << esp_http_client_get_content_length(this->client));
        return true;
    } else {
    	loge(HTTP_CLIENT_TAG, "HTTP POST request failed: "<< esp_err_to_name(err));
    	return false;
    }
}

const string& httpClientApp::getHost() const {
	return host;
}

void httpClientApp::setHost(const string &host) {
	this->host = host;
}

size_t httpClientApp::getTimeoutms() const {
	return timeoutms;
}

const string& httpClientApp::getServerResponseData() const {
	return recvMsgString;
}

void httpClientApp::setServerResponseData(char* byteBuffer, size_t len) {
	this->recvMsgString.assign(byteBuffer,len);
}

void httpClientApp::setTimeoutms(size_t timeoutms) {
	this->timeoutms = timeoutms;
}

httpClientApp* httpClientApp::getInstance() {
	return httpClientApp::instance;
}

httpClientApp* httpClientApp::getInstance(string host,
		size_t timeoutms) {
	if(httpClientApp::instance==NULL){
		httpClientApp::instance = new httpClientApp(host,timeoutms);
	}else{
		httpClientApp::instance->setHost(host);
		httpClientApp::instance->setTimeoutms(timeoutms);
	}
	return httpClientApp::instance;
}
