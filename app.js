const apiUrl = 'https://api.open-meteo.com/v1/forecast';

function fetchWeatherData(lat, lon) {
    const url = `${apiUrl}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true&timezone=auto`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.current_weather);
            displayForecast(data.daily);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(current) {
    document.getElementById('temperature').textContent = `${current.temperature} °C`;
    document.getElementById('humidity').textContent = 'N/A'; // Open-Meteo API does not provide humidity in current weather
    document.getElementById('wind-speed').textContent = `${current.windspeed} m/s`;
    document.getElementById('precipitation').textContent = 'N/A'; // Open-Meteo API does not provide precipitation in current weather
}

function displayForecast(daily) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    daily.time.slice(1, 8).forEach((day, index) => {
        const forecastElement = document.createElement('div');
        forecastElement.innerHTML = `
            <div>
                <p>Day: ${new Date(day * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${daily.temperature_2m_max[index]} °C / ${daily.temperature_2m_min[index]} °C</p>
                <p>Precipitation: ${daily.precipitation_sum[index]} mm</p>
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
