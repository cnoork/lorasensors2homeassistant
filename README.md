# lorasensors2homeassistant
Integrate Lora sensors in Home Assistant

With this integration Lora "sensors" and "switches" can be integrated. I have tried to make the solution as univers as possible so it is possible to support all kind of sensors. It is also possible to control swichtes through Home Assistant. In the Node Red flow the Milesight portable socket WS52x is already configured.

![image](https://github.com/user-attachments/assets/ee9f0d4f-3f06-426f-8311-82cb20d8637e)

Below is the chain to integrate the Lora devices

![image](https://github.com/user-attachments/assets/96b2897e-cf5b-4b69-8fa1-196120f5b58c)

Prerquests:
 - Working Lora sensors
 - Decoder on Lora server
 - If a sensor needs downlinks a encoder is needed (like a power switch)
 - Node Red running
 - MQTT running and integrated in Home Assistant
 - Sensor data a single value and not an object

You can import lorasensors2homeassistant.json on an empty flow. After that you need to do the following steps for the connections:
 - Connect the mqtt connections to the lora server. You can add as many applications as you need. All sensors are indentified by there join_eui
 - Connect the mqtt connections to the mqtt broker which is used by Home Assistant

For sensor configurations, this is done in function "Settings to flow variable (flow.set)".  After every finished change don't forget to click on the inject to activate the changes.

Sensors needs to be defined whith there join_eui in the "joinKey2device", there are some examples there. The join_eui needs to be registerd in lower case.

For the sensor keys and values there are 3 parts where changes could be done:
 - "sensorKeyTranslate": here the key kan be renamed to your prefered name or one of the device_classes (charcters in key's with a <underscore> will be replced with a <space> for variable name in Home Assistant)
 - "sensor2device_class": when the key name does not excist as device_class you can link the value to the correct device_class
 - "sensor_device_class": this is the list from Home Assistant with all possible sensor measurments. If the "unit_of_measurement" does not excist or has the wrong value you can change it here

To know which keys the sensor sends it can be found in the decoder or enable "debug 5" and check "msg.result.currentData.sensorData" where all received keys are placed. It is also possible to check the "Context Data" and refresh the flow and browse to the sensor.

As extra also the versions from hardware and firmware can be included by defining the correct keys in the arrays in deviceInfo

![image](https://github.com/user-attachments/assets/0f35e7ac-0f97-4cd4-b1c7-2055b4487486)
