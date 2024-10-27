const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.openweathermap.org/data/2.5/onecall';

function fetchWeatherData(lat, lon) {
    const url = `${apiUrl}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.current);
            displayForecast(data.daily);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(current) {
    document.getElementById('temperature').textContent = `${current.temp} °C`;
    document.getElementById('humidity').textContent = `${current.humidity} %`;
    document.getElementById('wind-speed').textContent = `${current.wind_speed} m/s`;
    document.getElementById('precipitation').textContent = `${current.weather[0].description}`;
}

function displayForecast(daily) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    daily.slice(1, 8).forEach(day => {
        const forecastElement = document.createElement('div');
        forecastElement.innerHTML = `
            <div>
                <p>Day: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${day.temp.day} °C</p>
                <p>Humidity: ${day.humidity} %</p>
                <p>Wind Speed: ${day.wind_speed} m/s</p>
                <p>Precipitation: ${day.weather[0].description}</p>
            </div>
        `;
        forecastContainer.appendChild(forecastElement);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

document.addEventListener('DOMContentLoaded', getLocation);
