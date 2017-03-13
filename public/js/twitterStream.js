function initialize() {
  //Setup Google Map
  
  var myLatlng = new google.maps.LatLng(39.7850,-98.4183);
  var myOptions = {
    zoom: 5,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  
  if(io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    // This listens on the "twitter-steam" channel and data is 
    // received everytime a new tweet is receieved.
    socket.on('twitter-stream', function (data) {

      
      var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
      
      //Flash a dot onto the map quickly
      var image = "css/Twitter-icon.png";
      var marker = new google.maps.Marker({
        position: tweetLocation,
        map: map,
        icon: image
      });
      setTimeout(function(){
        marker.setMap(null);
      },600);

    });

    // Listens for a success response from the server to 
    // say the connection was successful.
    socket.on("connected", function(r) {

      //Now that we are connected to the server let's tell 
      //the server we are ready to start receiving tweets.
      socket.emit("start tweets");
    });
  }
}