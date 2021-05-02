import traceback

from line_protocol_parser._line_protocol_parser import parse_line
from sklearn import preprocessing
import conf as conf
from globalImports import *
from database import DatabaseManager
from frequencyDomainAnalysis import *
from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
import argparse
import logging

# Flask setup
app = Flask( __name__ )
app.permanent_session_lifetime = datetime.timedelta( days=1 )
app.secret_key = "12345678"

db_manager = DatabaseManager()
mqtt = Mqtt()
sockets = Sockets()
webSocketConnectedList = []

mqttTopicList = {"control": "uptime/telemetry/controlmsg", "telemetry": "uptime/telemetry",
                 "position": "uptime/telemetry/positioning"}


def app_launch(flask_application):
    conf.FLASK_APP_PORT = conf.FLASK_APP_PORT if os.environ.get( "FLASK_APP_PORT" ) is None else os.environ.get(
        "FLASK_APP_PORT" )

    conf.MONGODB_HOST = conf.MONGODB_HOST if os.environ.get( "MONGODB_HOST" ) is None else os.environ.get( "MONGODB_HOST" )
    conf.MONGODB_PORT = conf.MONGODB_PORT if os.environ.get( "MONGODB_PORT" ) is None else int(
        os.environ.get( "MONGODB_PORT" ) )
    conf.MONGODB_DBNAME = conf.MONGODB_DBNAME if os.environ.get( "MONGODB_DBNAME" ) is None else os.environ.get(
        "MONGODB_DBNAME" )
    conf.MONGODB_USR_NAME = conf.MONGODB_USR_NAME if os.environ.get( "MONGODB_USR_NAME" ) is None else os.environ.get(
        "MONGODB_USR_NAME" )
    conf.MONGODB_PASSWORD = conf.MONGODB_PASSWORD if os.environ.get( "MONGODB_PASSWORD" ) is None else os.environ.get(
        "MONGODB_PASSWORD" )

    conf.MQTT_BROKER_HOST = conf.MQTT_BROKER_HOST if os.environ.get( "MQTT_BROKER_HOST" ) is None else os.environ.get(
        "MQTT_BROKER_HOST" )
    conf.MQTT_BROKER_PORT = conf.MQTT_BROKER_PORT if os.environ.get( "MQTT_BROKER_PORT" ) is None else int(
        os.environ.get( "MQTT_BROKER_PORT" ) )
    conf.MQTT_BROKER_USR_NAME = conf.MQTT_BROKER_USR_NAME if os.environ.get(
        "MQTT_BROKER_USR_NAME" ) is None else os.environ.get( "MQTT_BROKER_USR_NAME" )
    conf.MQTT_BROKER_PASSWORD = conf.MQTT_BROKER_PASSWORD if os.environ.get(
        "MQTT_BROKER_PASSWORD" ) is None else os.environ.get( "MQTT_BROKER_PASSWORD" )

    conf.INFLUXDB_HOST = conf.INFLUXDB_HOST if os.environ.get( "INFLUXDB_HOST" ) is None else os.environ.get(
        "INFLUXDB_HOST" )
    conf.INFLUXDB_PORT = conf.INFLUXDB_PORT if os.environ.get( "INFLUXDB_PORT" ) is None else int(
        os.environ.get( "INFLUXDB_PORT" ) )
    conf.INFLUXDB_DBNAME = conf.INFLUXDB_DBNAME if os.environ.get( "INFLUXDB_DBNAME" ) is None else os.environ.get(
        "INFLUXDB_DBNAME" )
    conf.INFLUXDB_USR_NAME = conf.INFLUXDB_USR_NAME if os.environ.get( "INFLUXDB_USR_NAME" ) is None else os.environ.get(
        "INFLUXDB_USR_NAME" )
    conf.INFLUXDB_PASSWORD = conf.INFLUXDB_PASSWORD if os.environ.get( "INFLUXDB_PASSWORD" ) is None else os.environ.get(
        "INFLUXDB_PASSWORD" )

    app.config["MONGO_URI"] = "mongodb://" + conf.MONGODB_HOST + ":" + str(
        conf.MONGODB_PORT ) + "/" + conf.MONGODB_DBNAME
    app.config['MQTT_BROKER_URL'] = conf.MQTT_BROKER_HOST  # use the free broker from HIVEMQ
    app.config['MQTT_BROKER_PORT'] = conf.MQTT_BROKER_PORT  # default port for non-tls connection
    app.config['MQTT_USERNAME'] = conf.MQTT_BROKER_USR_NAME  # set the username here, to authentication for the broker
    app.config['MQTT_PASSWORD'] = conf.MQTT_BROKER_PASSWORD  # set the password here, to authentication for the broker
    app.config['MQTT_KEEPALIVE'] = 5  # set the time interval for sending a ping to the broker to 5 seconds
    app.config['MQTT_TLS_ENABLED'] = False  # set TLS to disabled for testing purposes

    CORS( flask_application )
    db_manager.init_app( flask_application )
    mqtt.init_app( flask_application )
    sockets.init_app( flask_application )


