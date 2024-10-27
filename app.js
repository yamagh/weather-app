const apiUrl = 'https://api.open-meteo.com/v1/forecast';

function buildApiUrl(lat, lon) {
    return `${apiUrl}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&current_weather=true&timezone=auto&hourly=temperature_2m,precipitation,weathercode`;
}

function handleApiResponse(response) {
    return response.json().then(data => {
        displayCurrentWeather(data.current_weather);
        displayForecast(data.daily);
        console.log(data.daily);
    });
}

function handleApiError(error) {
    console.error('Error fetching weather data:', error);
}

function fetchWeatherData(lat, lon) {
    const url = buildApiUrl(lat, lon);
    return fetch(url)
        .then(handleApiResponse)
        .catch(handleApiError);
}

function displayCurrentWeather(current) {
    const roundedTemperature = Math.round(current.temperature);
    document.getElementById('temperature').textContent = `${roundedTemperature} °C`;
    document.getElementById('wind-speed').textContent = `${current.windspeed} m/s`;
    changeBackgroundColor(roundedTemperature, current.windspeed);
}

function displayForecast(daily) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    daily.time.slice(1, 8).forEach((day, index) => {
        const forecastElement = document.createElement('div');
        const roundedPrecipitation = Math.round(daily.precipitation_sum[index]);
        const roundedMinTemperature = Math.round(daily.temperature_2m_min[index]);
        const roundedMaxTemperature = Math.round(daily.temperature_2m_max[index]);
        forecastElement.innerHTML = `
            <div class="row">
                <span>${new Date(day).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <span>${roundedPrecipitation} mm</span>
                <span>${roundedMinTemperature} °C</span>
                <span>${roundedMaxTemperature} °C</span>
            </div>
        `;
        forecastContainer.appendChild(forecastElement);
    });
}

function changeBackgroundColor(temperature, windspeed) {
    const body = document.body;
    body.classList.remove('cold', 'warm', 'hot', 'windy', 'calm', 'day', 'night');

    const currentTime = new Date();
    const hours = currentTime.getHours();
    const isDayTime = hours >= 6 && hours < 18;

    if (isDayTime) {
        body.classList.add('day');
    } else {
        body.classList.add('night');
    }

    if (temperature < 10) {
        body.classList.add('cold');
    } else if (temperature >= 10 && temperature < 20) {
        body.classList.add('warm');
    } else {
        body.classList.add('hot');
    }

    if (windspeed > 10) {
        body.classList.add('windy');
    } else {
        body.classList.add('calm');
    }
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
