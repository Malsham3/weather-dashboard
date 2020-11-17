// obtain API key and research about the paramemters. DONE
//access the API in the script and make sure it's working properly.
// Use ajax to retreive data. DONE 
// get all the stats. DONE
//access time date using linux // refer to previous homework DONE 
//create render cards for 5 day forecast 
//create render current city card forecast
//create search history section with rows that store previously stored cities " use local storage to save prev searched, wont disappear after page load"
//Search field with a button, and event listener.


//using luxon, obtain current date
// const today = luxon.DateTime.local().toFormat("ff");
// const hour = parseInt(luxon.DateTime.local().toLocaleString(luxon.DateTime.TIME_24_SIMPLE));
// dt.toLocaleString(DateTime.DATE_SHORT)

//once done, edit styling / colors.


const today = luxon.DateTime.local().toFormat("cccc D");
$("#today-date").text(today);

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
        $("#current-temp").text("Temp(F): " + kelvinToF(weather.main.temp) + " F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-windspeed").text("Wind: " + weather.wind.speed + " MPH");

        // to get the UV index, make a seperate call using latitude and longitude
        var lon = weather.coord.lon;
        var lat = weather.coord.lat;
        const uvQuery = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`;

        $.ajax({
            method: "GET",
            url: uvQuery,
        }).then(function (location) {
            var uvIndex = location.value;
            $("#current-uv").text(uvIndex);
            if (uvIndex <= 2) {
                $("#current-uv").addClass("badge-success");
            } else if (uvIndex < 8) {
                $("#current-uv").addClass("badge-warning");
            } else {
                $("#current-uv").addClass("badge-danger");
            }
        });
    });

    // https://api.openweathermap.org/data/2.5/weather?q=Phoenix,USA&appid=f2433f0a4f99b3452dffd4c97403b276
}


// Convert from Kelvin to Fahrenheit
function kelvinToF(k) {
    return ((k - 273.15) * 1.8 + 32).toFixed(2);
}

//for loop that will add content to page
for (let i = 0; i < 6; i++) {
    $("#search-history").append(buildSearchedCities(i));
}


function buildSearchedCities(city) {
    const searchedCity = $("<li>")
        .addClass("list-group-item")
        .attr("id", `city-${city}`)
    
    return searchedCity;

}

function renderForecastCards() {
    const dayCard = $("<div>")
        .addClass("col mb-4")

    const cardContainer = $("<div>")
        .addClass("card")

    const cardBody = $("<div>")
        .addClass("")

    return dayCard
}

getWeatherStats("Phoenix,USA");