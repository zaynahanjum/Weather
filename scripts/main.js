document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("body").classList.toggle("load");
    document.querySelector("body").classList.toggle("load");  
    let savedLocation = localStorage.getItem("location");
    console.log(savedLocation);
    if (savedLocation) {
        console.log("hi");
        geocoder(savedLocation); 
        localStorage.removeItem("location");
    }
});

document.querySelector(".search").addEventListener("click", function(event) {
    locationEntered = document.getElementById("location").value.trim();
    if (locationEntered === "") {
        alert("Please enter a city name!");
        event.preventDefault(); 
    }
    else {
        console.log(locationEntered);
        geocoder(locationEntered);    
    }
});

document.querySelector(".switch input").addEventListener("change", function () {
    if (window.latitude && window.longitude) {
        fetchWeatherDetails(window.latitude, window.longitude);
        weekWeather(window.latitude, window.longitude);
    }
});

function time() {
    let currentDate = new Date();
    let time = currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    document.querySelector(".time").innerHTML = time;
}

async function geocoder(location) {
    try {
        let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid={your API id}`);
        let data = await response.json();
        window.latitude = data[0].lat;
        window.longitude = data[0].lon;
        fetchWeatherDetails(window.latitude, window.longitude);
        weekWeather(window.latitude, window.longitude);
        console.log(data[0].lat, data[0].lon);
    } catch (error) {
        alert("City does not exist. Try again");
        window.location.href = "./index.html";
        console.log("Error", error);
    }
}

function checkUnit () {
    let isCelsius = document.querySelector(".switch input").checked;
    let units = isCelsius ? "metric" : "imperial";
    let unitSymbol = isCelsius ? "°C" : "°F";
    let windSpeedUnit = isCelsius ? "m/s" : "mph";
    return [units, unitSymbol, windSpeedUnit];
}

async function fetchWeatherDetails(lat, lon) {
    try {
        tempUnit = checkUnit();
        units = tempUnit[0];
        unitSymbol = tempUnit[1];
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid={your API id}`);
        let data = await response.json();
        let cityName = data.name;
        let weather = data.weather[0].description;
        let weatherIcon = data.weather[0].icon;
        let temperature = data.main.temp + unitSymbol;
        let feelsLike = data.main.feels_like + unitSymbol;
        let humidity = data.main.humidity;
        let windSpeed = data.wind.speed + " " + tempUnit[2];
        let visibility = data.visibility;
        displayData(cityName, weather, weatherIcon, temperature, feelsLike, humidity, windSpeed, visibility);
    } catch (error) {
        console.log("Error", error);
    }  
}

function displayData(cityName, weather, weatherIcon, temperature, feelsLike, humidity, windSpeed, visibility) {
    time();
    document.querySelector(".city-name").innerHTML = "" + cityName; 
    document.querySelector(".weather-icon").src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    document.querySelector(".temperature").innerHTML = "" + temperature;
    document.querySelector(".weather-condition").innerHTML = "" + weather[0].toUpperCase() + weather.slice(1);
    document.querySelector(".feels-like").innerHTML = `Feels like : ${feelsLike}`;
    document.querySelector(".humidity").innerHTML = `Humidity : ${humidity}`;
    document.querySelector(".wind-speed").innerHTML = `Wind Speed : ${windSpeed}`;
    document.querySelector(".visibility").innerHTML = `Visibility : ${visibility}`;
};

async function weekWeather(lat, lon) {
    try {
        let tempUnit = checkUnit();
        let units = tempUnit[0];
        let unitSymbol = tempUnit[1];

        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid={your API id}`);
        let data = await response.json();
        let hourlyDetails = document.querySelectorAll(".hourly-detail");

        let currentDateTime = new Date();

        let futureWeather = data.list.filter((element) => {
            let forecastDateTime = new Date(element.dt_txt);
            return forecastDateTime.getTime() > currentDateTime.getTime();
        });

        if (futureWeather.length < hourlyDetails.length) {
            let remainingSlots = hourlyDetails.length - futureWeather.length;
            let additionalWeather = data.list.slice(futureWeather.length, futureWeather.length + remainingSlots);
            futureWeather = futureWeather.concat(additionalWeather);
        }

        futureWeather.slice(0, hourlyDetails.length).forEach((element, index) => {
            let weatherIcon = `https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png`;
            let temp = element.main.temp + unitSymbol;
            let formattedTime = new Date(element.dt_txt).toLocaleString("en-US", { 
                hour: "numeric", 
                minute: "numeric", 
                hour12: true 
            });

            hourlyDetails[index].querySelector(".hourly-icon").src = weatherIcon;
            hourlyDetails[index].querySelector(".hourly-temp").textContent = temp;
            hourlyDetails[index].querySelector(".hourly-time").textContent = formattedTime;
        });

    } catch (error) {
        console.log("Error:", error);
    }
}


