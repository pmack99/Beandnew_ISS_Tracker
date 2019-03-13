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
      $("#caption-text").html(" ");

      i = Math.floor(Math.random() * 99 + 1);
      console.log(i);

      var apod = response.collection.items[i].links[0].href;
      var image = $("<img>").attr("src", apod).attr("class", "img img-fluid rounded mx-auto d-block ").attr("alt", "International Space Station (ISS)");
      var caption = response.collection.items[i].data[0].description;
      var captionText = $("#caption-text").attr("class", "col-12 caption text-justify text-wrap").text(caption);
      


      $("#apod1").append(image);
      $("#caption-text").append(captionText);

      setTimeout(issImages, 30000);

    }

    issImages();


  });