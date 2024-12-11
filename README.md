# lorasensors2homeassistant
Integrate Lora sensors in Home Assistant


![image](https://github.com/user-attachments/assets/96b2897e-cf5b-4b69-8fa1-196120f5b58c)

Prerquests:
 - working Lora sensors
 - decoder on Lora server
 - if a sensor needs downlinks a encoder is needed (like a power switch)
 - Node Red running
 - MQTT running and integrated in Home Assistant

You can import lorasensors2homeassistant.json on an empty flow. After that you need to do the following steps for the connections:
 - connect the mqtt connections to the lora server. You can add as many applications as you need. All sensors are indexed by there join_eui
 - connect the mqtt connections to the mqtt broker which is used by Home Assistant

For sensor configurations, this is done in function "Settings to flow variable (flow.set)". The sensors needs to be defined whith there join_eui in the joinKey2device, there are some examples there. join_eui needs to be registerd in lower case.

For the sensor keys and values there are 3 parts:
 - sensorKeyTranslate: here the key kan be renamed to your prefered name or one of the device_classes
 - sensor2device_class: when the name is not the same as device class you can link the cvalue to the correct device_class
 - sensor_device_class: this is the list from Home Assistant with all possible measurments. If the "unit_of_measurement" does not excist or has the wrong value you can change it here

To know which keys the sensor sends it can be found in the decoder or enable "debug 5" and check "msg.result.currentData.sensorData" where all received keys are placed. It is also possible to check the "Context Data" and refresh the flow and browse to the sensor.

As extra als the version hardware and firmware can be included by devining the correct keys in the arrays in deviceInfo

![image](https://github.com/user-attachments/assets/0f35e7ac-0f97-4cd4-b1c7-2055b4487486)
