function dir(ident) {
  if (ident === '=>') {
    return 'request';
  }
  if (ident === '<=') {
    return 'response';
  }
}

function parse(trace) {
  // better regex, please, start here:
  // http://scriptular.com/#%5E(%3F%3A%5Ba-z0-9%5D%7B4%7D%3A)%20((%3F%3A%5Ba-z0-9%5D%7B2%7D%20)%7B1%2C16%7D)%7C%7C%7C%7C%7C%7C%7C%7C%5B%2200a0%3A%2011%2022%2033%2044%2055%2066%2077%2088%2099%2010%2011%2012%2013%2014%2015%2016%2017%20%20%7B.%20%20%5C%22headers%5C%22%3A%20%7B%22%5D
  const traceLines = trace.split('\n');
  const dataPattern = /^(?:[a-z0-9]{4}:) ((?:[a-z0-9]{2} ){1,16})/;
  const dirPattern = /^(=>|<=)/;

  // find ASCI bytes in raw lines

  // will contain array of arrays with direction and data
  // e.g [['<=', "47 45 54 20 2f 73 68 6f 70 70 69 6e 67 2d 63 61"]]
  const asciiHexSets = [];
  let lastDir = '';

  for (const line of traceLines) {
    const dirMatch = dirPattern.exec(line);
    if (dirMatch !== null) {
      lastDir = dirMatch[0].trim();
    }

    const dataMatch = dataPattern.exec(line);
    if (dataMatch !== null) {
      const data = dataMatch[1].trim();
      asciiHexSets.push([lastDir, data]);
    }
  }

  // split lines by spaces and make array of ASCII hex bytes
  const asciiHexBuffer = { request: [], response: [] };
  for (const [direction, data] of asciiHexSets) {
    for (const byte of data.split(' ')) {
      asciiHexBuffer[dir(direction)].push(byte);
    }
  }

  // convert ASCII hex to ASCII integers codes
  const asciiIntBuffer = { request: [], response: [] };
  for (const key of Object.keys(asciiHexBuffer)) {
    const hexs = asciiHexBuffer[key];
    for (const hex of hexs) {
      asciiIntBuffer[key].push(parseInt(hex, 16));
    }
  }

  // convert ACII codes to charactes
  const stringBuffer = { request: [], response: [] };
  for (const key of Object.keys(asciiIntBuffer)) {
    const codes = asciiIntBuffer[key];
    for (const code of codes) {
      stringBuffer[key].push(String.fromCharCode(code));
    }
  }

  return {
    request: stringBuffer.request.join(''),
    response: stringBuffer.response.join('')
  };
}

function parseToString(trace) {
  const message = parse(trace);
  let output = '';

  const request = [];
  const requestLines = message.request.split('\r\n');
  for (const line of requestLines) {
    request.push(`> ${line}`);
  }
  output += request.join('\r\n');
  output += '\n';
  output += '\r\n';
  const response = [];
  const responseLines = message.response.split('\r\n');
  for (const line of responseLines) {
    response.push(`< ${line}`);
  }
  output += response.join('\r\n');
  output += '\n';
  return output;
}

function parseBackRequestAndResponseFromString(string) {
  const output = {request: '', response: ''};

  const request = [];
  const stringLines = string.split('\r\n');
  for (const line of stringLines) {
    if (line.startsWith('> ')) {
      request.push(line.replace(/^> /, ''));
    }
  }

  // removing trailing LF
  output.request = request.join('\r\n').replace(/\n$/, '');

  const response = [];
  for (const line of stringLines) {
    if (line.startsWith('< ')) {
      response.push(line.replace(/^< /, ''));
    }
  }

  // removing trailing LF
  output.response = response.join('\r\n').replace(/\n$/, '');

  return output;
}

module.exports = {
  parseBackRequestAndResponseFromString,
  parseBack: parseBackRequestAndResponseFromString,
  parseToString,
  parse
};
