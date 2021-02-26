const welcomeSection = $("#welcome-section");
const todaysSection = $("#todays-section");
const errMSG = $("#user-message");

//get the current date using luxon
const today = luxon.DateTime.local().toFormat("cccc D");

//display today's date
$("#todays-date").text(today);
$("#today-date").text(today);

//get current length of localStorage
var searchedCount = localStorage.length;

//update search history section on page load
updateSearched();

//obtained API key
const APIkey = "f2433f0a4f99b3452dffd4c97403b276";

//following function will execute the AJAX call and get the necessary forecast data
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

    $("#five-day-title").text("5-Day Forecast for " + weather.name);

    // to get the UV index, make a seperate call using latitude and longitude
    var lon = weather.coord.lon;
    var lat = weather.coord.lat;

    //query URL to obtain UV index
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

//Below function will build 5-day forecast cards 
function buildForecastCards(dayNum) {
  //create Day card
  const dayCard = $("<div>")
    .attr("id", `dayCard-${dayNum}`)
    .addClass("col my-3");

  //card container that'll contain the body and stats divs.
  const cardContainer = $("<div>")
    .attr("id", `cardContainer-${dayNum}`)
    .addClass("day-card");

  //card body will contain date, image, temperature and humidity stats
  const cardBody = $("<div>")
    .attr("id", `cardBody-${dayNum}`)
    .addClass("text-center day-card py-1");

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

// dynamically append 5-day cards to page.
function generateCards() {
  //empty old cards
  $("#5-day-cards").empty();

  //add the heading to the five day forecast section
  $("#five-section").css("display", "block");

  //then add the five cards
  for (let i = 1; i < 6; i++) {
    $("#5-day-cards").append(buildForecastCards(i));
    $(`#heading-${i}`).text(
      luxon.DateTime.local().plus({ days: i }).toFormat("D")
    );
  }
}

// for future development: make this a clickable city name that will display it's stats once clicked.
function buildSearchedCities(city) {
  // var searched = $("<p>").addClass("mt-3").attr("id", `${city}`);

  var searched = $("<a>").addClass("searched-city mt-3").attr({"id": `${city}`, "onClick": `#`});

  return searched;
}

//create an empty array and save current saved cities in local storage
var searchedCities = [];
for (let i = 0; i < searchedCount; i++) {
  searchedCities[i] = localStorage.getItem(i + 1);
}

$("a").on("click", function(e) {
  e.preventDefault();

  //swap divs
  welcomeSection.css("display", "none");
  todaysSection.css("display", "block");

  var clickedCity = this.text.substring(2);

  //displaying the stats
  getWeatherStats(clickedCity);

  generateCards();
})

//search button event listener
$(".btn").on("click", function (e) {

  //prevent page reload
  e.preventDefault();

  
  //getting user input
  var searchedCity = $(this).siblings(".user-input").val().toUpperCase();
  
  //prevents empty input
  if (!searchedCity) return;
  
  //swap divs
  welcomeSection.css("display", "none");
  todaysSection.css("display", "block");

  //displaying the stats
  getWeatherStats(searchedCity);

  generateCards();

  //localStorage work
  //if city has already been searched, dont add to localStorage to avoid repetition of values.
  if (
    !searchedCities.find(function (city) {
      return city === searchedCity;
    })
  ) {
    localStorage.setItem(searchedCount + 1, searchedCity);

    searchedCount++;
  }

  //empty input field
  $("#search-form").val("");

  //get the latest search history
  updateSearched();
});

//updates the search history section with the latest data from local storage.
function updateSearched() {
  if (searchedCount > 0) {
    for (let i = 1; i <= searchedCount; i++) {
      $("#search-history").append(buildSearchedCities(i));
      var savedSearch = localStorage.getItem(i).toLowerCase();
      var listId = $(`#${i}`);

      var formattedCityName =
        savedSearch.substring(0, 1).toUpperCase() + savedSearch.substring(1);

      listId.text(" ‣ " + formattedCityName);
    }
  }
}



// PROBLEM: CREATES TWO ANCHOR TAGS PER SEARCHED CITY ON PAGE LOAD. PROBLEM GOES AFTER RELOAD AND SIMILAR TAGS BECOME ONE TAG.
