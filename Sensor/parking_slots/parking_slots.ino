
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

short slots_pins[3][2] = {{D1,D3},{D4,D5},{D6,D7}};
String park_slots[3] = {"A1", "A2", "A3"};
bool park_slots_status[3] = {false, false, false};

#define ssid "UiTiOt-E3.1"
#define password "UiTiOtAP"

#define mqtt_server "172.31.11.158"
#define mqtt_port 1883
#define mqtt_topic_parking_slots "parking_slots"
#define mqtt_user "iot"
#define mqtt_pwd "123456"

WiFiClient WIFI_CLIENT;
PubSubClient client(WIFI_CLIENT);

// Hàm kết nối wifi
void setup_wifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Trying to connect to WIFI AP.");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void setup() {
  Serial.begin(9600);
  delay(1000);
  setup_wifi();
  // Subscribe to the topic where our web page is publishing messages
  client.setServer(mqtt_server, mqtt_port); 

  for (int i = 0; i < 3; i++) {
    pinMode(slots_pins[i][0], OUTPUT);
    pinMode(slots_pins[i][1], INPUT);
  }
}

// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect() {
  // Chờ tới khi kết nối
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Thực hiện kết nối với mqtt user và pass
    if (client.connect("parking_slots",mqtt_user, mqtt_pwd)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Đợi 5s
      delay(5000);
    }
  }
}
void loop() {
  if (!client.connected()) {
    reconnect();
  }

  long distance;
  for (int i = 0; i <  3; i++) {
    distance = distance_cal(slots_pins[i][0], slots_pins[i][1]);
    Serial.println("Slot: " + park_slots[i] + " Distance: " + distance);
    bool dt = detected(distance);
    if (dt == park_slots_status[i]) {
      Serial.println("Status not changed");
    } else {
      park_slots_status[i] = dt;
      String msg;
      StaticJsonDocument<2048> body;
      body["message"] = "Car parking slots.";
      body["slot"] = park_slots[i];
      body["status"] = dt ? "unavailable" : "available";
      serializeJson(body, msg); 
      Serial.println((char*)msg.c_str());
      Serial.println(client.publish(mqtt_topic_parking_slots, (char*)msg.c_str()));
    }
  }
 
  client.loop();
  delay(1000);
}

bool detected(long distance) {
  return (distance < 10);
}

long distance_cal(short trigPin, short echoPin) {
  long duration;
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  return (duration / 2) / 29.1;
}