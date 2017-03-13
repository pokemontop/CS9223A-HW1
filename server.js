
//Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

//Setup twitter stream api
var twit = new twitter({
  consumer_key: 'CN9hxK9NYyq0JRtuXpSjt9512',
  consumer_secret: 'YNkGZqZP0QpnXCCcd0aEtzmOGp7m49baFOAYSCKjh131ILV9gP',
  access_token_key: '774254579085090817-VL1d4bVJJayRoeyD5fYCMmi9TRBRNCi',
  access_token_secret: 'cBNitiy1JWGAtca6rSUleiXf1ck0zvW4QFuTmNrRFufQa'
}),
stream = null;

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);
option = 'Audi';
/*
if (ovalue === 'Volvo')
{  
  option = 'Volvo';
}
if (ovalue === 'Toyota')
{  
  option = 'Toyota';
}
if (ovalue === 'BMW')
{  
  option = 'BMW';
}
if (ovalue === 'audi')
{  
  option = 'audi';
}
*/
//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//Create web sockets connection.
io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {

    if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.
      twit.stream('statuses/filter', {track: option,'locations':'-180,-90,180,90'}, function(stream) {
          stream.on('data', function(data) {            
              
              if (data.coordinates){
                if (data.coordinates !== null){
                  
                  var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};

                  socket.broadcast.emit("twitter-stream", outputPoint);

                  //Send out to web sockets channel.
                  socket.emit('twitter-stream', outputPoint);
                }
                else if(data.place){
                  if(data.place.bounding_box === 'Polygon'){
                    // Calculate the center of the bounding box for the tweet
                    var coord, _i, _len;
                    var centerLat = 0;
                    var centerLng = 0;

                    for (_i = 0, _len = coords.length; _i < _len; _i++) {
                      coord = coords[_i];
                      centerLat += coord[0];
                      centerLng += coord[1];
                    }
                    centerLat = centerLat / coords.length;
                    centerLng = centerLng / coords.length;

                    // Build json object and broadcast it
                    var outputPoint = {"lat": centerLat,"lng": centerLng};
                    socket.broadcast.emit("twitter-stream", outputPoint);

                  }
                }
              }
              stream.on('limit', function(limitMessage) {
                return console.log(limitMessage);
              });

              stream.on('warning', function(warning) {
                return console.log(warning);
              });

              stream.on('disconnect', function(disconnectMessage) {
                return console.log(disconnectMessage);
              });
          });
      });
    }
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});

