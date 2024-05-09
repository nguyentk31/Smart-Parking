// khai báo thư viện
#include <Servo.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Chân servo
int servoPin = D8;
Servo myservo;
short gate_pins[2] = {D6, D7};
bool gate_status = false;
// Thông tin WIFI AP
#define ssid "UiTiOt-E3.1"
#define password "UiTiOtAP"

#define mqtt_server "172.31.11.158"
#define mqtt_port 1883
#define mqtt_topic_parking_servo "parking_servo"
#define mqtt_topic_parking_gate "parking_gate"
#define mqtt_user "iot"
#define mqtt_pwd "123456"

WiFiClient WIFI_CLIENT;
PubSubClient client(WIFI_CLIENT);

// Hàm call back để nhận dữ liệu
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String payload_str = String(( char *) payload);
  Serial.println(payload_str);
  StaticJsonDocument<2048> msg;
  deserializeJson(msg, payload_str);
  if (msg["status"]) action();
}

void action(){
  myservo.write(180);
}
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
  // Set the message received callback
  client.setCallback(callback);
  // myservo.attach(servoPin);
  pinMode(gate_pins[0], OUTPUT);
  pinMode(gate_pins[1], INPUT);
  
}
// Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect() {
  // Chờ tới khi kết nối
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Thực hiện kết nối với mqtt user và pass
    if (client.connect("parking_gateway",mqtt_user, mqtt_pwd)) {
      Serial.println("connected");
      // ... và nhận lại thông tin này
      client.subscribe(mqtt_topic_parking_servo);
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
  // Check Gate
  distance = distance_cal(gate_pins[0], gate_pins[1]);
  Serial.print("Gate: Distance: ");
  Serial.println(distance);
  bool dt = detected(distance);
  if (dt == gate_status) {
    Serial.println("Status not changed");
  } else {
    gate_status = dt;
    String msg;
    StaticJsonDocument<2048> body;
    body["message"] = "Car parking gate.";
    body["status"] = gate_status;
    serializeJson(body, msg); 
    Serial.println((char*)msg.c_str());
    Serial.println(client.publish(mqtt_topic_parking_gate, (char*)msg.c_str()));
  }

  client.loop();
  delay(1000);
}
bool detected(long distance){
  return (distance < 5);
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
