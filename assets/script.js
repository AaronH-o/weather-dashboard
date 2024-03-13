dayjs.extend(window.dayjs_plugin_utc);
let locationNameInput = document.querySelector('.weather-location');

// clean up locationNameInput and put it into locationInput
let locationInput = document.querySelector('.location-input');
let locationBtn = document.querySelector('.location-input-btn')

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

// retrieve location input and clean it up for api call
function cleanInput() {
  console.log(locationInput.value);
  displayCity(locationInput.value.replace(/\s+/g, '+'));
}

function displayCity(cityName) {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${weatherAPIKey}`)
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
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${locationLat}&lon=${locationLon}&appid=${weatherAPIKey}&units=imperial`)
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
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${locationLat}&lon=${locationLon}&appid=${weatherAPIKey}&units=imperial`)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // get icon, temp, wind, humidity 

        console.log(data);

        for(let i = 0; i < 5; i++) {
          // get every 8th index starting with the next day
          let currentIndex = 6+(i*8);
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
          // populate cards with weather info
          for(let i = 0; i < 6; i++) {
          let locationTemp = document.querySelector(`.day${i}-temp`);
          let locationIcon = document.querySelector(`.day${i}-icon`);
          let locationDate = document.querySelector(`.day${i}-title`);
          let locationWind = document.querySelector(`.day${i}-wind`);
          let locationHumidity = document.querySelector(`.day${i}-humidity`);

          locationTemp.textContent = weatherList[i].temp;
          locationIcon.src = weatherList[i].icon;
          locationDate.textContent = weatherList[i].date;
          locationWind.textContent = weatherList[i].wind;
          locationHumidity.textContent = weatherList[i].humidity;
        }
      });

      
  });
}

locationBtn.onclick = cleanInput;