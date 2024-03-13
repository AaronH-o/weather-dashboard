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

    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${locationLat}&lon=${locationLon}&appid=${weatherAPIKey}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // get icon, temp, wind, humidity 
        // https://openweathermap.org/forecast5

        console.log(data);

      });

  })


