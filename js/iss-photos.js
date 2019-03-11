var i = 0;
var queryURL = "https://images-api.nasa.gov/search?q=iss&media_type=image"

$.ajax({
  url: queryURL,
  method: "GET"
})

  .then(function (response) {
    console.log(response);

    function issImages() {

      $("#apod1 img").remove();
      $(".caption").html(" ");

      i = Math.floor(Math.random() * 99 + 1);
      console.log(i);

      var apod = response.collection.items[i].links[0].href;
      var image = $("<img>").attr("src", apod).attr("class", "img").attr("class", "img-fluid").attr("alt", "Responsive image").attr("class", "float-right").attr("class", "rounded");
      var caption = response.collection.items[i].data[0].description;


      $("#apod1").append(image);
      $(".caption").append(caption);

      setTimeout(issImages, 30000);

    }

    issImages();


  });