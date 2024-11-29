#include "DHT.h"

// LED and PIR sensor settings
const int ledPin = 13;   // LED pin for PIR
const int pirPin = 3;    // PIR sensor pin
int motion;              // Variable for sensor reading

// DHT11 sensor settings
#define DHTPIN 2        // Digital pin connected to DHT sensor
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Timing settings
int calibrationTime = 30;       // Calibration time for PIR sensor (in seconds)
long unsigned int lowIn;        // Time of last LOW signal from PIR
long unsigned int pause = 5000; // Pause duration for motion stop (in milliseconds)
boolean lockLow = true;         // Lock LOW signal for PIR
boolean takeLowTime;            // Control for low signal timing

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(pirPin, LOW);

  // Calibrate PIR sensor
  Serial.print("Calibrating PIR sensor");
  for(int i = 0; i < calibrationTime; i++){
    Serial.print(".");
    delay(1000);
  }
  Serial.println(" done");
  Serial.println("PIR SENSOR ACTIVE");

  // Initialize DHT sensor
  dht.begin();
  Serial.println(F("DHT sensor initialized"));
}

void loop() {
  // Motion detection with PIR sensor
  motion = digitalRead(pirPin);
  if(motion == HIGH) {
    if(lockLow) {
      lockLow = false;
      Serial.println("Motion detected!");
      digitalWrite(ledPin, HIGH); // Turn LED on
      takeLowTime = true;
    }
  }

  if(motion == LOW) {
    if(takeLowTime) {
      lowIn = millis();
      takeLowTime = false;
    }
    if(!lockLow && millis() - lowIn > pause) {
      lockLow = true;
      Serial.println("Motion stopped!");
      digitalWrite(ledPin, LOW); // Turn LED off
    }
  }

  // Temperature and Humidity readings with DHT11
  delay(3000);  // Wait for a few seconds between readings

  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float f = dht.readTemperature(true);

  // Check if readings are valid
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Heat index calculations
  float hic = dht.computeHeatIndex(t, h, false);
  float hif = dht.computeHeatIndex(f, h);

  // Print readings to Serial Monitor
  // Serial.print(F("Humidity: "));
  // Serial.print(h);
  Serial.print(F("Temperature: "));
  Serial.print(t);
  Serial.println(F("°C"));
  // Serial.print(f);
  // Serial.print(F("°F  Heat index: "));
  // Serial.print(hic);
  // Serial.print(F("°C "));
  // Serial.print(hif);
  // Serial.println(F("°F"));
}
