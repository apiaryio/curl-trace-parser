parse = (trace) ->
  
  dir = (ident) ->

      if ident == "=>"
        return "request"
      if ident == "<="
        return "response"
  
  # better regex, please, start here:
  # http://scriptular.com/#%5E(%3F%3A%5Ba-z0-9%5D%7B4%7D%3A)%20((%3F%3A%5Ba-z0-9%5D%7B2%7D%20)%7B1%2C16%7D)%7C%7C%7C%7C%7C%7C%7C%7C%5B%2200a0%3A%2011%2022%2033%2044%2055%2066%2077%2088%2099%2010%2011%2012%2013%2014%2015%2016%2017%20%20%7B.%20%20%5C%22headers%5C%22%3A%20%7B%22%5D

  traceLines = trace.split("\n")
  dataPattern = /^(?:[a-z0-9]{4}:) ((?:[a-z0-9]{2} ){1,16})/
  dirPattern = /^(=>|<=)/
  
  # find ASCI bytes in raw lines
  
  # will contain array of arrays with direction and data
  # e.g [['<=', "47 45 54 20 2f 73 68 6f 70 70 69 6e 67 2d 63 61"]]
  asciiHexSets = []
  lastDir = ""

  for line in traceLines
    dirMatch = dirPattern.exec line 
    unless dirMatch == null
      lastDir = dirMatch[0].trim()

    dataMatch = dataPattern.exec line         
    unless dataMatch == null
      data = dataMatch[1].trim()
      asciiHexSets.push [lastDir, data]
  
  
  # split lines by spaces and make array of ASCII hex bytes  
  asciiHexBuffer = {request: [], response: []}
  for set in asciiHexSets
    data = set[1]
    for byte in data.split " "
      asciiHexBuffer[dir(set[0])].push byte
  
  #convert ASCII hex to ASCII integers codes
  asciiIntBuffer = {request: [], response: []}
  for dir, hexs of asciiHexBuffer
    for hex in hexs
      asciiIntBuffer[dir].push(parseInt('0x' + hex))
  
  #convert ACII codes to charactes
  stringBuffer = {request: [], response: []}
  for dir, codes of asciiIntBuffer
    for code in codes 
      stringBuffer[dir].push String.fromCharCode code
 

  output = ""
  output += stringBuffer['request'].join ""
  output += "\r\n"
  output += stringBuffer['response'].join ""
  output += "\r\n"
  output



module.exports.parse = parse