def respond(data, status, reason):
    if data is not None:
        response_data = data
        response_data.update( {"status": status, "reason": reason} )
    else:
        response_data = {"status": status, "reason": reason}
    return dumps( response_data )


def ws_broadcast(message):
    for ws in webSocketConnectedList:
        if not ws.closed:
            ws.send( message )
        else:
            # Remove ws if connection closed.
            webSocketConnectedList.remove( ws )


def control_msg_handler(mqtt_msg):
    payload_msg_list = mqtt_msg["payload"].split( "/" )
    dev_rec = db_manager.device_settings_collection.find_one(
        {'device_id': payload_msg_list[0], 'file_type': 'status'} )
    if dev_rec is not None:
        new_rec = dev_rec.copy()
        new_rec[payload_msg_list[1]] = payload_msg_list[2]
        new_data = {"$set": new_rec}
        db_manager.device_settings_collection.update_one( dev_rec, new_data )


@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt.subscribe( mqttTopicList["control"] )
    mqtt.subscribe( mqttTopicList["telemetry"] )
    mqtt.subscribe( mqttTopicList["position"] )


@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    if message.topic == mqttTopicList["control"]:
        mqtt_msg = dict(
            topic=message.topic,
            payload=message.payload.decode()
        )
        control_msg_handler( mqtt_msg )
    elif message.topic == mqttTopicList["telemetry"]:
        mqtt_msg = dict(
            topic=message.topic,
            payload=message.payload.decode()
        )
        json_payload = parse_line( mqtt_msg["payload"] )
        ws_broadcast( dumps( json_payload ) )
    elif message.topic == mqttTopicList["position"]:
        mqtt_msg = dict(
            topic=message.topic,
            payload=message.payload.decode()
        )
        # todo send this data to RAKF Algorithm


@sockets.route( '/channel/telemetry' )
def ws_connect(ws):
    webSocketConnectedList.append( ws )
    while not ws.closed:
        message = ws.receive()
        if message == "disconnect":
            ws.close()
            webSocketConnectedList.remove( ws )


@app.route( '/uptime/login', methods=["POST"] )
def login_page():
    if request.method == "POST":

        # convert request data to json format
        request_data = json.loads( request.get_data() )

        # check if user name and password exists
        if request_data.get( "user_name" ) and request_data.get( "user_password" ):
            usr_id = db_manager.validate_user_record( request_data.get( "user_name" ), request_data.get( "user_password" ) )
            if usr_id is not None:
                session.permanent = True
                session["user"] = request_data.get( "user_name" )
                return respond( {"user_id": usr_id}, "success", "" )

    return respond( None, "fail", "Login Failed" )


@app.route( '/uptime/user/account', methods=["GET"] )
def user_account_page():
    if request.method == "GET":

        # convert request data to json format
        imd = request.values
        request_data = imd.to_dict()

        # check if user name and password exists
        if request_data["user_id"] and (request_data["operation"] == "user_account"):
            usr_info = db_manager.get_user_record_by_id( request_data["user_id"] )
            if usr_info is not None:
                return respond( {"user_name": usr_info["user_name"], "user_id": usr_info["user_id"],
                                 "user_email": usr_info["user_email"], "user_org": usr_info["user_org"],
                                 "user_dept": usr_info["user_dept"], "user_role": usr_info["user_role"]}, "success", "" )
    return respond( None, "fail", "Login Failed" )


