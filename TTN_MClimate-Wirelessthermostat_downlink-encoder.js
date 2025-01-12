function encodeDownlink(input) {

  var bytes = [];

  for (let key of Object.keys(input.data)) {
    switch(key) {
      case 'getAllParams': {
        bytes.push(0x12);
        bytes.push(0x14);
        bytes.push(0x15);
        bytes.push(0x19);
        bytes.push(0x1B);
        break;}
      case 'setKeepAlive': {
        bytes.push(0x02);
        bytes.push(input.data.setKeepAlive);
        break;}
      case 'getDeviceVersions': {
        bytes.push(0x04);
        break;}
      case 'setChildLock': {
        bytes.push(0x07);
        bytes.push(Number(input.data.setChildLock));
        break;}
      case 'setTemperatureRange': {
        bytes.push(0x08);
        bytes.push(input.data.setTemperatureRange.min);
        bytes.push(input.data.setTemperatureRange.max);
        break;}
      case 'setTargetTemperature': {
        bytes.push(0x2E);
        bytes.push(input.data.setTargetTemperature);
        break;}
      case 'setJoinRetryPeriod': {
        // period should be passed in minutes
        let periodToPass = (input.data.setJoinRetryPeriod * 60) / 5;
        periodToPass = int(periodToPass);
        bytes.push(0x10);
        bytes.push(periodToPass);
        break;}
      case 'setUplinkType': {
        bytes.push(0x11);
        bytes.push(input.data.setUplinkType);
        break;}
      case 'getKeepAliveTime': {
        bytes.push(0x12);
        break;}
      case 'getOpenWindowParams': {
        bytes.push(0x13);
        break;}
      case 'getChildLock': {
        bytes.push(0x14);
        break;}
      case 'getTemperatureRange': {
        bytes.push(0x15);
        break;}
      case 'getOperationalMode': {
        bytes.push(0x18);
        break;}
      case 'getJoinRetryPeriod': {
        bytes.push(0x19);
        break;}
      case 'getUplinkType': {
        bytes.push(0x1B);
        break;}
      case 'receivedKeepalive': {
        bytes.push(0x55);
        break;}
      case 'sendCustomHexCommand': {
        let sendCustomHexCommand = input.data.sendCustomHexCommand
        for (let i = 0; i < sendCustomHexCommand.length; i += 2) {
          const byte = parseInt(sendCustomHexCommand.substr(i, 2), 16);
          bytes.push(byte);
        }
        break;}
      default: {}
    }
  }

  return {
    bytes: bytes,
    fPort: 1,
    warnings: [],
    errors: []
  };
}

function decodeDownlink(input) {
  return {
    data: {
      bytes: input.bytes
    },
    warnings: [],
    errors: []
  }
}

// example downlink commands
// {"getOperationalMode":""} --> 0x18
// {"setTargetTemperature":20} --> 0x0E14
// {"setTemperatureRange":{"min":15,"max":21}} --> 0x080F15
// {"setChildLock":true} --> 0701
// {"sendCustomHexCommand":"080F15"} --> 0x080F15
// {"setOpenWindow":{"enabled": true, "closeTime": 20 , "delta": 3, "motorPosition": 540}}  --> 0x0601041C23

// example Node Red mqtt message
// msg.topic = 'v3/<Application ID>@ttn/devices/<End device ID>/down/push'
// msg.payload = {"downlinks":[{f_port:1,decoded_payload:{setTargetTemperature:20},priority:'NORMAL',confirmed:false}]}
