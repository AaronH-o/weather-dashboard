dayjs.extend(window.dayjs_plugin_utc);
let locationNameInput = document.querySelector('.weather-location');
let locationTemp = document.querySelector('.weather-temperature');
let locationTempDescription = document.querySelector('.weather-description');
let locationIcon = document.querySelector('.weather-icon');

// clean up locationNameInput and put it into locationInput
let locationInput = "London";

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




fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=${weatherAPIKey}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    locationName = data[0].name;
    locationLon = data[0].lon;
    locationLat = data[0].lat;
    console.log(locationName, locationLon, locationLat);

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
          dayjs.utc().utcOffset(offset).format('YYYY-MM-DD'),
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
        // https://openweathermap.org/forecast5

        console.log(data);

        for(let i = 0; i < 5; i++) {
          // get every 8th index starting with the next day
          let currentIndex = 7+(i*8);
          let spaceIndex = data.list[currentIndex].dt_txt.indexOf(' ');
          weatherList.push(new Weather(
            data.list[currentIndex].dt_txt.substring(0,spaceIndex),
            // dayjs().format('YYYY-MM-DD'),
            data.list[currentIndex].main.temp,
            data.list[currentIndex].wind.speed,
            data.list[currentIndex].main.humidity,
            `https://openweathermap.org/img/wn/${data.list[currentIndex].weather[0].icon}@2x.png`
          ));
        }

        console.log(weatherList);
      });

  });