@app.route( '/uptime/registration', methods=["POST"] )
def registration_page():
    if request.method == "POST":
        request_data = json.loads( request.get_data() )

        if request_data.get( "user_name" ):
            usr_rec = db_manager.get_user_record_by_name( request_data.get( "user_name" ) )
            if usr_rec is None:
                db_manager.create_user_profile( user_data=request_data )
                return respond( None, "success", "" )
            else:
                return respond( None, "fail", "Username already exists" )
    return respond( None, "fail", "Registration Failed" )


@app.route( '/uptime/sense/device/config', methods=["POST", "GET"] )
def device_configuration_page():
    if request.method == "POST":
        page_content = json.loads( request.get_data() )

        # add
        if page_content.get( "operation" ) == "add":
            dev_rec = db_manager.get_device_record_by_id( page_content.get( "device_id" ) )
            if dev_rec is None:
                db_manager.insert_factory_device_configuration( page_content.get( "device_id" ) );
                return respond( None, "success", "" )
            else:
                return respond( None, "fail", "Device Already Exists" )

        # remove
        elif page_content.get( "operation" ) == "remove":
            dev_rec = db_manager.get_device_record_by_id( page_content.get( "device_id" ) )
            if dev_rec is None:
                return respond( None, "fail", "Device Does Not Exist" )
            else:
                db_manager.delete_device_record( page_content.get( "device_id" ) )
                return respond( None, "success", "" )

        # config update
        else:
            dev_rec = None
            # system config update
            if page_content.get( "operation" ) == "system":
                dev_rec = db_manager.get_device_record_by_query(
                    {'device_id': page_content.get( "device_id" ), 'file_type': 'system'} )

            # protocol config update
            if page_content.get( "operation" ) == "protocol":
                dev_rec = db_manager.get_device_record_by_query(
                    {'device_id': page_content.get( "device_id" ), 'file_type': 'protocol'} )

            # sensor config update
            if page_content.get( "operation" ) == "sensor":
                # find if username is found unique in the db
                dev_rec = db_manager.get_device_record_by_query(
                    {'device_id': page_content.get( "device_id" ), 'file_type': 'sensor'} )

            # storage config update
            if page_content.get( "operation" ) == "storage":
                # find if username is found unique in the db
                dev_rec = db_manager.get_device_record_by_query(
                    {'device_id': page_content.get( "device_id" ), 'file_type': 'storage'} )

            # filter config
            if page_content.get( "operation" ) == "filter":
                dev_rec = db_manager.get_device_record_by_query(
                    {'device_id': page_content.get( "device_id" ), 'file_type': 'filter'} )

            if page_content.get( "operation" ) == "validate_device":
                dev_rec = db_manager.get_device_record_by_query(
                    {'device_id': page_content.get( "device_id" )} )

            if dev_rec is None:
                return respond( None, "fail", "Device Does Not Exists" )
            else:
                db_manager.update_device_record( dev_rec, page_content )
                return respond( None, "success", "" )

    elif request.method == "GET":
        imd = request.values
        page_content = imd.to_dict()
        dev_rec = None
        if page_content["operation"] == "system":
            dev_rec = db_manager.get_device_record_by_query(
                {'device_id': page_content["device_id"], 'file_type': 'system'} )

        if page_content["operation"] == "protocol":
            dev_rec = db_manager.get_device_record_by_query(
                {'device_id': page_content["device_id"], 'file_type': 'protocol'} )

        if page_content["operation"] == "sensor":
            dev_rec = db_manager.get_device_record_by_query(
                {'device_id': page_content["device_id"], 'file_type': 'sensor'} )

        if page_content["operation"] == "storage":
            dev_rec = db_manager.get_device_record_by_query(
                {'device_id': page_content["device_id"], 'file_type': 'storage'} )

        if page_content["operation"] == "status":
            dev_rec = db_manager.get_device_record_by_query(
                {'device_id': page_content["device_id"], 'file_type': 'status'} )

        if page_content.get( "operation" ) == "filter":
            dev_rec = db_manager.get_device_record_by_query(
                {'device_id': page_content.get( "device_id" ), 'file_type': 'filter'} )

        if dev_rec is None:
            return respond( None, "fail", "No Data Found For This Device" )
        else:
            return respond( dev_rec, "success", "" )
    return respond( None, "fail", "Device Configuration Failed" )


