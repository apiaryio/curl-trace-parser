module.exports.parseToRaw = (trace) ->
  # better regex, please, start here:
  # http://scriptular.com/#%5E(%3F%3A%5Ba-z0-9%5D%7B4%7D%3A)%20((%3F%3A%5Ba-z0-9%5D%7B2%7D%20)%7B1%2C16%7D)%7C%7C%7C%7C%7C%7C%7C%7C%5B%2200a0%3A%2011%2022%2033%2044%2055%2066%2077%2088%2099%2010%2011%2012%2013%2014%2015%2016%2017%20%20%7B.%20%20%5C%22headers%5C%22%3A%20%7B%22%5D

  traceLines = trace.split("\n")
  pattern = /^(?:[a-z0-9]{4}:) ((?:[a-z0-9]{2} ){1,16})/

  
  # find ASCI bytes in raw lines
  asciiHexSets = []
  for line in traceLines
    match = pattern.exec(line)        
    asciiHexSets.push(match[1].trim()) unless match == null

  # split lines by spaces and make array of ASCII hex bytes  
  asciiHexBuffer = []  
  for set in asciiHexSets
    for byte in set.split(" ")
      asciiHexBuffer.push(byte)

   
  #convert ASCII hex to ASCII integers codes
  asciiIntBuffer = []
  for hex in asciiHexBuffer
    asciiIntBuffer.push(parseInt('0x' + hex))

  #convert ACII codes to charactes
  stringBuffer = []
  for code in asciiIntBuffer
    stringBuffer.push(String.fromCharCode(code))

  stringBuffer.join("")



