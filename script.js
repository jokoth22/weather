const API_KEY = "eb08f849c1d29475fc3fe6db076c663a"; // Replace with your OpenWeatherMap API key

document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-search').value;

    // Fetch city coordinates
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            // Now fetch the 5-day forecast using the coordinates
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    displayCurrentWeather(data);
                    display5DayForecast(data);
                    addCityToHistory(city);
                });
        });
});

function displayCurrentWeather(data) {
    // Extract the data for current weather and display it
    document.getElementById('city-name').textContent = data.city.name;
    document.getElementById('current-date').textContent = new Date(data.list[0].dt * 1000).toLocaleDateString();
    document.getElementById('weather-icon').src = "https://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png";
    document.getElementById('temperature').textContent = "Temperature: " + (data.list[0].main.temp - 273.15).toFixed(2) + "°C"; // Convert Kelvin to Celsius
    document.getElementById('humidity').textContent = "Humidity: " + data.list[0].main.humidity + "%";
    document.getElementById('wind-speed').textContent = "Wind Speed: " + data.list[0].wind.speed + " m/s";
}

function display5DayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';  // Clear previous forecast
    
    for (let i = 0; i < data.list.length; i+=8) {  
        const dayData = data.list[i];
        
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('col-12','col-md-auto','mb-4');

       const card = document.createElement('div');
       card.classList.add('card');
       dayDiv.appendChild(card);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        const date = document.createElement('h6');
        date.classList.add('card-subtitle', 'mb-2', 'text-muted');
        date.textContent = new Date(dayData.dt * 1000).toLocaleDateString();
        cardBody.appendChild(date);

        const weatherIcon = document.createElement('img');
        weatherIcon.classList.add('mb-2');
        weatherIcon.src = "http://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
        cardBody.appendChild(weatherIcon);

        const temperature = document.createElement('p');
        temperature.classList.add('card-text');
        temperature.textContent = "Temp: " + (dayData.main.temp - 273.15).toFixed(2) + "°C";
        cardBody.appendChild(temperature);

        const windSpeed = document.createElement('p');
        windSpeed.classList.add('card-text');
        windSpeed.textContent = "Wind: " + dayData.wind.speed + " m/s";
        cardBody.appendChild(windSpeed);

        const humidity = document.createElement('p');
        humidity.classList.add('card-text');
        humidity.textContent = "Humidity: " + dayData.main.humidity + "%";
        cardBody.appendChild(humidity);

        forecastDiv.appendChild(dayDiv);
    }
}


function addCityToHistory(city) {
    const history = getCityHistory();
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('cityHistory', JSON.stringify(history));
    }
    displayCityHistory();
}

function getCityHistory() {
    const history = localStorage.getItem('cityHistory');
    return history ? JSON.parse(history) : [];
}

function displayCityHistory() {
    const ul = document.getElementById('history');
    ul.innerHTML = ''; // Clear current list
    const history = getCityHistory();
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', function() {
            document.getElementById('city-search').value = city;
            document.getElementById('search-btn').click();
        });
        ul.appendChild(li);
    });
}

// Load city history on page load
displayCityHistory();
