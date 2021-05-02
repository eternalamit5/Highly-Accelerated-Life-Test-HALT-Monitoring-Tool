/*
 * influxdbApp.h
 *
 *  Created on: Jun 2, 2020
 *      Author: karsh
 */

#ifndef COMPONENTS_COMMUNICATION_INFLUXCLIENT_INFLUXDBAPP_H_
#define COMPONENTS_COMMUNICATION_INFLUXCLIENT_INFLUXDBAPP_H_

#include "influxdb.hpp"

class influxLineFormater{
private:
	string measurementName;
	string tags;
	string fields;
	string timestamp;
	unsigned int measurementCount;
	unsigned int tagCount;
	unsigned int fieldCount;
public:
	influxLineFormater(string measurementName="",string tags="",string values=""):
		measurementName(measurementName),tags(tags),fields(values),measurementCount(0),tagCount(0),fieldCount(0){}
	~influxLineFormater(){}

	void appendMeasurement(string str){
		if(measurementCount==0)	measurementName.append(str);
		else measurementName.append(","+str);
		measurementCount++;
	}

	void addMeasurement(string str){ measurementName.assign(str);measurementCount=1;}

	void appendTag(string tagName,string tagVal){tags.append(","+tagName+"="+tagVal);tagCount++;}
	void addTag(string tagName,string tagVal){ tags.assign(","+tagName+"="+tagVal);tagCount=1;}

	void appendfield(string fieldName,string fieldVal){
		if(fieldCount==0)fields.append(" "+fieldName+"="+fieldVal);
		else fields.append(","+fieldName+"="+fieldVal);
		fieldCount++;
	}
	void addfield(string fieldName,string fieldVal){ fields.assign(" "+fieldName+"="+fieldVal);fieldCount=1;}
	void addTimestamp(string timestamp){this->timestamp=timestamp;}
	string getInlineString(){return (this->measurementName+this->tags+this->fields+" "+this->timestamp);}
};




#endif /* COMPONENTS_COMMUNICATION_INFLUXCLIENT_INFLUXDBAPP_H_ */
