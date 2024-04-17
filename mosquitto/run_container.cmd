docker run -it --rm --name mqtt_broker -p 1883:1883 -p 9001:9001 -v %cd%\config/:/mosquitto/config/ -v %cd%\data/:/mosquitto/data -v %cd%\log/:/mosquitto/log eclipse-mosquitto

pause

::docker exec -it mqtt_broker sh
