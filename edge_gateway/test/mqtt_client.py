import json
from paho.mqtt import client
import random

class MQTT_Client:
  def __init__(self, broker, port, client_id, username, password) -> None:
    def on_connect(client, userdata, flags, rc, properties):
      if rc == 0:
        print("Connected to MQTT Broker!")
      else:
        print("Failed to connect, return code %d\n", rc)

    # def on_message(client, userdata, msg):
    #   m_decode = str(msg.payload.decode('utf-8', 'ignore'))
    #   json_recv = json.loads(m_decode)
    #   print(f'Received {json_recv["message"]} from {msg.topic} topic')
    #   if (msg.topic == 'iot/request' and json_recv['request'] == 1):
    #     REQUEST = True

    # When init instance, it will connect to broker
    self.client = client.Client(client_id=client_id, callback_api_version=client.CallbackAPIVersion.VERSION2)
    self.client.username_pw_set(username, password)
    self.client.connect(broker, port)

    self.client.on_connect = on_connect
    # self.client.on_message = on_message

  # Subcribe function
  def subscribe(self, sub_topic):
    self.client.subscribe(sub_topic)

  # Publish function
  def publish(self, pub_topic, msg, data):
    obj_sent = {
      'message': msg,
      'data': data
    }
    json_sent = json.dumps(obj_sent)
    result = self.client.publish(pub_topic, json_sent)
    status = result[0]
    if status == 0:
      print(f"Send `{msg}` to topic `{pub_topic}`")
    else:
      print(f"Failed to send message to topic {pub_topic}")

  # Start loop function
  def start(self, is_forever):
    if (is_forever):
      self.client.loop_forever()
    else:
      self.client.loop_start()

  # Stop loop function
  def stop(self):
    self.client.loop_stop()

if __name__ == '__main__':
  broker = 'localhost'
  port = 1883
  client_id = f'python-mqtt-{random.randint(0, 1000)}'
  username = 'iot'
  password = '123456'

  mqtt_client = MQTT_Client(broker, port, client_id, username, password)
  mqtt_client.subscribe('check')
  mqtt_client.start(False)
  while True:
    i = input()
    if (i == 'q'):
      mqtt_client.stop()
      break
    if (i == 'p'):
      mqtt_client.publish('test_topic', 'anything', {123: 345})