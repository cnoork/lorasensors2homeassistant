// Capgemini OfficeSense Payload Decoder (19 November 2024)

//function decodeUplink(input) {                    // Loriot
//	const bytes = input.bytes;
//	const fPort = input.fPort;
//	const recvTime = input.recvTime;
//	const result = {
//		data: officeSenseDecoder(bytes),
//		errors: [],
//		warnings: [],
//	};
//	return result;
//}

//function Decode(port, bytes) {                  // Brocaar - ChirpStack
//	officeSenseDecoder(bytes)
//}

// function decodeUplink(input) {                  // Chirpstack & ThingPark - Actility
//	bytes = input.bytes;                            // Chirpstack & ThingPark - Actility
//	port = input.fPort;                             // Chirpstack & ThingPark - Actility
//	data = officeSenseDecoder(bytes)
//}

//function Decoder(bytes, port) {                  // TTI/TTN - The Things Stack
//	officeSenseDecoder(bytes)
//}

function decodeUplink(input) {                 // TTI/TTN - The Things Stack
  return {
    data: officeSenseDecoder(input.bytes),
    warnings: [],
    errors: []
  };
}

function officeSenseDecoder(bytes) {

	var TYPE_build               = 0x01; // Build timestamp                                    ( 7 bytes)
	var TYPE_HW_V                = 0x02; // Hardware Version                                   ( 1 bytes)
	var TYPE_SW_V                = 0x03; // Software Version                                   ( 2 bytes)
	var TYPE_PCBID               = 0x04; // PCB Identifier (PXXXXXX)                           ( 3 bytes)
	var TYPE_PCBV                = 0x05; // PCB Identifier version (VXX)                       ( 1 bytes)

	var TYPE_hbInterval          = 0x10; // Heartbeat msg Interval                             ( 2 bytes)
	var TYPE_loraRejoinCnt       = 0x12; // Number of msgs needed before forced new join       ( 1 bytes)

	var TYPE_devFunction         = 0x20; // Device Function                                    ( 1 bytes)
	var TYPE_devBattery          = 0x22; // Device Battery lvl [mV]                            ( 2 bytes)
	var TYPE_devBatteryPerc	     = 0x23; // Device Battery lvl [%]                             ( 1 bytes)
	
	var TYPE_FUOTA_status        = 0x25; // FUOTA status / errors                              ( 1 bytes)
	var TYPE_FUOTA_src           = 0x26; // FUOTA current firmware CRC                         ( 2 bytes)
	var TYPE_FUOTA_dst           = 0x27; // FUOTA update firmware CRC                          ( 2 bytes)
	var TYPE_FUOTA_frag_received = 0x28; // FUOTA update fragments received                    ( 2 bytes)
	var TYPE_FUOTA_frag_needed   = 0x29; // FUOTA update fragments needed                      ( 2 bytes)

	var TYPE_TempC               = 0x30; // Temperature (deg C)                                ( 2 bytes)
	var TYPE_TempF               = 0x31; // Temperature (deg F)                                ( 2 bytes)
	var TYPE_Humidity            = 0x32; // Humidity (%)                                       ( 1 bytes)
	var TYPE_CO2                 = 0x33; // CO2 (ppm)                                          ( 2 bytes)
	var TYPE_Lux                 = 0x34; // Light level (Lux)                                  ( 2 bytes)
	var TYPE_Sound               = 0x35; // Noise level                                        ( 2 bytes)
	var TYPE_O2                  = 0x36; // O2 level (%)                                       ( 1 bytes)
	var TYPE_O2_Tau				 = 0x37; // O2 Tau value									   ( 2 bytes)

	var TYPE_nSamplesNeeded      = 0x40; // Config: number of samples                          ( 1 bytes)
	var TYPE_tSample             = 0x41; // Config: time between samples                       ( 2 bytes)
	var TYPE_tStopped            = 0x42; // Config: silence time after msg                     ( 2 bytes)
	var TYPE_tIdle               = 0x43; // Config: time before releasing room                 ( 2 bytes)
	var TYPE_nSamplesTaken       = 0x44; // Number of samples taken during FP                  ( 1 bytes)
	var TYPE_nSamplesPos         = 0x45; // Number of samples detected motion                  ( 1 bytes)
	var TYPE_occupied            = 0x46; // Room occupied? (1=yes, 0=no)                       ( 1 bytes)
	var TYPE_activity            = 0x47; // Activity level based on motion (0 ~ 255)           ( 1 bytes)
	var TYPE_activityThresh      = 0x48; // Threshold for claiming a desk as occupied          ( 1 bytes)
	var TYPE_thresholdHyst       = 0x49; // Hysteresis used when occupied (0 = ignored)        ( 1 bytes)

	var TYPE_SensorEnable_CS     = 0x60; // Determine Which sensors are used                   ( 1 bytes)
	var TYPE_tSample_CS          = 0x61; // Sample time (MCU wakes up every x seconds          ( 2 bytes)
	var TYPE_TempC_CS            = 0x62; // Temperature delta value                            ( 2 bytes)
	var TYPE_Humidity_CS         = 0x63; // Humidity delta value                               ( 2 bytes)
	var TYPE_CO2_CS              = 0x64; // CO2 delta value                                    ( 2 bytes)
	var TYPE_LIGHT_CS            = 0x65; // Light delta value                                  ( 2 bytes)
	var TYPE_CO2_CalCnt          = 0x66; // CO2 Calibration Counter                            ( 3 bytes)
	var TYPE_MinReportInterval   = 0x67; // Minimum interval at which the Comfort data is sent ( 2 bytes)
	var TYPE_Sound_CS            = 0x68; // Sound sensor delta                                 ( 2 bytes)

	var TYPE_PC_cntA             = 0x80; // People Counter count in direction A                ( 2 bytes)
	var TYPE_PC_cntB             = 0x81; // People Counter count in direction B                ( 2 bytes)
	var TYPE_PC_cntCorA          = 0x82; // People Counter Correction direction A              ( 2 bytes)
	var TYPE_PC_cntCorB          = 0x83; // People Counter Correction direction B              ( 2 bytes)
	var TYPE_PC_direction        = 0x84; // Direction Toggle Flag                              ( 1 bytes)

	var TYPE_BB_Thresh_alrm      = 0x91; // 'Alarm' threshold (%)                              ( 1 bytes)
	var TYPE_BB_Thresh_warn      = 0x92; // 'Warning' threshold (%)                            ( 1 bytes)
	var TYPE_BB_Manual           = 0x93; // If this reading is manually triggered              ( 1 bytes)
	var TYPE_O2_CalibParam		 = 0x9A; // O2 Calibration Parameters (a ~ i)				   (18 bytes)

	var TYPE_Reboot              = 0xE0; // Reboot trigger                                     ( 0 bytes)
	var TYPE_ResetFactory        = 0xE1; // Reset to factory defaults                          ( 0 bytes)

	var TYPE_noInfo              = 0xFF; // No data

	var obj = {};

	obj.payloadHex = "";
	for (var i = 0; i < bytes.length; i++) {
		if(bytes[i] < 16) {
			obj.payloadHex += "0" + bytes[i].toString(16);
		} else {
			obj.payloadHex += bytes[i].toString(16);
		}
	}

	for(i = 0; i < bytes.length; i++) {
		switch(bytes[i]) {
			// 0x01 - Build timestamp
			case TYPE_build:{
				var year      = (bytes[i+1] << 8) | bytes[i+2];
				var month     =  bytes[i+3];
				var day       =  bytes[i+4];
				var hour      =  bytes[i+5];
				var minutes   =  bytes[i+6];
				var seconds   =  bytes[i+7];
				var buildnum  = new Date(year, month-1, day, hour, minutes, seconds);
				obj.buildnum  = buildnum.toString();

				// Next parameter
				i+=7;
				break;
			}

			// 0x02 - Hardware Version
			case TYPE_HW_V:{
				obj.hwVersion = bytes[i+1];

				// Next parameter
				i+=1;
				break;
			}

			// 0x03 - Software Version
			case TYPE_SW_V:{
				obj.swVersion = bytes[i+1] + "." + bytes[i+2];

				// Next parameter
				i+=2;
				break;
			}

			// 0x04 - PCB identifier (PXXXXXX)
			case (TYPE_PCBID):{
				var pcbID = "P";
				for(var j = 0; j < 3; j++){
					var val = parseInt(bytes[i + 1 + j]);
					if(val < 10){pcbID += '0';}
					pcbID += val.toString();
				}
				obj.pcbID = pcbID;

				// Next parameter
				i+=3;
				break;
			}

			// 0x05 - PCB identifier version (VXX)
			case (TYPE_PCBV):{
				obj.pcbv = bytes[i+1];

				// Next parameter
				i+=1;
				break;
			}

			// 0x10 - Heartbeat msg Interval
			case TYPE_hbInterval:{
				obj.hbInterval = (bytes[i+1] << 8) | (bytes[i+2]);

				// Next parameter
				i+=2;
				break;
			}

			// 0x12 - Number of msgs needed before forced new join
			case TYPE_loraRejoinCnt:{
				var loraRejoinCnt = bytes[i+1];
				obj.loraRejoinCnt = loraRejoinCnt*100;

				// Next parameter
				i+=1;
				break;
			}

			// 0x20 - obsolete, only with first firmware
			case TYPE_devFunction:{

				// Next parameter
				i+=1;
				break;
			}

			// 0x22 - Device Battery lvl [mV]
			case TYPE_devBattery:{
				var vdd = (bytes[i+1] << 8) | (bytes[i+2]);
				obj.vdd = vdd/1000;

				// Percentage calculation if not excist
				if(obj.vddPct == undefined){
					vddMax = 6.0;
					vddMin = 3.3;

					if(obj.vdd < 3.8) {
						vddMax = 3;
						vddMin = 1.7;
					}

					vddPct = ((obj.vdd - vddMin) / (vddMax - vddMin)) * 100;
					vddPct = Math.round(vddPct);
					if(vddPct > 100){ vddPct = 100; }
					if(vddPct < 1){ vddPct = 1; }

					obj.vddPct = vddPct;
				}

				// Next parameter
				i+=2;
				break;
			}
			
			// 0x23 - Device Battery lvl [%]
			case TYPE_devBatteryPerc:{
				var vddPct = bytes[i+1];
				obj.vddPct = vddPct;
				
				// Next parameter
				i += 1;
				break;
			}
			
			// 0x25 - FUOTA status / errors
			case TYPE_FUOTA_status:{
				// Textual representation of the fuota states
				var fuota_states = [
					"OK", 
					"Fragment Error: Invalid msg size",
					"Fragment Error: Fragment not a multiple of 4 bytes",
					"Fragment Error: Update fw already installed",
					"Fragment Error: (Delta update) Fragment src does not match current fw",
					"Fragment Error: Memory constraint -> Could not create FUOTA session",
					"Update Error: Could not unpack fragments",
					"Update Error: Memory error occured during unpacking",
					"Update Error: Invalid CRC for unpacked fw update",
					"Update Error: Invalid signature for unpacked fw update",
					"Update Error: Update could not be loaded into bootloader",
				];
				
				var statusID = bytes[i+1];
				var status = "Unrecognized status ID: " + statusID;
				if(statusID >= 0 && statusID <= 10){
					status = fuota_states[statusID];
				}
				
				obj.fuotaStatusId = statusID;
				obj.fuotaStatus = status;
				
				// Next parameter
				i += 1;
				break;
			}
			
			// 0x26 - FUOTA current firmware CRC
			case TYPE_FUOTA_src:{
				srcHex = ""
				for(n = 1; n < 3; n++){
					val = bytes[i+n]
					if(val < 16){
						srcHex += "0";
					}
					srcHex += val.toString(16);
				}
				obj.fuotaSrc = srcHex;
				
				// Next parameter
				i+=2;
				break;
			}
			
			// 0x27 - FUOTA update firmware CRC
			case TYPE_FUOTA_dst:{
				dstHex = ""
				for(n = 1; n < 3; n++){
					val = bytes[i+n]
					if(val < 16){
						dstHex += "0";
					}
					dstHex += val.toString(16);
				}
				obj.fuotaDst = dstHex;
				
				// Next parameter
				i+=2;
				break;
			}
			
			// 0x28 - FUOTA update fragments received
			case TYPE_FUOTA_frag_received:{
				obj.fuotaFragCnt = (bytes[i+1] << 8) | (bytes[i+2]);
				
				// Next parameter
				i+=2;
				break;
			}
			
			// 0x29 - FUOTA update fragments needed
			case TYPE_FUOTA_frag_needed:{
				obj.fuotaFragTotal = (bytes[i+1] << 8) | (bytes[i+2]);
				
				// Next parameter
				i+=2;
				break;
			}

			// 0x30
			case TYPE_TempC:{
				var tempC = (bytes[i+1] << 8) | (bytes[i+2]);
				if(tempC > 32768){
					tempC -= 65536;
				}
//				if(tempC > 1000 && temp < 4000) {
					obj.tempC = tempC/100;
//				} else {
//					obj.tempCError = tempC/100;
//				}

				// Next parameter
				i+=2;
				break;
			}

			// 0x31 - obsolete, only with first firmware
			case TYPE_TempF:{

				// Next parameter
				i+=2;
				break;
			}

			// 0x32 - Humidity (%)
			case TYPE_Humidity:{
				obj.humidity = (bytes[i+1]);

				// Next parameter
				i+=1;
				break;
			}

			// 0x33 - CO2 (ppm)
			case TYPE_CO2:{
				var co2 = (bytes[i+1] << 8) | (bytes[i+2]);
				
				if(co2 > 400 && co2 < 4990) {
					obj.co2 = co2;
				} else {
					obj.co2Error = co2;
				}

				// Next parameter
				i+=2;
				break;
			}

			// 0x34 - Light Level (Lux)
			case TYPE_Lux:{
				obj.lux = (bytes[i+1] << 8) | (bytes[i+2]);

				// Next parameter
				i+=2;
				break;
			}

			// 0x35 - Sound level
			case TYPE_Sound:{
				obj.sound = (bytes[i+1] << 8) | (bytes[i+2]);

				// Next parameter
				i+=2;
				break;
			}

			// 0x36 - O2 level
			case TYPE_O2:{
				obj.o2 = (bytes[i+1]) / 10;

				// Next parameter
				i+=1;
				break;
			}
			
			// 0x37 - O2 Tau value
			case TYPE_O2_Tau:{
				obj.tau = (bytes[i+1] << 8) | (bytes[i+2]) / 320;

				// Next parameter
				i += 2;
				break;
			}

 			// 0x40 - number of samples - old firmware skip
			case TYPE_nSamplesNeeded:{
			
				// Next parameter
				i+=1;
				break;
			}

			// 0x41 - time between samples - old firmware skip
			case TYPE_tSample:{

				// Next parameter
				i+=2;
				break;
			}

			// 0x42 - silence time after msg
			case TYPE_tStopped:{
				obj.tStopped = (bytes[i+1] << 8) | (bytes[i+2]);

				// Next parameter
				i+=2;
				break;
			}

			// 0x43 - time before releasing room
			case TYPE_tIdle:{
				obj.tIdle = (bytes[i+1] << 8) | (bytes[i+2]);

				// Next parameter
				i+=2;
				break;
			}

			// 0x44 - Number of samples taken during FP
			case TYPE_nSamplesTaken:{
				obj.nSample = bytes[i+1];

				// Next parameter
				i+=1;
				break;
			}

			// 0x45 - Number of samples detected motion
			case TYPE_nSamplesPos:{
				obj.nPositive = (bytes[i+1]);

				// Next parameter
				i+=1;
				break;
			}

			// 0x46 - Room occupied? (1=yes, 0=no)
			case TYPE_occupied:{
				obj.occupied = (bytes[i+1]);

				// Next parameter
				i+=1;
				break;
			}

			// 0x47 - Activity level based on motion (0 ~ 255)
			case TYPE_activity:{
				obj.activity = (bytes[i+1]);

				// Next parameter
				i+=1;
				break;
			}

			// 0x48 - Threshold for claiming a desk as occupied
			case TYPE_activityThresh: {
				obj.activityThreshold = (bytes[i + 1]);

				// Next parameter
				i += 1;
				break;
			}

			// 0x49 - Hysteresis used when occupied (0 = ignored)
			case TYPE_thresholdHyst: {
				obj.thresholdHyst = (bytes[i + 1]);

				// Next parameter
				i += 1;
				break;
			}

			// 0x61 - Sample time (Comfort sensors are triggered every x seconds)
			case TYPE_tSample_CS:{
				obj.tSampleCS = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i+=2;
				break;
			}

			// 0x62 - Temperature delta value and minTimeInterval
			case TYPE_TempC_CS:{
				var tempCDelta = (bytes[i + 1] << 8) | bytes[i + 2];
				obj.tempCDelta = tempCDelta/100;

				// Next parameter
				i+=2;
				break;
			}

			// 0x63 - Humidity delta value and minTimeInterval
			case TYPE_Humidity_CS:{
				obj.humidityDelta = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i+=2;
				break;
			}

			// 0x64 - CO2 delta value and minTimeInterval
			case TYPE_CO2_CS:{
				obj.co2Delta = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i+=2;
				break;
			}

			// 0x65 - light delta value and minTimeInterval
			case TYPE_LIGHT_CS:{
				obj.lightDelta = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i+=2;
				break;
			}

			// 0x66 - CO2 Calibration Counter
			case TYPE_CO2_CalCnt: {
				obj.co2CalCounter = (bytes[i + 1]);

				// Next parameter
				i += 1;
				break;
			}

			// 0x67 - Minimum interval at which the Comfort data is sent
			case TYPE_MinReportInterval: {
				obj.minTimeIntervalCS = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i+=2;
				break;
			}

			// 0x68 - Sound sensor delta
			case TYPE_Sound_CS: {
				obj.soundDelta = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i+=2;
				break;
			}

			// 0x80 - People Counter count in direction A
			case TYPE_PC_cntA: {
//				if(!pcCnt) {
//					pcCnt = {}
//				}
//				pcCnt.cntA = (bytes[i + 1] << 8) | bytes[i + 2];
				obj.cntA = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i += 2;
				break;
			}

			// 0x81 - People Counter count in direction B
			case TYPE_PC_cntB: {
//				if(!pcCnt) {
//					pcCnt = {}
//				}
//				pcCnt.cntB = (bytes[i + 1] << 8) | bytes[i + 2];
				obj.cntB = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i += 2;
				break;
			}

			// 0x82 - People Counter Correction direction A
			case TYPE_PC_cntCorA: {
//				if(!pcCnt) {
//					pcCnt = {}
//				}
//				pcCnt.cntCorA = (bytes[i + 1] << 8) | bytes[i + 2];
				obj.cntCorA = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i += 2;
				break;
			}

			// 0x83 - People Counter Correction direction B
			case TYPE_PC_cntCorB: {
//				if(!pcCnt) {
//					pcCnt = {}
//				}
//				pcCnt.cntCorB = (bytes[i + 1] << 8) | bytes[i + 2];
				obj.cntCorB = (bytes[i + 1] << 8) | bytes[i + 2];

				// Next parameter
				i += 2;
				break;
			}

			// 0x84 - Direction Toggle Flag
			case TYPE_PC_direction: {
				obj.direction = bytes[i + 1];

				// Next parameter
				i += 1;
				break;
			}

			// 0x91 - 'alarm' Threshold
			case TYPE_BB_Thresh_alrm: {
				obj.bb_thresh_alarm = bytes[i + 1];

				// Next parameter
				i += 1;
				break;
			}

			// 0x92 - 'warning' Threshold
			case TYPE_BB_Thresh_warn: {
				obj.bb_thresh_warning = bytes[i + 1];

				// Next parameter
				i += 1;
				break;
			}

			// 0x93 - Manual trigger
			case TYPE_BB_Manual: {
				obj.manualTrigger = bytes[i + 1];

				// Next parameter
				i += 1;
				break;
			}
			
			// 0x9A - O2 Calibration Parameters
			case TYPE_O2_CalibParam: {
				obj.o2_params = "";
				
				// Skip ID byte
				i += 1; 
				for(var j = 0; j < 18; j++){
					if(bytes[i+j] < 16) {
						obj.o2_params += "0" + bytes[i+j].toString(16);
					} else {
						obj.o2_params += bytes[i+1+j].toString(16);
					}
				}
				
				// Next parameter
				i += 18;
				break;
			}

			// 0xFF - No data
			case TYPE_noInfo:{

				// no actions
				break;
			}

			default:{
			// Unrecognized parameter
				obj.decodeError = bytes[i];

				// Skip all parameters
				i = bytes.length; // Skip Remaining message, to prevent misinterpreted values
				break;
			}
		}
	}

//	if(pcCnt) {
//		if(Object.keys(pcCnt).length == 4) {
//			obj.merge(pcCnt);
//		} else {
//			for (const [key, value] of Object.entries(pcCnt)) {
//				pcCnt[key + "Error"] = value;
//			}
//		}
//	}

	return obj;
}
