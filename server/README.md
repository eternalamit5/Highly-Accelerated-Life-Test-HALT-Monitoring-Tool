# UptimeWebServer

To run the server use below command
> python server.py --mongoHost <IP> --mongoPort <port> --mongoDBName <my mongodb name> --mongoUsr <me> 
                 --mongoPass <pass> --mqttHost <IP> --mqttPort <port> --mqttUsr <me> --mqttPass <pass> 
                 --influxHost <IP> --influxPort <port> --influxDBName <my influx db name> --influxUsr <me> 
                 --influxPass <pass>


To get more information about command line arg 
> python server.py --help

Example:
> python server.py --mongoHost localhost --mongoPort 27017 --mongoDBName uptime_db --mongoUsr karsh 
                --mongoPass pass --mqttHost localhost --mqttPort 1883 --mqttUsr karsh --mqttPass pass    
                --influxHost localhost --influxPort 8086 --influxDBName sensors --influxUsr karsh --influxPass pass


## Python packages to be installed using pip for server.py
see requirements.txt

## Generating Requirement.txt file from the project
Go inside virtual environment of the project. To get the path in pycharm: "settings" -> "python interpreter"
> cd Virtual-environment-folder-path

Now activate virtual environment (Note there is space between . and start of bin)
> . bin/activate

Now generate requirements.txt file
> pip freeze > ../requirements.txt


