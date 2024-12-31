# lorasensors2homeassistant_v2_1


Integrate Lora sensors into Home Assistant

With this integration Lora "sensors" and "switches" can be integrated. I have tried to make the solution as univeral as possible so it is possible to support all kind of sensors. It is also possible to control swichtes through Home Assistant. In the Node Red flow the Milesight portable socket WS52x nad MClimate Vicki are already configured. These could also be used as example for other sensors.

![image](https://github.com/user-attachments/assets/1e088a27-bd7a-44e3-b14d-580ed334c643)

And here the MClimate Vicki - LoRaWAN Smart Radiator Thermostat 

![image](https://github.com/user-attachments/assets/0563a3ad-1847-41be-9103-c3708893f949)

Below is the chain to integrate the Lora devices

![image](https://github.com/user-attachments/assets/b1411eca-4749-4a5c-9ebc-f3f6d6e824f4)

Prerquests:
 - Working Lora sensors
 - Decoder on Lora server
 - If a sensor needs downlinks a encoder is needed (like a power switch, request software version or request configuration)
 - Node Red running
 - MQTT running and integrated in Home Assistant

You can import lorasensors2homeassistant_v2_1.json on an empty flow. After that you need to do the following steps for the connections:
 - Connect the mqtt connections to the lora server. You can add as many applications as you need. All sensors are indentified by there join_eui
 - Connect the mqtt connections to the mqtt broker which is used by Home Assistant

For sensor configurations, this is done in function "Settings to flow variable (flow.set)".  After every finished change don't forget to click on the inject to activate the changes.

Sensors needs to be defined with there join_eui in the "joinKey2lorakey2ha", there are some examples. The join_eui needs to be registerd in same case as the original message send by the lora server. Currently the following integrations are implemented: sensors, binary_sensor, switch, climate, number and button. in the object from the sensor the first name is the key name what is the the original lora message, all behind in the bracket is used in Home Assistant.

To know which keys the sensor sends it can be found in the decoder or enable debug behind "Collect all data" and check "msg.result.currentData.sensorData" where all received keys are placed. It is also possible to check the "Context Data" and refresh the flow and browse to the sensor.

As extra also the versions from hardware and firmware can be included by defining the correct keys in the arrays in deviceInfo.

Here the example how the MClimate Vicki is defined:
![image](https://github.com/user-attachments/assets/b9e5055b-8aeb-4cc6-a5f4-fc1f1240e4b1)

Here the total flow:

![image](https://github.com/user-attachments/assets/0569d221-6121-417e-beb9-4bf7e4e6608d)

Below part is for debug. Because of the nature from Lora sensors a message is send not often you can enabling below part which save last received message and re-fire the message as many times as you want for debug:

![image](https://github.com/user-attachments/assets/6a2b4471-1152-4a15-b77a-c06f0a7294f9)

