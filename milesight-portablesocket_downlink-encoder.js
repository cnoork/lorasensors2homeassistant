function encodeDownlink(input) {

  var bytes = [];

  for (let key of Object.keys(input.data)) {
    switch(key) {
      case 'setState': {
        bytes.push(0x08);
    		if (input.data.setState == "open") {
    			bytes.push(0x01);
		    } else {
    			bytes.push(0x00);
    		}
        bytes.push(0x00);
        break;}
      case 'setReportInterval': {
        bytes.push(0xff);
        bytes.push(0x03);
        bytes.push(input.data.setReportInterval & 0xff);
        bytes.push((input.data.setReportInterval >> 8) & 0xff);
        break;}
      case 'reboot': {
        bytes.push(0xff);
        bytes.push(0x10);
        bytes.push(0xff);
        break;}
      case 'setDelay': {
        bytes.push(0xff);
        bytes.push(0x22);
        bytes.push(0x00);
        bytes.push(input.data.setDelay.time & 0xff);
        bytes.push((input.data.setDelay.time >> 8) & 0xff);
        if(input.data.setDelay.state == "open") {
          bytes.push(0x11);
        } else {
          bytes.push(0x10);
        }
        break;}
      case 'rmDelay': {
        bytes.push(0xff);
        bytes.push(0x23);
        bytes.push(0x00);
        bytes.push(0xff);
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
