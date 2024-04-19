from paho.mqtt import client

class MQTT_Client:
  def __init__(self, broker, port, client_id, username, password, on_message):
    def on_connect(client, userdata, flags, rc, properties):
      if rc == 0:
        print("Connected to MQTT Broker!")
      else:
        print("Failed to connect, return code %d\n", rc)

    # When init instance, it will connect to broker
    self.client = client.Client(client_id=client_id, callback_api_version=client.CallbackAPIVersion.VERSION2)
    self.client.username_pw_set(username, password)
    self.client.connect(broker, port)

    self.client.on_connect = on_connect
    self.client.on_message = on_message
    return self.client
  
