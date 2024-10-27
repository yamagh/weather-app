const apiUrl = 'https://api.open-meteo.com/v1/forecast';

function buildApiUrl(lat, lon) {
  return `${apiUrl}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_mean,weathercode&current_weather=true&timezone=auto&hourly=temperature_2m,precipitation,weathercode`;
}

function handleApiResponse(response) {
  return response.json().then(data => {
    displayCurrentWeather(data.current_weather);
    displayForecast(data.daily);
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
  document.getElementById('weather-emoji').textContent = getWeatherEmoji(current.weathercode);
  changeBackgroundColor(roundedTemperature, current.windspeed);
}

function displayForecast(daily) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';

  daily.time.slice(1, 8).forEach((day, index) => {
    const forecastElement = document.createElement('div');
    const roundedPrecipitationProbability = Math.round(daily.precipitation_probability_mean[index]);
    const roundedPrecipitation = Math.round(daily.precipitation_sum[index]);
    const roundedMinTemperature = Math.round(daily.temperature_2m_min[index]);
    const roundedMaxTemperature = Math.round(daily.temperature_2m_max[index]);
    forecastElement.innerHTML = `
            <div class="row">
              <span>${new Date(day).toLocaleDateString(undefined, { weekday: 'short' })}</span>
              <span>${getWeatherEmoji(daily.weathercode[index])}</span>
              <span>${roundedPrecipitationProbability} %</span>
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

function getWeatherEmoji(weatherCode) {
  const weatherEmojis = {
    0: '☀️', // Clear sky
    1: '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌦️', // Drizzle: Light
    53: '🌦️', // Drizzle: Moderate
    55: '🌦️', // Drizzle: Dense intensity
    56: '🌧️', // Freezing Drizzle: Light
    57: '🌧️', // Freezing Drizzle: Dense intensity
    61: '🌧️', // Rain: Slight
    63: '🌧️', // Rain: Moderate
    65: '🌧️', // Rain: Heavy intensity
    66: '🌨️', // Freezing Rain: Light
    67: '🌨️', // Freezing Rain: Heavy intensity
    71: '🌨️', // Snow fall: Slight
    73: '🌨️', // Snow fall: Moderate
    75: '🌨️', // Snow fall: Heavy intensity
    77: '🌨️', // Snow grains
    80: '🌧️', // Rain showers: Slight
    81: '🌧️', // Rain showers: Moderate
    82: '🌧️', // Rain showers: Violent
    85: '🌨️', // Snow showers slight
    86: '🌨️', // Snow showers heavy
    95: '⛈️', // Thunderstorm: Slight or moderate
    96: '⛈️', // Thunderstorm with slight hail
    99: '⛈️'  // Thunderstorm with heavy hail
  };
  return weatherEmojis[weatherCode] || '❓';
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