@app.route( '/uptime/database', methods=["POST", "GET"] )
def database_manager_page():
    if request.method == "POST":
        request_data = json.loads( request.get_data() )
        usr_rec = db_manager.get_user_record_by_id( request_data.get( "id" ) )
        usr_rec_copy = usr_rec.copy()
        if usr_rec is None:
            return respond( None, "fail", "User Doesnt Exist" )
        else:
            if request_data.get( "operation" ) == "databaseList":
                usr_rec_copy["dbList"] = request_data["dbList"]
            elif request_data.get( "operation" ) == "queryList":
                usr_rec_copy["queryList"] = request_data["queryList"]
            elif request_data.get( "operation" ) == "dashboardList":
                usr_rec_copy["dashboardList"] = request_data["dashboardList"]
            else:
                return respond( None, "fail", "Invalid Operation" )
            db_manager.update_user_record( usr_rec, usr_rec_copy )
            data = {"queryList": usr_rec["queryList"],
                    "dbList": usr_rec["dbList"],
                    "dashboardList": usr_rec["dashboardList"],
                    }
            return respond( data, "success", "" )

    elif request.method == "GET":
        imd = request.values
        request_data = imd.to_dict()
        usr_rec = db_manager.get_user_record_by_id( request_data["id"] )
        if usr_rec is None:
            return respond( None, "fail", "User ID Doesnt Exist" )
        else:
            if request_data["operation"] == "queryList" or \
                    request_data["operation"] == "dashboardList" or \
                    request_data["operation"] == "databaseList" or \
                    request_data["operation"] == "all":

                data = {"queryList": usr_rec["queryList"],
                        "dbList": usr_rec["dbList"],
                        "dashboardList": usr_rec["dashboardList"],
                        }
                return respond( data, "success", "" )
            else:
                return respond( None, "fail", "Invalid Operation" )
    return respond( None, "fail", "Database Operation Failed" )


@app.route( '/uptime/sense/analyse/frequencydomain', methods=["GET"] )
def frequency_analyses():
    if request.method == "GET":
        imd = request.values
        page_content = imd.to_dict()

        usr_rec = db_manager.get_user_record_by_id( page_content["id"] )
        if usr_rec is None:
            return respond( None, "fail", "User ID Doesnt Exist" )

        dev_rec = db_manager.get_device_record_by_id( page_content["device_id"] )
        if dev_rec is None:
            return respond( None, "fail", "Device ID Doesnt Exist" )
        else:
            query_statement = 'SELECT "{}" FROM "{}"."autogen"."{}"'.format( page_content["sense_param"],
                                                                             conf.INFLUXDB_DBNAME,
                                                                             page_content["measurement_param"] )
            query_statement = query_statement + " WHERE time > '{}' AND time < '{}' {}".format(
                page_content["start_time"], page_content["end_time"], page_content["tag_name"] )
            data = db_manager.query_influxdb( query_statement )
            if len( data ) != 0:
                if page_content["operation"] == "spectrogram":
                    spec_freq, spec_time, spec_mag = freq_analysis_time_series_data( "spectrogram", data,
                                                                                     page_content["measurement_param"],
                                                                                     page_content["sense_param"],
                                                                                     page_content["sample_frequency"],
                                                                                     page_content["window_size"],
                                                                                     page_content["overlap_size"] )
                    norm = np.linalg.norm( spec_mag )
                    return respond( {"x": spec_time, "y": spec_freq, "value": spec_mag / norm}, "success", "" )
                    # return respond({"x": spec_time, "y": spec_freq, "value": spec_mag}, "success", "")
                elif page_content["operation"] == "fft":
                    mag, freq = freq_analysis_time_series_data( "fft", data,
                                                                page_content["measurement_param"],
                                                                page_content["sense_param"],
                                                                page_content["sample_frequency"] )
                    norm = np.linalg.norm( np.abs( mag ) )
                    return respond( {"x": freq, "y": np.abs( mag ) / norm}, "success", "" )
                    # return respond({"x": freq, "y": np.abs(mag)}, "success", "")
            return respond( None, "fail", "No Data Found" )
    return respond( None, "fail", "Frequency Analyses Failed" )


