/**
 * Payload Decoder for The Things Network
 *
 * Copyright 2023 Milesight IoT
 *
 * @product WS52x
 */
function Decoder(bytes, port) {
    return milesightCustom(bytes);
}

function milesightCustom(bytes) {
    var decoded = {};

    var payloadHex = ""
    for (var j = 0; j < bytes.length; j++) {
		if(bytes[j] < 16) {
			payloadHex += "0" + bytes[j].toString(16);
		} else {
			payloadHex += bytes[j].toString(16);
		}
//    decoded.payloadHex = payloadHex;
	}

	for (var i = 0; i < bytes.length; i++) {
		var channel_id = bytes[i];
		var channel_type = bytes[i+1];

		if(channel_id == 0x03) {
			// VOLTAGE
			if(channel_type == 0x74) {
				decoded.voltage = ((bytes[i+3] << 8) | (bytes[i+2])) / 10;
				i += 2;
			}
		}

		else if (channel_id === 0x04) {
			// ACTIVE POWER
			if (channel_type === 0x80) {
				decoded.power = (bytes[i+5] << 24) + (bytes[i+4] << 16) + (bytes[i+3] << 8) + bytes[i+2];
				i += 5;
			}
		}

		else if (channel_id === 0x05) {
			// POWER FACTOR
			if (channel_type === 0x81) {
				decoded.factor = bytes[i+2];
				i += 2;
			}
		}
      
		else if (channel_id === 0x06) {
			// POWER CONSUMPTION
			if (channel_type == 0x83) {
				decoded.power_sum = (bytes[i+5] << 24) + (bytes[i+4] << 16) + (bytes[i+3] << 8) + bytes[i+2];
				i += 5;
			}
		}
      
		else if (channel_id === 0x07) {
			// CURRENT
			if (channel_type == 0xc9) {
				decoded.current = (bytes[i+3]< 8) + bytes[i+2];
				i += 3;
			}
		}

		else if (channel_id === 0x08) {
			// STATE
			if (channel_type == 0x70) {
				decoded.state = bytes[i+2] == 1 || bytes[i+2] == 0x11 ? "open" : "close";
				i += 2;
			}
		}
      
		else if (channel_id === 0xff) {
			if (channel_type === 0x01) {
				decoded.protocalVersion = bytes[i+2];
				i += 2;
			}
        
			else if (channel_type === 0x09) {
				decoded.hardwareVersion = bytes[i+2].toString(16) + "." + bytes[i+3].toString(16);
				i += 3;
			}
        
			else if (channel_type === 0x0a) {
				decoded.softwareVersion = bytes[i+2].toString(16) + "." + bytes[i+3].toString(16);
				i += 3;
			}
        
			else if (channel_type === 0x0b) {
				decoded.powerOn = bytes[i+2];
				i += 2;
			}
		  	
			else if (channel_type === 0x16) {
				//decoded.deviceSN =  (bytes[i+9] << 52) + (bytes[i+8] << 48) + (bytes[i+7] << 40) + (bytes[i+6] << 32) + 
				                    (bytes[i+5] << 24) + (bytes[i+4] << 16) + (bytes[i+3] << 8) + bytes[i+2];
				decoded.deviceSN = "";
        for (var m = 0; m <= 7; m++) {
		      if(bytes[i + 2 + m] < 16) {
			      pdecoded.deviceSN += "0" + bytes[i + 2 + m].toString(16);
		      } else {
			      decoded.deviceSN += bytes[i + 2 + m].toString(16);
		      }
        }
				i += 9;
			}
  			
			else if (channel_type === 0x24) {
	  			decoded.overcurrentAlarm = {
	  			  threshold: bytes[i+3]
	  			};
  				if(bytes[i+2] === 0) {
	  			  decoded.overcurrentAlarm.status = "disabled";
  				} else {
  				  decoded.overcurrentAlarm.status = "enabled";
  				}
		  		i += 3;
			}
			  
			else if (channel_type === 0x25) {
  				if((bytes[i+3] << 8) + bytes[i+2] === 0) {
  				  decoded.buttonLock = "disabled";
  				} else {
  				  decoded.buttonLock = "enabled";
  				}
	  			i += 3;
		  	}
		  	
		  	else if (channel_type === 0x26) {
  				if(bytes[i+2] === 0) {
  				  decoded.powerConsumptionState = "disabled";
  				} else {
  				  decoded.powerConsumptionState = "enabled";
  				}
				i += 2;
  			}
  			
  			else if (channel_type === 0x30) {
	  			decoded.overcurrentProtection = {
					threshold: bytes[i+3]
	  			};
  				if(bytes[i+2] === 0) {
	  			  decoded.overcurrentProtection.status = "disabled";
  				} else {
  				  decoded.overcurrentProtection.status = "enabled";
  				}
			  	i += 3;
  			}
  			
  			else if (channel_type === 0x3f) {
	  			decoded.outage = bytes[i+2] === 0xff ? 1 : 0;
		  		i += 2;
			}
		}
	}
	return decoded;
}
