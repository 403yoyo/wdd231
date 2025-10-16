const WEATHER_API_KEY = 'd94472af5d3fbcebf525946c6039f7e2';

export async function initializeWeather() {
    try {
        await loadWeatherData();
        // console.log('Weather module initialized');
    } catch (error) {
        // console.error('Error initializing weather module:', error);
        displayWeatherError();
    }
}

async function loadWeatherData() {
    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        const weatherData = await fetchWeatherData(latitude, longitude);
        displayWeatherData(weatherData);
        
    } catch (error) {
        // console.error('Error loading weather data:', error);
        const fallbackWeather = await fetchWeatherData(6.5244, 3.3792);
        displayWeatherData(fallbackWeather);
    }
}

function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false
        });
    });
}

async function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    return processWeatherData(data);
}

function processWeatherData(data) {
    const dailyForecasts = [];
    const seenDays = new Set();
    
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!seenDays.has(dayKey) && dailyForecasts.length < 3) {
            seenDays.add(dayKey);
            dailyForecasts.push({
                date: date,
                temp: Math.round(forecast.main.temp),
                description: forecast.weather[0].description,
                icon: getWeatherIcon(forecast.weather[0].main),
                humidity: forecast.main.humidity,
                windSpeed: forecast.wind.speed
            });
        }
    });
    
    return dailyForecasts;
}

function getWeatherIcon(weatherMain) {
    const iconMap = {
        'Clear': 'fas fa-sun',
        'Clouds': 'fas fa-cloud',
        'Rain': 'fas fa-cloud-rain',
        'Drizzle': 'fas fa-cloud-drizzle',
        'Thunderstorm': 'fas fa-bolt',
        'Snow': 'fas fa-snowflake',
        'Mist': 'fas fa-smog',
        'Fog': 'fas fa-smog'
    };
    
    return iconMap[weatherMain] || 'fas fa-cloud';
}

function displayWeatherData(forecasts) {
    const weatherCards = document.getElementById('weatherCards');
    if (!weatherCards) return;
    
    weatherCards.innerHTML = forecasts.map(day => `
        <div class="weather-card fade-in">
            <div class="weather-date">
                ${day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div class="weather-icon">
                <i class="${day.icon}"></i>
            </div>
            <div class="weather-temp">${day.temp}°C</div>
            <div class="weather-desc">${capitalizeFirst(day.description)}</div>
            <div class="weather-details">
                <small>💧 ${day.humidity}% • 🌬️ ${day.windSpeed}m/s</small>
            </div>
        </div>
    `).join('');
}

function displayWeatherError() {
    const weatherCards = document.getElementById('weatherCards');
    if (weatherCards) {
        weatherCards.innerHTML = `
            <div class="weather-error text-center">
                <p>Unable to load weather data</p>
                <small>Check your connection and try again</small>
            </div>
        `;
    }
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}