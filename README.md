# lorasensors2homeassistant_v2_1


### Integrate Lora sensors into Home Assistant

With this integration Lora "sensors" and "switches" can be integrated. I have tried to make the solution as univeral as possible so it is possible to support all kind of sensors. It is also possible to control swichtes through Home Assistant. In the Node Red flow the following devices are already defined:
 - Elsys: ERS smart building sensor
 - Milesight: Smart Portable Socket WS52x
 - MClimate:  Vicki
 - MClimate:  Wireless Thermostat
 - OfficeSense: Comfort, Desk and Presence
 - Tektelic: Smart Room Sensor - PIR

These definitions could also be used as example for other sensors.

![image](https://github.com/user-attachments/assets/1e088a27-bd7a-44e3-b14d-580ed334c643)

And here the MClimate Vicki - LoRaWAN Smart Radiator Thermostat

<img src="https://github.com/user-attachments/assets/70c8a6de-c5c3-433f-9d89-ac2fd8bc776b" width="300" />

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

![image](https://github.com/user-attachments/assets/2cc79e53-dbba-4fbe-9607-450112647b00)

Here is the total flow:

![image](https://github.com/user-attachments/assets/fb74113d-a1ec-46c0-bb6b-7a1eec6bd39b)

Below part is for debug. Because of the nature from Lora sensors a message is send not often you can enabling below part which save last received message and re-fire the message as many times as you want for debug:

![image](https://github.com/user-attachments/assets/2ffdb77b-5947-47b0-8393-2c747ce553b3)


### How to configure a new type of device

When "debug Collect data" is enabled you can find the "join_eui" in "result.loraData.metaData.join_eui".

The first thing is to add the join_eui as key in "Settings to flow variable (flow.set)" under "joinKey2lorakey2ha" as follows:
```
        "<the_join_eui>": {
            device: {
                manufacturer: { name: "<manufacturer_name>" },
                model: { name: "<model_name>"},
            },
            sensor: {
                rssi: { name: "signal_strength", device_class: "signal_strength", unit_of_measurement: "dBm", icon: "mdi:signal", entity_category: "diagnostic" },
            },
        },

```

Don't forget after Deploy to activate it by a click on "timestamp". Now the flow will try to process the data and we can check the result at the end of processing integrations, currently it is "debug integration button". In the message you can see which key's are available for configuration. Depend on what kind of device it is to configure the apportiate integration ("sensor", "binary_sensor", "climate" etc).

Here a example from temprature:
```
  sensor: {
	tempC: { name: "temperature", device_class: "temperature", unit_of_measurement: "°C" },
  },
```

Here is "tempC" the name which came from the lora server, within Home Assistant it is registered in the "sensor" integration and translated to "temperature". In the documentation of the integration "sensor" there is a device_class "temperature" and the possible "unit_of_measurement"

A key from the lora server can be defined in multiple intergations if needed but only once per integration.

It is also possible to add extra attributes:
 - icon: for a manual defined icon for the integration value
 - value or value_default: give the variable a fixed value or a default if there is not yet a value available. defaults is good to use when the variable is only available when requesting it through a downlink
 - downlink: when there is a posibility to control a value or request data from the device with a fPort and a command (downlink encoder requered)
 - entity_category: to place an integration value in config or diagnostic box

For climate and number it is also needed to define the primary key in device.

Al the result from the paramaters (don't forget to click on "timestamp" to activate after you have deployed it) could be found in the debug under "result.integration" and the eventually data which will be send to Home Assistant in "result.haConfigQueue" and "result.haValueQueue"
