var messages = require('./messages.js').messages

//***********************************************

var idCounter = 1,
    statusCode;

function GET(response, code, data){
  statusCode = code;
  var headers = defaultCorsHeaders;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
}

function POST(request, response, callback){
  var decoded = "";

  request.on('data', function(chunk) {
    decoded += chunk;
  })
  request.on('end', function() {
    var message = JSON.parse(decoded)
    callback(message);
    GET(response, 201, {results: messages});
  })
}


var addMessage = function(message) {
  message.objectId = idCounter++;
  messages.push(message);
}

exports.requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);


  if(request.method === "POST") {
    POST(request, response, addMessage);

  } else if (request.method === "GET"){
    GET(response, 200, {results: messages})

  } else if (request.method === 'OPTIONS') {
    GET(response, 200, {results: []});

  } else {
    GET(response, 404, {results: []});
  }




};


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "Content-Type": "application/json"
};
