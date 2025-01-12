function encodeDownlink(input) {

  var bytes = [];

  for (let key of Object.keys(input.data)) {
    switch(key) {
      case "getDeviceVersions": {
        bytes.push(0x01);
        bytes.push(0x02);
        bytes.push(0x03);
        bytes.push(0x04);
        bytes.push(0x05);
        break;}
      default: {}
    }
  }

  return {
    bytes: bytes,
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
