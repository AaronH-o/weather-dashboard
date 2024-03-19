dayjs.extend(window.dayjs_plugin_utc);
let locationNameInput = document.querySelector('.weather-location');

// clean up locationNameInput and put it into locationInput
let locationInput = document.querySelector('.location-input');
let locationBtn = document.querySelector('.location-input-btn');
let forecastContainer = document.querySelector('.forecast-container');
const cityList = document.querySelector('.city-list');

let id;
let weatherAPIKey = '88545649ed086e2c55e61d30884046e5';
let locationLat;
let locationLon;
let locationName;

class Weather {
  constructor(date, temp, wind, humidity, icon) {
    this.date = date;
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
    this.icon = icon;
  }
}

let cityArray = [];

function populateCityArray() {
  if(JSON.parse(localStorage.getItem('cityList')) != null ) { 
    cityArray = JSON.parse(localStorage.getItem('cityList'));
  }
  console.log('populate city array',cityArray);
}

function createList(input) {
  cityList.innerHTML = '';
  if(cityArray.length == 0) {
    return;
  }
  for(let i = 0; i < cityArray.length; i++) {
    if(cityArray[i] == input) {
      cityList.innerHTML += `<a href="#" class="list-group-item list-group-item-action active">${cityArray[i]}</a>`;
    } else {
      cityList.innerHTML += `<a href="#" class="list-group-item list-group-item-action">${cityArray[i]}</a>`;
    }
  }
}

// retrieve location input and clean it up for api call
function cleanInput(input) {
  console.log(input);
  if(input.trim() == '') {
    return;
  }
  displayCity(input.replace(/\s+/g, '+'), input);
}

function displayCity(cityName, input) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${weatherAPIKey}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    locationName = data[0].name;
    locationLon = data[0].lon;
    locationLat = data[0].lat;

    const weatherList = [];
    // current
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locationLat}&lon=${locationLon}&appid=${weatherAPIKey}&units=imperial`)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // get icon, temp, wind, humidity 
        console.log(data);
        let offset = data.timezone/60;
        // current temp
        weatherList.push(new Weather(
          dayjs.utc().utcOffset(offset).format('M/D/YYYY'),
          data.main.temp,
          data.wind.speed,
          data.main.humidity,
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        ));
      });
      
    // future
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${locationLat}&lon=${locationLon}&appid=${weatherAPIKey}&units=imperial`)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // get icon, temp, wind, humidity 

        console.log(data);

        for(let i = 0; i < 5; i++) {
          // get every 8th index starting with the next day
          let currentIndex = 7+(i*8);
          let spaceIndex = data.list[currentIndex].dt_txt.indexOf(' ');
          let formattedDate = dayjs(data.list[currentIndex].dt_txt.substring(0,spaceIndex)).format('M/D/YYYY')

          weatherList.push(new Weather(
            formattedDate,
            data.list[currentIndex].main.temp,
            data.list[currentIndex].wind.speed,
            data.list[currentIndex].main.humidity,
            `https://openweathermap.org/img/wn/${data.list[currentIndex].weather[0].icon}@2x.png`
          ));
        }
        console.log(weatherList);
        
        if(forecastContainer.classList.contains('invisible')) {
          forecastContainer.classList.remove('invisible')
        }
        // populate cards with weather info
        let cityNameEl = document.querySelector('.city-name');
        cityNameEl.textContent = input;
        for(let i = 0; i < 6; i++) {
          let locationTemp = document.querySelector(`.day${i}-temp`);
          let locationIcon = document.querySelector(`.day${i}-icon`);
          let locationDate = document.querySelector(`.day${i}-title`);
          let locationWind = document.querySelector(`.day${i}-wind`);
          let locationHumidity = document.querySelector(`.day${i}-humidity`);

          locationTemp.textContent = `Temp: ${weatherList[i].temp}℉`;
          locationIcon.src = weatherList[i].icon;
          locationDate.textContent = `${weatherList[i].date}`;
          locationWind.textContent = `Wind: ${weatherList[i].wind} MPH`;
          locationHumidity.textContent = `Humidity: ${weatherList[i].humidity}%`;
        }


        if(!cityArray.includes(input)) {
          cityArray.push(input);
          localStorage.setItem('cityList', JSON.stringify(cityArray));
          populateCityArray();
        }
  
        createList(input);
  
        document.getElementById('city-name').value = '';
      });   
  });
}

populateCityArray();
createList();
// locationBtn.onclick = ;
locationBtn.addEventListener('click', function(event) {
    console.log(locationInput.value);
    if(locationInput.value.trim() == '') {
      return;
    }
    displayCity(locationInput.value.replace(/\s+/g, '+'), locationInput.value);
});

cityList.addEventListener('click', function(event) {
  let element = event.target;
  if(element.matches('.list-group-item') && !element.matches('.active')) {
    console.log(element.innerHTML);
    cleanInput(element.innerHTML);
  }
});