from globalImports import *
import conf as conf


class DatabaseManager:
    def __init__(self):
        self.mongodb_client = PyMongo()
        self.influxdb_client = None
        self.user_profiles_collection = None
        self.device_settings_collection = None

    def init_app(self, app):
        self.mongodb_client.init_app(app)
        self.user_profiles_collection = self.mongodb_client.db.user_profiles
        self.device_settings_collection = self.mongodb_client.db.device_settings
        self.influxdb_client = InfluxDBClient(host=conf.INFLUXDB_HOST, port=conf.INFLUXDB_PORT,
                                              database=conf.INFLUXDB_DBNAME)

    def insert_factory_device_configuration(self, device_id):
        self.device_settings_collection.insert({'device_id': device_id,
                                                'file_type': "system",
                                                "device_type": "Gateway",
                                                "network_id": "",
                                                "device_description": "",
                                                "uart0_en": False,
                                                "uart0_baud": 115200,
                                                "uart1_en": False,
                                                "uart1_baud": 115200,
                                                "uart2_en": False,
                                                "uart2_baud": 115200,
                                                "i2c0_en": False,
                                                "i2c0_freq": "50KHz",
                                                "i2c1_en": False,
                                                "i2c1_freq": "50KHz",
                                                "hsspi_en": False,
                                                "lsspi_en": False,
                                                "wifi_en": True,
                                                "wifi_smartconnect_en": False,
                                                "wifi_reconnect_attempt": 3,
                                                "wifi_ssid1": "",
                                                "wifi_password1": "",
                                                "wifi_ssid2": "",
                                                "wifi_password2": "",
                                                "wifi_ssid3": "",
                                                "wifi_password3": "",
                                                "wifi_ssid4": "",
                                                "wifi_password4": "",
                                                "wifi_ssid5": "",
                                                "wifi_password5": "",
                                                "wifi_ssid6": "",
                                                "wifi_password6": "",
                                                "wifi_ssid7": "",
                                                "wifi_password7": "",
                                                "wifi_ssid8": "",
                                                "wifi_password8": "",
                                                "wifi_ssid9": "",
                                                "wifi_password9": "",
                                                "wifi_ssid10": "",
                                                "wifi_password10": "",
                                                "appStatusIndicator_en": False,
                                                "error_major": "None",
                                                "error_minor": "None",
                                                "warn_major": "None",
                                                "warn_minor": "None"
                                                })

        self.device_settings_collection.insert({'device_id': device_id,
                                                'file_type': "protocol",
                                                "mqttc_en": False,
                                                "mqttb_uri": "",
                                                "mqttb_port": 1886,
                                                "mqttc_keep_alive_timeout": 1000,
                                                "mqttc_qos": 1,
                                                "mqttc_enable_clean_session": True,
                                                "mqttc_enable_auto_reconnect": True,
                                                "mqttc_last_will_topic": "",
                                                "mqttc_last_will_msg": "",
                                                "influxc_en": False,
                                                "influxc_host": "",
                                                "influxc_port": 8086,
                                                "influxc_db_name": "",
                                                "influxc_usr_name": "",
                                                "influxc_password": "",

                                                "ble_client1_en": False,
                                                "ble_client1_name": "",
                                                "ble_client1_max_device_to_scan": 1,
                                                "ble_client1_service_uuid": "",
                                                "ble_client1_tx_uuid": "",
                                                "ble_client1_rx_uuid": "",
                                                "ble_client1_bonded_dev_address": "",
                                                "ble_client1_bonded_dev_address_type": "Public",

                                                "ble_client2_en": False,
                                                "ble_client2_name": "",
                                                "ble_client2_max_device_to_scan": 1,
                                                "ble_client2_service_uuid": "",
                                                "ble_client2_tx_uuid": "",
                                                "ble_client2_rx_uuid": "",
                                                "ble_client2_bonded_dev_address": "",
                                                "ble_client2_bonded_dev_address_type": "Public",

                                                "ble_client3_en": False,
                                                "ble_client3_name": "",
                                                "ble_client3_max_device_to_scan": 1,
                                                "ble_client3_service_uuid": "",
                                                "ble_client3_tx_uuid": "",
                                                "ble_client3_rx_uuid": "",
                                                "ble_client3_bonded_dev_address": "",
                                                "ble_client3_bonded_dev_address_type": "Public",

                                                "ble_client4_en": False,
                                                "ble_client4_name": "",
                                                "ble_client4_max_device_to_scan": 1,
                                                "ble_client4_service_uuid": "",
                                                "ble_client4_tx_uuid": "",
                                                "ble_client4_rx_uuid": "",
                                                "ble_client4_bonded_dev_address": "",
                                                "ble_client4_bonded_dev_address_type": "Public",

                                                "ble_client5_en": False,
                                                "ble_client5_name": "",
                                                "ble_client5_max_device_to_scan": 1,
                                                "ble_client5_service_uuid": "",
                                                "ble_client5_tx_uuid": "",
                                                "ble_client5_rx_uuid": "",
                                                "ble_client5_bonded_dev_address": "",
                                                "ble_client5_bonded_dev_address_type": "Public",

                                                "ble_client6_en": False,
                                                "ble_client6_name": "",
                                                "ble_client6_max_device_to_scan": 1,
                                                "ble_client6_service_uuid": "",
                                                "ble_client6_tx_uuid": "",
                                                "ble_client6_rx_uuid": "",
                                                "ble_client6_bonded_dev_address": "",
                                                "ble_client6_bonded_dev_address_type": "Public",

                                                "ble_client7_en": False,
                                                "ble_client7_name": "",
                                                "ble_client7_max_device_to_scan": 1,
                                                "ble_client7_service_uuid": "",
                                                "ble_client7_tx_uuid": "",
                                                "ble_client7_rx_uuid": "",
                                                "ble_client7_bonded_dev_address": "",
                                                "ble_client7_bonded_dev_address_type": "Public",

                                                "ble_server_en": False,
                                                "ble_server_name": "",
                                                "ble_server_service_uuid": "",
                                                "ble_server_tx_uuid": "",
                                                "ble_server_rx_uuid": "",
                                                "ble_server_dev_address": "",
                                                "ble_server_dev_address_type": "Public"})

        self.device_settings_collection.insert({'device_id': device_id,
                                                'file_type': "sensor",
                                                "bmi160_en": False,
                                                "bmi160_id": "",
                                                "bmi160_description": "",
                                                "bmi160_measurement_type": "",
                                                "bmi160_measurement_topic": "",
                                                "bmi160_log_msg_topic": "",
                                                "bmi160_peripheral_comm_interface": "hsspi",
                                                "bmi160_peripheral_comm_address_dec": 0,
                                                "bmi160_telemetry_interface": "mqtt",
                                                "bmi160_gyroscope_range": 0,
                                                "bmi160_gyro_x_offset": 0,
                                                "bmi160_gyro_y_offset": 0,
                                                "bmi160_gyro_z_offset": 0,
                                                "bmi160_gyro_bais_x": 0,
                                                "bmi160_gyro_bais_y": 0,
                                                "bmi160_gyro_bais_z": 0,
                                                "bmi160_accelerometerRange": 0,
                                                "bmi160_acc_x_offset": 0,
                                                "bmi160_acc_y_offset": 0,
                                                "bmi160_acc_z_offset": 0,
                                                "bmi160_acc_scaleCorrection": 0,
                                                "bmi160_sampling_frequency": 0,
                                                "bme280_en": False,
                                                "bme280_id": "",
                                                "bme280_description": "",
                                                "bme280_measurement_type": "",
                                                "bme280_measurement_topic": "",
                                                "bme280_last_msg_topic": "",
                                                "bme280_peripheral_comm_interface": "hsspi",
                                                "bme280_peripheral_comm_address_dec": 0,
                                                "bme280_telemetry_interface": "mqtt",
                                                "bme280_sea_level_atm_pressure": 0,
                                                "bme280_sampling_frequency": 0,
                                                "gps_en": False,
                                                "gps_id": "",
                                                "gps_description": "",
                                                "gps_measurement_type": "",
                                                "gps_measurement_topic": "",
                                                "gps_log_msg_topic": "",
                                                "gps_peripheral_comm_interface": "hsspi",
                                                "gps_peripheral_comm_address_dec": 0,
                                                "gps_telemetry_interface": "mqtt",
                                                "gps_sampling_frequency": 0,
                                                })

        self.device_settings_collection.insert({'device_id': device_id,
                                                'file_type': "storage",
                                                "sdcard_en": False,
                                                "sdcard_peripheral_comm_interface": "hsspi"
                                                })

        self.device_settings_collection.insert({'device_id': device_id,
                                                'file_type': "status",
                                                "battery_level": "Not set",
                                                "last_bootup_timestamp": "Not set",
                                                "telemetry_service_status": "Stopped",
                                                "motion_sensing_service_status": "Stopped",
                                                "environment_sensing_service_status": "Stopped",
                                                "location_sensing_service_status": "Stopped",
                                                "heart_beat_service": "Stopped",
                                                "last_error_msg": "",
                                                })

        self.device_settings_collection.insert({'device_id': device_id,
                                                'file_type': "filter",
                                                "acc_enable": False,
                                                "acc_MeasurementError_Xaxis": 0,
                                                "acc_ModelError_Xaxis": 0,
                                                "acc_ConvergenceFactor_Xaxis": 0,
                                                "acc_MeasurementError_Yaxis": 0,
                                                "acc_ModelError_Yaxis": 0,
                                                "acc_ConvergenceFactor_Yaxis": 0,
                                                "acc_MeasurementError_Zaxis": 0,
                                                "acc_ModelError_Zaxis": 0,
                                                "acc_ConvergenceFactor_Zaxis": 0,
                                                "gyro_enable": False,
                                                "gyro_MeasurementError_Xaxis": 0,
                                                "gyro_ModelError_Xaxis": 0,
                                                "gyro_ConvergenceFactor_Xaxis": 0,
                                                "gyro_MeasurementError_Yaxis": 0,
                                                "gyro_ModelError_Yaxis": 0,
                                                "gyro_ConvergenceFactor_Yaxis": 0,
                                                "gyro_MeasurementError_Zaxis": 0,
                                                "gyro_ModelError_Zaxis": 0,
                                                "gyro_ConvergenceFactor_Zaxis": 0,
                                                "orient_enable": False,
                                                "orient_MeasurementError_Xaxis": 0,
                                                "orient_ModelError_Xaxis": 0,
                                                "orient_ConvergenceFactor_Xaxis": 0,
                                                "orient_MeasurementError_Yaxis": 0,
                                                "orient_ModelError_Yaxis": 0,
                                                "orient_ConvergenceFactor_Yaxis": 0,
                                                "orient_MeasurementError_Zaxis": 0,
                                                "orient_ModelError_Zaxis": 0,
                                                "orient_ConvergenceFactor_Zaxis": 0,
                                                "complementary_enable": False,
                                                "trustWeightAccelerometer": 0,
                                                "trustWeightGyroscope": 1,
                                                "madgwick_enable": False,
                                                "madgwickBeta": 0.1,
                                                })

    def create_user_profile(self, user_data):
        user_id = str(uuid.uuid1().hex)
        self.user_profiles_collection.insert({'user_name': user_data["user_name"],
                                              'user_password': generate_password_hash(user_data["user_password"]),
                                              'user_email': user_data["user_email"],
                                              'user_id': user_id,
                                              'user_org': user_data["user_org"],
                                              'user_dept': user_data["user_dept"],
                                              'user_role': user_data["user_role"],
                                              'queryList': [],
                                              'dashboardList': [],
                                              'dbList': [],
                                              })

    def get_user_record_by_name(self, user_name):
        return self.user_profiles_collection.find_one({'user_name': user_name})

    def get_user_record_by_id(self, user_id):
        return self.user_profiles_collection.find_one({'user_id': user_id})

    def get_user_record_by_query(self, query):
        return self.user_profiles_collection.find_one(query)

    def update_user_record(self, old_record, new_record):
        self.user_profiles_collection.update_one(old_record, {"$set": new_record})

    def get_device_record_by_id(self, device_id):
        return self.device_settings_collection.find_one({'device_id': device_id})

    def get_device_record_by_query(self, query):
        return self.device_settings_collection.find_one(query)

    def update_device_record(self, old_record, new_record):
        self.device_settings_collection.update_one(old_record, {"$set": new_record})

    def delete_device_record(self, device_id):
        self.device_settings_collection.delete_one(
            {'device_id': device_id, 'file_type': 'system'})
        self.device_settings_collection.delete_one(
            {'device_id': device_id, 'file_type': 'protocol'})
        self.device_settings_collection.delete_one(
            {'device_id': device_id, 'file_type': 'storage'})
        self.device_settings_collection.delete_one(
            {'device_id': device_id, 'file_type': 'sensor'})
        self.device_settings_collection.delete_one(
            {'device_id': device_id, 'file_type': 'filter'})
        self.device_settings_collection.delete_one(
            {'device_id': device_id, 'file_type': 'status'})

    def validate_user_record(self, user_name, user_password):
        usr_rec = self.get_user_record_by_name(user_name)
        if usr_rec is not None:
            if check_password_hash(usr_rec['user_password'], user_password):
                return usr_rec["user_id"]
        return None

    def query_influxdb(self, query):
        return self.influxdb_client.query(query)
