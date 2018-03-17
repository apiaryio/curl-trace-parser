/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const parse = function(trace) {

  let data;
  let dir = function(ident) {

      if (ident === "=>") {
        return "request";
      }
      if (ident === "<=") {
        return "response";
      }
    };

  // better regex, please, start here:
  // http://scriptular.com/#%5E(%3F%3A%5Ba-z0-9%5D%7B4%7D%3A)%20((%3F%3A%5Ba-z0-9%5D%7B2%7D%20)%7B1%2C16%7D)%7C%7C%7C%7C%7C%7C%7C%7C%5B%2200a0%3A%2011%2022%2033%2044%2055%2066%2077%2088%2099%2010%2011%2012%2013%2014%2015%2016%2017%20%20%7B.%20%20%5C%22headers%5C%22%3A%20%7B%22%5D

  const traceLines = trace.split("\n");
  const dataPattern = /^(?:[a-z0-9]{4}:) ((?:[a-z0-9]{2} ){1,16})/;
  const dirPattern = /^(=>|<=)/;

  // find ASCI bytes in raw lines

  // will contain array of arrays with direction and data
  // e.g [['<=', "47 45 54 20 2f 73 68 6f 70 70 69 6e 67 2d 63 61"]]
  const asciiHexSets = [];
  let lastDir = "";

  for (let line of Array.from(traceLines)) {
    const dirMatch = dirPattern.exec(line);
    if (dirMatch !== null) {
      lastDir = dirMatch[0].trim();
    }

    const dataMatch = dataPattern.exec(line);
    if (dataMatch !== null) {
      data = dataMatch[1].trim();
      asciiHexSets.push([lastDir, data]);
    }
  }


  // split lines by spaces and make array of ASCII hex bytes
  const asciiHexBuffer = {request: [], response: []};
  for (let set of Array.from(asciiHexSets)) {
    data = set[1];
    for (let byte of Array.from(data.split(" "))) {
      asciiHexBuffer[dir(set[0])].push(byte);
    }
  }

  //convert ASCII hex to ASCII integers codes
  const asciiIntBuffer = {request: [], response: []};
  for (dir in asciiHexBuffer) {
    const hexs = asciiHexBuffer[dir];
    for (let hex of Array.from(hexs)) {
      asciiIntBuffer[dir].push(parseInt(`0x${hex}`));
    }
  }

  //convert ACII codes to charactes
  const stringBuffer = {request: [], response: []};
  for (dir in asciiIntBuffer) {
    const codes = asciiIntBuffer[dir];
    for (let code of Array.from(codes)) {
      stringBuffer[dir].push(String.fromCharCode(code));
    }
  }

  const output = {};
  output['request'] = stringBuffer['request'].join("");
  output['response'] = stringBuffer['response'].join("");
  return output;
};


const parseToString = function(trace) {
  const message = parse(trace);
  let output = "";

  const request = [];
  const requestLines = message['request'].split("\r\n");
  for (var line of Array.from(requestLines)) {
    request.push(`> ${line}`);
  }
  output += request.join("\r\n");
  output += "\n";
  output += "\r\n";
  const response = [];
  const responseLines = message['response'].split("\r\n");
  for (line of Array.from(responseLines)) {
    response.push(`< ${line}`);
  }
  output += response.join("\r\n");
  output += "\n";
  return output;
};



const parseBackRequestAndResponseFromString = function(string) {
  const output = {};

  const request = [];
  const stringLines = string.split('\r\n');
  for (var line of Array.from(stringLines)) {
    if (/^> /.test(line)) { request.push(line.replace(/^> /, '')); }
  }

  //removing trailing LF
  output['request'] = request.join('\r\n').replace(/\n$/, '');

  const response = [];
  for (line of Array.from(stringLines)) {
    if (/^< /.test(line)) { response.push(line.replace(/^< /, '')); }
  }

  //removing trailing LF
  output['response'] = response.join('\r\n').replace(/\n$/, '');

  return output;
};


module.exports.parseBackRequestAndResponseFromString = parseBackRequestAndResponseFromString;
module.exports.parseBack = parseBackRequestAndResponseFromString;
module.exports.parseToString = parseToString;
module.exports.parse = parse;
