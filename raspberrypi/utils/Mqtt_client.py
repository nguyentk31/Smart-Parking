import json
from paho.mqtt import client
import raspberrypi.utils.common_vars_consts as cvc

class MQTT_Client:
  def __init__(self, broker, port, pub_topic, sub_topic, client_id, username, password) -> None:
    def on_connect(client, userdata, flags, rc, properties):
      if rc == 0:
        print("Connected to MQTT Broker!")
      else:
        print("Failed to connect, return code %d\n", rc)

    self.pub_topic = pub_topic
    self.sub_topic = sub_topic

    # When init instance, it will connect to broker
    self.client = client.Client(client_id=client_id, callback_api_version=client.CallbackAPIVersion.VERSION2)
    self.client.username_pw_set(username, password)
    self.client.on_connect = on_connect
    self.client.connect(broker, port)

  # Subcribe function
  def subscribe(self):
    def on_message(client, userdata, msg):
      m_decode = str(msg.payload.decode('utf-8', 'ignore'))
      json_recv = json.loads(m_decode)
      print(f'Received {json_recv['message']} from {msg.topic} topic')
      if (json_recv['request'] == 1):
        cvc.REQUEST = True

    self.client.subscribe(self.sub_topic)
    self.client.on_message = on_message

  # Publish function
  def publish(self, msg, data):
    obj_sent = {
      'message': msg,
      'data': data
    }
    json_sent = json.dumps(obj_sent)
    result = self.client.publish(self.pub_topic, json_sent)
    status = result[0]
    if status == 0:
      print(f"Send `{msg}` to topic `{self.pub_topic}`")
    else:
      print(f"Failed to send message to topic {self.pub_topic}")

  # Start loop function
  def start(self):
    print('Start subscribe mqtt broker!')
    self.client.loop_forever()

  # Stop loop function
  def stop(self):
    self.client.loop_stop()
