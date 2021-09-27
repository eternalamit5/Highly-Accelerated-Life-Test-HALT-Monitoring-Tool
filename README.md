# Highly Accelerated Life Test (HALT) Profile Monitoring Tool

1. Highly Accelerated Life Testing (HALT) Profile is stress screening methodology where real profiles of data is used to evaluate the reliability of electronics devices, mainly Printed Circuit Boards (PCBs).

2. This project aims at building a tool capable of monitoring HALT Program for identifying defects and weak links in the PCBs.



## Components Used

1. Espressif ESP32 Microcontroller

2. Bosch BMI 160 Inertial Measurement Unit


![image](https://user-images.githubusercontent.com/44448083/134967620-c8cce463-c3c9-40c3-ba44-a41f5fa6ee59.png)

Capacitor breakage observed during vibration HALT program

![image](https://user-images.githubusercontent.com/44448083/134968021-37a54dff-ca05-4674-8cbc-5c27ed7c075c.png)
![image](https://user-images.githubusercontent.com/44448083/134968056-f9ba0c9c-5ff0-46af-af51-cdcc7f979986.png)
Comparison of raw and calibrated Accelerometer data when Z-axis is facing upward




![image](https://user-images.githubusercontent.com/44448083/134967902-c2625743-deda-490b-a31e-42c6004b9294.png)

![image](https://user-images.githubusercontent.com/44448083/134967937-5308c0b2-f346-4903-bce2-324b0dffbb78.png)

Comparison of raw and calibrated Gyroscope data


## Note

1. Since the IoT Stack is very often used in IoT Setups, therefore it is independent, dockerized and can be used standalone for various scenarios. The IoT stack is present in the directory: Highly-Accelerated-Life-Test-HALT-Monitoring-Tool/webClient/IoT Stack


2. Refer to `README.md` in each case directory for additional information.


