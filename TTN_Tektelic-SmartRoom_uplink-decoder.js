/**
 * LoRaWAN Payload Decoder for The Things Network (TTN V3)
 * Decodes uplink messages from a multi-sensor device
 * 
 * @param {Object} input - Input object from TTN
 * @param {number[]} input.bytes - Byte array payload
 * @param {number} input.fPort - LoRaWAN fPort
 * @returns {Object} Decoded data object
 */

function decodeUplink(input) {
  var bytes = input.bytes;
  var decoded = {
    data: {},
    warnings: [],
    errors: []
  };

	decoded.data.payloadHex = "";
	for (var i = 0; i < bytes.length; i++) {
		if(bytes[i] < 16) {
			decoded.data.payloadHex += "0" + bytes[i].toString(16);
		} else {
			decoded.data.payloadHex += bytes[i].toString(16);
		}
	}

  try {
    var i = 0;
    
    while (i < bytes.length) {
      // Check if we have enough bytes for header (minimum 3 bytes: channel + type + size)
      if (i + 2 >= bytes.length) {
        decoded.warnings.push("Incomplete payload at byte " + i);
        break;
      }

      var channelId = bytes[i];
      var typeId = bytes[i + 1];
      i += 2;

      // Decode based on channel and type combination
      switch (channelId) {
        
        case 0x00: // Battery Voltage
          if (typeId === 0xFF && i + 1 < bytes.length) {
            var batteryRaw = (bytes[i] << 8) | bytes[i + 1];
            // Convert to signed 16-bit
            if (batteryRaw > 32767) batteryRaw -= 65536;
            decoded.data.battery_voltage = (batteryRaw * 10) / 1000; // Convert to volts
            i += 2;
          }
          break;

        case 0x01: // Reed Switch State
          if (typeId === 0x00 && i < bytes.length) {
            reed_state = bytes[i];
            if (reed_state === 0x00) {
              decoded.data.reed_state = false;
            } else if (reed_state === 0xFF) {
              decoded.data.reed_state = true;
            }
            i += 1;
          }
          break;

        case 0x08: // Reed Switch Count
          if (typeId === 0x04 && i + 1 < bytes.length) {
            decoded.data.reed_count = (bytes[i] << 8) | bytes[i + 1];
            i += 2;
          }
          break;

        case 0x0C: // Impact Alarm
          if (typeId === 0x00 && i < bytes.length) {
            decoded.data.impact_alarm = bytes[i];
            i += 1;
          }
          break;

        case 0x05: // Acceleration Magnitude
          if (typeId === 0x02 && i + 1 < bytes.length) {
            var magnitude = (bytes[i] << 8) | bytes[i + 1];
            decoded.data.impact_magnitude = magnitude / 1000; // Convert to g
            i += 2;
          }
          break;

        case 0x07: // Acceleration Vector
          if (typeId === 0x71 && i + 5 < bytes.length) {
            var xRaw = (bytes[i] << 8) | bytes[i + 1];
            var yRaw = (bytes[i + 2] << 8) | bytes[i + 3];
            var zRaw = (bytes[i + 4] << 8) | bytes[i + 5];
            
            // Convert to signed 16-bit
            if (xRaw > 32767) xRaw -= 65536;
            if (yRaw > 32767) yRaw -= 65536;
            if (zRaw > 32767) zRaw -= 65536;
            
            decoded.data.acceleration = {
              xaxis: xRaw / 1000, // Convert to g
              yaxis: yRaw / 1000,
              zaxis: zRaw / 1000
            };
            i += 6;
          }
          break;

        case 0x0E: // External Connector: Digital Input State
          if (typeId === 0x00 && i < bytes.length) {
            decoded.data.extconnector_state = bytes[i];
            i += 1;
          }
          break;

        case 0x0F: // External Connector: Digital Input Count
          if (typeId === 0x04 && i + 1 < bytes.length) {
            decoded.data.extconnector_count = (bytes[i] << 8) | bytes[i + 1];
            i += 2;
          }
          break;

        case 0x11: // External Connector: Analog Input
          if (typeId === 0x02 && i + 1 < bytes.length) {
            var analogRaw = (bytes[i] << 8) | bytes[i + 1];
            // Convert to signed 16-bit
            if (analogRaw > 32767) analogRaw -= 65536;
            decoded.data.extconnector_analog = analogRaw / 1000; // Convert to volts
            i += 2;
          }
          break;

        case 0x0B: // MCU Temperature
          if (typeId === 0x67 && i + 1 < bytes.length) {
            var mcuTempRaw = (bytes[i] << 8) | bytes[i + 1];
            // Convert to signed 16-bit
            if (mcuTempRaw > 32767) mcuTempRaw -= 65536;
            decoded.data.mcu_temperature = mcuTempRaw * 0.1;
            i += 2;
          }
          break;

        case 0x03: // Ambient Temperature
          if (typeId === 0x67 && i + 1 < bytes.length) {
            var ambientTempRaw = (bytes[i] << 8) | bytes[i + 1];
            // Convert to signed 16-bit
            if (ambientTempRaw > 32767) ambientTempRaw -= 65536;
            decoded.data.ambient_temperature = ambientTempRaw * 0.1;
            i += 2;
          }
          break;

        case 0x04: // Ambient RH
          if (typeId === 0x68 && i < bytes.length) {
            decoded.data.relative_humidity = bytes[i] * 0.5;
            i += 1;
          }
          break;

        case 0x02: // Ambient Light State
          if (typeId === 0x00 && i < bytes.length) {
            decoded.data.light_detected = bytes[i];
            i += 1;
          }
          break;

        case 0x10: // Ambient Light Intensity
          if (typeId === 0x02 && i < bytes.length) {
            decoded.data.light_intensity = bytes[i];
            i += 1;
          }
          break;

        case 0x0A: // Motion (PIR) Event State
          if (typeId === 0x00 && i < bytes.length) {
            decoded.data.motion_event_state = bytes[i];
            i += 1;
          }
          break;

        case 0x0D: // Motion (PIR) Event Count
          if (typeId === 0x04 && i + 1 < bytes.length) {
            decoded.data.motion_event_count = (bytes[i] << 8) | bytes[i + 1];
            i += 2;
          }
          break;

        case 0x09: // Moisture
          if (typeId === 0x00 && i < bytes.length) {
            decoded.data.moisture = bytes[i];
            i += 1;
          }
          break;

        default:
          decoded.warnings.push("Unknown channel ID: 0x" + channelId.toString(16).toUpperCase() + " at byte " + (i - 2));
          // Skip this unknown field - try to continue parsing
          i += 1;
          break;
      }
    }

  } catch (error) {
    decoded.errors.push("Decoding error: " + error.message);
  }

  return decoded;
}
