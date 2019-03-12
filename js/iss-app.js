// Initialize Firebase
var config = {
  apiKey: "AIzaSyAw8TqiPOkzzTlB1rIEbT4sE_yGRk-qq4k",
  authDomain: "space-force-iss.firebaseapp.com",
  databaseURL: "https://space-force-iss.firebaseio.com",
  projectId: "space-force-iss",
  storageBucket: "space-force-iss.appspot.com",
  messagingSenderId: "170025590751"
};
firebase.initializeApp(config);
var database = firebase.database();

var latitude = "";
var longitude = "";
var altitude = "";
var velocity = "";
var solar_lat = "";
var solar_lon = "";
var mymap = null;

//map
function moveIss() {
  if (mymap !== null) mymap.remove();

  var queryURL = "https://www.n2yo.com/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&apiKey=LDUFJ6-J5J7F4-DCMYRA-3WB7"

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      console.log(response);

      console.log(response.positions[0].satlatitude);
      console.log(response.positions[0].satlongitude);
      console.log(response.positions[0].ra);
      console.log(response.positions[0].dec);

      //   var altitude = response.altitude;
      //   var velocity = response.velocity;
      //   var visibility = response.visibility;
      var latitude = response.positions[0].satlatitude;
      var longitude = response.positions[0].satlongitude;
      var ra = response.positions[0].ra;
      var dec = response.positions[0].dec;
      var time = response.positions[0].timestamp;
      var timestamp = moment.unix(time).format('LLLL');
      console.log(timestamp);

      //   var solar_lat = response.solar_lat;
      //   var solar_lon = response.solar_lon;

      //   var altitudeN = altitude.toFixed(2);
      //   var velocityN = velocity.toFixed(2);
      //   var latitudeN = latitude.toFixed(4);
      //   var longitudeN = longitude.toFixed(4);
      //   var solar_latN = solar_lat.toFixed(4);
      //   var solar_lonN = solar_lon.toFixed(4);

      $("#latitudeTxt").text("Latitude: "),
        $("#latitudeN").text(latitude),
        $("#longitudeTxt").text("Longitude: "),
        $("#longitudeN").text(longitude),
        $("#altitudeTxt").text("Satellite Right Angle:  "),
        $("#altitude").text(ra),
        $("#velocityTxt").text("Sattellite Declination:  ");
      $("#velocity").text(dec);

      $("#timeStamp").text(timestamp);
      //   $("#solar_lonN").text("Solar Longitude: " + solar_lonN);
      //   $("#visibility").text("Visibility: " + visibility);

      mymap = L.map("mapId").setView([latitude, longitude], 4);

      var issIcon = L.icon({
        iconUrl: "images/iss2.png",

        iconSize: [35, 44], // size of the icon

      });

      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 14,
          id: "mapbox.streets",
          accessToken:
            "pk.eyJ1IjoicG1hY2s5OSIsImEiOiJjam1zNXh4c2owMGc5M3dwN2ZjeWloc2t5In0.OJ_GGAfAJgMK0OCnN2NbhA"
        }
      ).addTo(mymap);

      L.marker([latitude, longitude], { icon: issIcon }).addTo(mymap);

    });
  setTimeout(moveIss, 27000);



}

// OverPass

moveIss();


var time = 0;
var duration = 0;
var whereStart = [];
var whereEnd = [];
var howHigh = 0;
var maxHigh = 0;
var startEl = 0;
var maxEl = 0;
var passcount = 0;
var userInput = 0;
var cityState = 0;
var apiKeyMapquest = 0;
var caption = [];

$(".button").on("click", function (event) {

  event.preventDefault();
  //$("tbody").empty(" ");

  // var apiKeyMapquest = "VhIG9vrD4t2JMvh5f9k61v8rcGERpvxV";
  var apiKeyMapquest = "ua7RUmNymQq5oRMabONKpUlrpGpV3M6s";
  var userInput = $("input").val();
  var cityState = userInput.trim();
  console.log(cityState);

  var queryUrl =
    "https://www.mapquestapi.com/geocoding/v1/address?key=" +
    apiKeyMapquest +
    "&location=" +
    cityState;
  console.log(queryUrl);

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function (response) {
    var results = response.results;
    console.log(results);

    var lat = results[0].locations[0].displayLatLng.lat;
    var lon = results[0].locations[0].displayLatLng.lng;
    database.ref().push(lat);
    database.ref().push(lon);

    var queryURL = "https://www.n2yo.com/rest/v1/satellite/visualpasses/25544/" + lat + "/" + lon + "/0/2/300/&apiKey=LDUFJ6-J5J7F4-DCMYRA-3WB7"

    console.log(queryURL);


    // Performing our AJAX GET request
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After the data comes back from the API
      .then(function (response) {
        console.log(response);

        var passesCount = response.info.passescount;
        console.log(passesCount)
        if (passesCount == 0) {
          var newRow = $("<tr>").append(
            $("<td>").text("There are no visible passes in the next 10 days"),
            database.ref().push("there are no visible passes in the next 10 days in " + cityState)

          );

          $("tbody").append(newRow);

        } else {
          // Storing an array of results in the results variable
          for (var i = 0; i < response.passes.length; i++) {
            var time = response.passes[i].startUTC;


            var dateString = moment.unix(time).format('LLLL');
            console.log(dateString);

            var duration = response.passes[i].duration;
            console.log("Duration= " + duration + " seconds");

            var whereStart = response.passes[i].startAzCompass
            console.log("ISS appears from the " + whereStart);

            var howHigh = response.passes[i].startEl
            console.log("Starting Elevation = " + howHigh);

            var maxHigh = response.passes[i].maxEl
            console.log("Maximum Elevation = " + maxHigh);

            var whereEnd = response.passes[i].endAzCompass
            console.log("ISS disappears to the " + whereEnd);

            var newSearch = {
              search: cityState,
              date: dateString,
              lengthOfTime: "Duration= " + duration + " seconds",
              start: "ISS appears from the " + whereStart,
              startingElevation: "Starting Elevation = " + howHigh,
              maxElevation: "Maximum Elevation = " + maxHigh,
              end: "ISS disappears to the " + whereEnd
            }

            database.ref().push(newSearch);

            
            var newRow = $("<tr>").append(

              $("<td>").text(cityState),
              $("<td>").text(dateString),
              $("<td>").text(duration),
              $("<td>").text(whereStart),
              $("<td>").text(howHigh),
              $("<td>").text(maxHigh),
              $("<td>").text(whereEnd)
            );

            $("tbody").prepend(newRow);

          }
        }

      })

  });
});

database.ref().on("child_added", function (childSnapshot) {
  console.log("this is the child snapshot", childSnapshot.val());
})