# Flask
from flask import Flask, request, session, send_file
from flask_cors import CORS

# mongo
from flask_pymongo import PyMongo

# mqtt
from flask_mqtt import Mqtt

# web sockets
from flask_sockets import Sockets

# influx
from influxdb import InfluxDBClient

# numpy
import numpy as np
import pandas as pd

# time, os
import datetime
import time, os

# json
import json
from bson.json_util import dumps

# password and uuid
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

# math, FFT and spectrogram
from scipy import fftpack, signal
from skimage import util
import matplotlib.pyplot as plt

# configuration
import conf

from flask_influxdb_client import InfluxDB
from line_protocol_parser import parse_line
from bson.json_util import dumps