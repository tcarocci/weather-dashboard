const mainContent = document.querySelector('.container');
const cityInput = document.querySelector('input');
const searchButton = document.querySelector('button');
const recentSearches = document.querySelector('.recent-search');
const currentWeather = document.querySelector('.current-weather');
const forecast = document.querySelector('.days5');

const apiKey = '1b02ba11a10664da072444abdfe44f3d';

// Retrieve recent searches from local storage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Save recent searches to local storage
function saveSearchHistory() {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Fetch for Weather
async function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching weather data:', error);
  }
}

// Displays current weather
function displayCurrentWeather(weatherData) {
  const iconUrl = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  currentWeather.innerHTML = `
    <div class="mt-4 bg-white p-4 rounded-md shadow-md">
        <div class="text-left text-2xl font-bold mb-4">${weatherData.name} (${new Date().toLocaleDateString()})</div>
        <img src="${iconUrl}" alt="${weatherData.weather[0].description}">
        <p>Temp: ${weatherData.main.temp} °C</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind: ${weatherData.wind.speed} MPH</p>
    </div>
  `;
}

// Fetch for Forecast 
async function getForecast(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching forecast data:', error);
  }
}

// Displays forecast data
function displayForecast(forecastData) {
  forecast.innerHTML = '<div class="mt-4 bg-white p-4 rounded-md shadow-md"><div class="text-left text-2xl font-bold mb-4">5 Day Forecast:</div><div class="grid grid-cols-1 gap-4" id="forecast"></div></div>';
  const uniqueDates = {};
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!uniqueDates[date]) {
      const iconUrl = `http://openweathermap.org/img/w/${item.weather[0].icon}.png`;
      forecast.innerHTML += `
        <div class="bg-gray-100 p-4 rounded-md">
            <p>Date: ${date}</p>
            <img src="${iconUrl}" alt="${item.weather[0].description}">
            <p>Temp: ${item.main.temp} °C</p>
            <p>Humidity: ${item.main.humidity}%</p>
            <p>Wind: ${item.wind.speed} MPH</p>
        </div>`;
      uniqueDates[date] = true;
    }
  });
}

// Displays recent searches
function displayRecentSearches() {
  recentSearches.innerHTML = '';
  searchHistory.forEach(city => {
    const searchItem = document.createElement('div');
    searchItem.textContent = city;
    searchItem.classList.add('text-sm', 'bg-gray-100', 'p-2', 'rounded-md', 'mb-2', 'mr-2', 'ml-3', 'w-48', 'md:w-64', 'lg:w-80');
    searchItem.addEventListener('click', async () => {

      currentWeather.innerHTML = '';
      forecast.innerHTML = '';

      const weatherData = await getWeather(city);
      displayCurrentWeather(weatherData);

      const forecastData = await getForecast(city);
      displayForecast(forecastData);
    });
    recentSearches.appendChild(searchItem);
  });
}

searchButton.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (city !== '') {
  
    currentWeather.innerHTML = '';
    forecast.innerHTML = '';

    const weatherData = await getWeather(city);
    displayCurrentWeather(weatherData);

  
    const forecastData = await getForecast(city);
    displayForecast(forecastData);

    searchHistory.push(city);
    saveSearchHistory();
    displayRecentSearches();


    cityInput.value = '';
  } else {
    alert('Please enter a city name.');
  }
});

// Call to display recent searches
displayRecentSearches();