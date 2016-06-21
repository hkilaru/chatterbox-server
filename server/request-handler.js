/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var rooms = {"/": []};
var querystring = require('querystring');
var util = require('util');

exports.requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);


  // The outgoing status.
  var statusCode = 200,
      roomname = request.url,
      endResult = {results: []};

  function GET(){
    if (!(roomname in rooms)){
      statusCode = 404;
    } else {
      endResult.results = rooms[roomname];
    }
    var message = JSON.stringify(endResult);
    response.end(message);
  }

  function POST(){
    statusCode = 201
    var decoded = "";
    if (!(roomname in rooms)) {
      rooms[roomname] = []
    }
    request.on('data', function(chunk) {
      decoded += chunk;
    })
    request.on('end', function() {
      var format = JSON.parse(decoded);

      console.log('decoded', decoded);
      console.log('format', format);

      rooms[roomname].push(format);
      rooms["/"].push(format);
      console.log("Messages added: ", rooms[roomname]);
      GET();
    })
  }


  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  if(request.method === "POST") {
    POST()
    console.log("post received");
  } else {
    GET()
  }

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  // if(!rooms[roomname]) {
  //   statusCode = 404;
  //   endResult.results = rooms.all;
  // } else {
  //   endResult.results = rooms.roomname;
  // }
  // console.log(request.url);
  // console.log(statusCode);
  // console.log(endResult);
  // console.log('rooms:', rooms);
  message = JSON.stringify(endResult);
  response.end(message);
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