@app.route( "/download/device/config", methods=["POST"] )
def download_dev_config():
    request_data = json.loads( request.get_data() )
    username = request_data['username']
    password = request_data['password']
    device_id = request_data['device_id']
    config_item = request_data['doc_type']

    if username is not None and password is not None and device_id is not None and config_item is not None:
        usr_rec = db_manager.validate_user_record( user_name=username, user_password=password )
        if usr_rec is not None:
            dev_rec = db_manager.get_device_record_by_query( {'device_id': device_id, 'file_type': config_item} )
            if dev_rec is not None:
                return dumps( dev_rec )
    return '''{"doc_type"="None"}'''


@app.route( "/uptime/sense/device/programmer", methods=["POST"] )
def device_programmer():
    if request.method == "POST":
        page_content = json.loads( request.get_data() )
        user_rec = db_manager.get_user_record_by_id( page_content["id"] )

        if user_rec is None:
            return respond( None, "fail", "User ID Doesnt Exist" )
        dev_rec = db_manager.get_device_record_by_id( page_content["device_id"] )

        if dev_rec is None:
            return respond( None, "fail", "Device ID Doesnt Exist" )

        if page_content["operation"] == "programmer":
            if page_content["uploadParam"] == "configuration":
                topic = 'Uptime/Telemetry/ControlMsg/' + page_content["device_id"]
                msg = page_content["device_id"] + '/reboot/now'
                mqtt.publish( topic, msg )
                return respond( None, "success", "" )

    return respond( None, "fail", "Device Programmer Failed" )


@app.route( "/uptime/sense/indoor/positioning/rakf", methods=["POST"] )
def indoor_positioning():
    if request.method == "POST":
        imd = request.values
        page_content = imd.to_dict()
        # page_content = json.loads(request.get_data())
        user_rec = db_manager.get_user_record_by_id( page_content["id"] )
        if user_rec is None:
            return respond( None, "fail", "User ID Doesnt Exist" )

        dev_rec = db_manager.get_device_record_by_id( page_content["device_id"] )
        if dev_rec is None:
            return respond( None, "fail", "Device ID Doesnt Exist" )

        if page_content["operation"] == "rakf":
            if page_content["command"] == "start":
                topic = 'Uptime/Control/Rakf/' + page_content["device_id"]
                msg = page_content["device_id"] + '/start'
                mqtt.publish( topic, msg )
                return respond( None, "success", "" )
            elif page_content["command"] == "stop":
                topic = 'Uptime/Control/Rakf/' + page_content["device_id"]
                msg = page_content["device_id"] + '/stop'
                mqtt.publish( topic, msg )
                return respond( None, "success", "" )

    return respond( None, "fail", "Device Programmer Failed" )


if __name__ == '__main__':
    # parser = argparse.ArgumentParser()
    # parser.add_argument('--mongoHost', help='MongoDB Server IP Address')
    # parser.add_argument('--mongoPort', help='MongoDB Server Port')
    # parser.add_argument('--mongoDBName', help='MongoDB Database Name')
    # parser.add_argument('--mongoUsr', help='MongoDB User Name')
    # parser.add_argument('--mongoPass', help='MongoDB User Password')
    #
    # parser.add_argument('--mqttHost', help='Mqtt Broker IP Address')
    # parser.add_argument('--mqttPort', help='Mqtt Broker Port')
    # parser.add_argument('--mqttUsr', help='Mqtt Broker User Name')
    # parser.add_argument('--mqttPass', help='Mqtt Broker User Password')
    #
    # parser.add_argument('--influxHost', help='InfluxDB Server IP Address')
    # parser.add_argument('--influxPort', help='InfluxDB Server PORT')
    # parser.add_argument('--influxDBName', help='InfluxDB Server DB Name')
    # parser.add_argument('--influxUsr', help='InfluxDB Server User Name')
    # parser.add_argument('--influxPass', help='Influx Server User Password')
    # arguments = parser.parse_args()
    app_launch( app )

    server = pywsgi.WSGIServer( ('', int( conf.FLASK_APP_PORT )), app, handler_class=WebSocketHandler )
    server.serve_forever()
