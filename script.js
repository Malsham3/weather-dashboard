// obtain API key and research about the paramemters.
//access the API in the script and make sure it's working properly.
// Use ajax to retreive data.
// look up 
//access time date using linux // refer to previous homework
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

console.log(today);

function getWeatherStats(city) {

    //obtained API key
    const apikey = "2083ba99e548234fc6955819000762a8";

    //query URL used  to pull data.
    const query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    // Create an AJAX call to retrieve data
    $.ajax({
      method: "GET",
      url: query,
    }).then(function (weather) {
      
    });
}

// This is our API key. Add your own API key between the ""
var APIKey = "";

// Here we are building the URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&appid=" + APIKey;

// We then created an AJAX call
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {