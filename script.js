// obtain API key and research about the paramemters. DONE
//access the API in the script and make sure it's working properly.
// Use ajax to retreive data. DONE
// get all the stats. DONE
//access time date using linux // refer to previous homework DONE
//create render cards for 5 day forecast DONE
//create render current city card forecast DONE
//create search history section with rows that store previously stored cities " use local storage to save prev searched, wont disappear after page load"
//Search field with a button, and event listener.

//once done, edit styling / colors. DONE

const today = luxon.DateTime.local().toFormat("cccc D");
$("#today-date").text(today);

var searchedCount = localStorage.length;

updateSearched();

// ++++++++++++ ADD HYPER LINKED CITIES HERE FOR FUTURE VISIT. +++++++++++
function buildSearchedCities(city) {
  const searchedCity = $("<p>").addClass("mt-3").attr("id", `${city}`);

  // const hyperLink = $("<a>")
  //     .attr("id", `link-${city}`);

  //   const hyperButton = $("<button>").attr("id", `btn-${city}`);

  //   searchedCity.append(hyperButton);

  return searchedCity;
}

for (let i = 1; i < 6; i++) {
  $("#5-day-cards").append(buildForecastCards(i));
  $(`#heading-${i}`).text(
    luxon.DateTime.local().plus({ days: i }).toFormat("D")
  );
}

//obtained API key
const APIkey = "f2433f0a4f99b3452dffd4c97403b276";

//following function will get access the database and obtain all needed information
function getWeatherStats(city) {
  //URL used to query the database
  const query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`;

  // Create an AJAX call to retrieve data
  $.ajax({
    method: "GET",
    url: query,
  }).then(function (weather) {
    $("#city-name").text(weather.name);
    $("#current-temp").text(kelvinToF(weather.main.temp) + " F");
    $("#current-humidity").text(weather.main.humidity + "%");
    $("#current-windspeed").text(weather.wind.speed + " MPH");

    // to get the UV index, make a seperate call using latitude and longitude
    var lon = weather.coord.lon;
    var lat = weather.coord.lat;

    // const uvQuery = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`;
    const secondQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIkey}`;

    $.ajax({
      method: "GET",
      url: secondQuery,
    }).then(function (location) {
      var uvIndex = location.current.uvi;
      $("#current-uv").text(uvIndex);
      if (uvIndex <= 2) {
        $("#current-uv").addClass("badge-success");
      } else if (uvIndex < 5) {
        $("#current-uv").addClass("badge-warning");
      } else {
        $("#current-uv").addClass("badge-danger");
      }

      //access the database
      var dailyCast = location.daily;
      var sky = dailyCast[0].weather[0].main;

      //iterate through the database and update the stats inside of the 5 day cast cards.
      for (let i = 0; i < 5; i++) {
        $(`#temp-${i + 1}`).text(
          "Temp: " +
            ((dailyCast[i].temp.day - 273.15) * 1.8 + 32).toFixed(2) +
            " F"
        );
        $(`#humidity-${i + 1}`).text(
          "Humidity: " + dailyCast[i].humidity + "%"
        );

        //Check weather for description of (Clear, Clouds, Rain) and update card image accordingly.

        if (dailyCast[i].weather[0].main === "Clear") {
          $(`#img-${i + 1}`).attr(
            "src",
            "https://www.flaticon.com/svg/static/icons/svg/869/869869.svg"
          );
        } else if (dailyCast[i].weather[0].main === "Clouds") {
          $(`#img-${i + 1}`).attr(
            "src",
            "https://www.flaticon.com/svg/static/icons/svg/414/414927.svg"
          );
        } else if (dailyCast[i].weather[0].main === "Rain") {
          $(`#img-${i + 1}`).attr(
            "src",
            "https://www.flaticon.com/svg/static/icons/svg/3520/3520675.svg"
          );
        } else if (dailyCast[i].weather[0].main === "Snow") {
          $(`#img-${i + 1}`).attr(
            "src",
            "https://www.flaticon.com/svg/static/icons/svg/2336/2336319.svg"
          );
        }
      }
    });
  });
}

// Convert from Kelvin to Fahrenheit
function kelvinToF(k) {
  return ((k - 273.15) * 1.8 + 32).toFixed(2);
}

//Below function will build 5-day forecast cards dynamically and append to HTML.
function buildForecastCards(dayNum) {

  //create Day card
  const dayCard = $("<div>")
    .attr("id", `dayCard-${dayNum}`)
    .addClass("col my-3");

  //card container that'll contain the body and stats divs.
  const cardContainer = $("<div>")
    .attr("id", `cardContainer-${dayNum}`)
    .addClass("card");

  //card body will contain date, image, temperature and humidity stats
  const cardBody = $("<div>")
    .attr("id", `cardBody-${dayNum}`)
    .addClass("text-center bg-light five-day-card");

  //Heading will display the date
  const cardHeading = $("<h5>")
    .attr("id", `heading-${dayNum}`)
    .addClass("card-title mt-3");

  //image will display depending on weather
  const cardImg = $("<img>")
    .addClass("card-img-top w-50 mt-3")
    .attr("id", `img-${dayNum}`);

  //Temperature of specified day
  const dayTemp = $("<p>")
    .attr("id", `temp-${dayNum}`)
    .addClass("card-text my-3");

  //Humidity of specified day
  const dayHumidity = $("<p>")
    .attr("id", `humidity-${dayNum}`)
    .addClass("card-text mb-3");

  //appending stats inside of the card body, then to the container, then the card column div.
  cardBody.append(cardHeading, cardImg, dayTemp, dayHumidity);
  cardContainer.append(cardBody);
  dayCard.append(cardContainer);

  //return a fully built day card ready to display stats.
  return dayCard;
}

//save button event listener
$(".btn").on("click", function (e) {
  e.preventDefault();

  //getting user input
  var searchedCity = $(this).siblings(".user-input").val();

  
  //displaying the stats
  getWeatherStats(searchedCity);
  
  //localStorage work
  localStorage.setItem(searchedCount + 1, searchedCity);
  
  searchedCount++;
  
  //get the latest search history
  updateSearched();

  //empty input field
    $("#search-form").val('');
});

function updateSearched() {
  if (searchedCount > 0) {
      for (let i = 0; i <= searchedCount; i++) {
        $("#search-history").append(buildSearchedCities(i + 1));
        var savedSearch = localStorage.getItem(i);
        var listId = $(`#${i}`);
        listId.addClass("searched-city");
        listId.text(" ‣ " + savedSearch);
      }
  }
}