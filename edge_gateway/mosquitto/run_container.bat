docker run -it --rm --name mqtt_broker --net edge_network -p 1883:1883 -p 9001:9001 -v %cd%\config/:/mosquitto/config/ eclipse-mosquitto
pause