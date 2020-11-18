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

// api.openweathermap.org/data/2.5/forecast?q=Phoenix%AZ&appid=f2433f0a4f99b3452dffd4c97403b276

// CONTINUE RENDERING!!!!!!!!! LINE 81 AND THE FOR LOOP

const today = luxon.DateTime.local().toFormat("cccc D");
$("#today-date").text(today);

for (let i = 1; i < 6; i++) {
    $("#search-history").append(buildSearchedCities(i));
    $("#5-day-cards").append(buildForecastCards(i));
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
        $("#current-temp").text("Temp: " + kelvinToF(weather.main.temp) + " F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-windspeed").text("Wind: " + weather.wind.speed + " MPH");

        // to get the UV index, make a seperate call using latitude and longitude
        var lon = weather.coord.lon;
        var lat = weather.coord.lat;

        // const uvQuery = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIkey}`;
        const secondQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIkey}`

        $.ajax({
            method: "GET",
            url: secondQuery,
        }).then(function (location) {

            var uvIndex = location.current.uvi
            $("#current-uv").text(uvIndex);
            if (uvIndex <= 2) {
                $("#current-uv").addClass("badge-success");
            } else if (uvIndex < 8) {
                $("#current-uv").addClass("badge-warning");
            } else {
                $("#current-uv").addClass("badge-danger");
            }

            var dailyCast = location.daily
            for (let i = 0; i < 5; i++) {
                //iterate through the database and update the day cards
                $(`#temp-${i+1}`).val("Temp: "+ KelvinToF(dailyCast[i].temp.day)+ " F");
                $(`#humidity-${i+1}`).val("Humidity: " + dailyCast[i].humidity + "%");
            }
        });
    });

    // https://api.openweathermap.org/data/2.5/weather?q=Phoenix,USA&appid=f2433f0a4f99b3452dffd4c97403b276

    // https://api.openweathermap.org/data/2.5/onecall?lat=33.45&lon=-112.07&exclude=current,minutely,hourly,alerts&appid=f2433f0a4f99b3452dffd4c97403b276
}


// Convert from Kelvin to Fahrenheit
function kelvinToF(k) {
    return ((k - 273.15) * 1.8 + 32).toFixed(2);
}

function buildSearchedCities(city) {
    const searchedCity = $("<li>")
        .addClass("list-group-item")
        .attr("id", `city-${city}`)

    return searchedCity;

}

//Below function will build 5-day forecast cards dynamically and append to HTML.
function buildForecastCards(dayNum) {

    //create Day card
    const dayCard = $("<div>")
        .addClass("col mb-4")
        .attr("id", `dayCard-${dayNum}`);

    //card container that'll contain the body and stats divs.
    const cardContainer = $("<div>")
        .addClass("card")
        .attr("id", `cardContainer-${dayNum}`);

    //card body will contain date, image, temperature and humidity stats
    const cardBody = $("<div>")
        .addClass("")
        .attr("id", `cardBody-${dayNum}`);

    //Heading will display the date
    const cardHeading = $("<h5>")
        .addClass("card-title")
        .attr("id", `heading-${dayNum}`);

    //image will display depending on weather
    const cardImg = $("<img>")
        .addClass("card-img-top")
        .attr({ "src": "", "alt": "...", "id": `img-${dayNum}` });

    //Temperature of specified day
    const dayTemp = $("<p>")
        .addClass("card-text")
        .attr("id", `temp-${dayNum}`);

    //Humidity of specified day
    const dayHumidity = $("<p>")
        .addClass("card-text")
        .attr("id", `humidity-${dayNum}`);

    //appending stats inside of the card body, then to the container, then the card column div.
    cardBody.append(cardHeading, cardImg, dayTemp, dayHumidity);
    cardContainer.append(cardBody);
    dayCard.append(cardContainer);

    //return a fully built day card ready to display stats.
    return dayCard
}

getWeatherStats("Phoenix,USA");