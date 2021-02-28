const cityName = document.querySelector('#cityName')
const weatherDiv = document.querySelector('#weatherResult')
const venuesDiv = document.querySelector('#venuesResult')

let venuesArr = []

const searchButton = document.querySelector('#searchButton');
searchButton.addEventListener('click', async () => {
    weatherDiv.innerHTML = ''
    venuesDiv.innerHTML = ''
    let searchInput = document.querySelector('#searchBar').value
    try {
        const weatherData = await fetchWeatherData(searchInput)
        const venuesData = await fetchVenuesData(searchInput)
        venuesArr = venuesData.response.venues
        cityName.innerHTML = `--> ${venuesData.response.geocode.where}, ${venuesData.response.geocode.feature.cc}`
        weatherDiv.innerHTML = createWeatherWidget(weatherData)
        venuesDiv.innerHTML = createVenuesWidget(venuesArr)
    }
    catch (error) {
        venuesArr = []
        cityName.innerHTML = ''
        cityName.innerHTML = `
        <div>
            <h3 id="fail">Unable to find information on "${searchInput}", please try again later.</h3>
        </div>
        `}
});

const weatherId = 'c80f00a7693e6f405f768dd8ad021d4e'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?&appid=' + weatherId
const fetchWeatherData = async (searchInput) => {
    const resp = await fetch(weatherUrl + '&q=' + searchInput)
    if (resp.ok) {
        const data = await resp.json()
        return data
    } else {
        throw new Error('Request failed')
    }
};

const foursquareId = '5WQ2W5CLNTXQ30FPICSFUBKGUH2DMFJB2ETOB0SRQN4MPRVT'
const foursquareSecret = 'ALTEC3IH5MSCZXOWTDDZKJAIRDY4NPPX5DGZWMNPQXGQ5RXZ'
const foursquareUrl = `https://api.foursquare.com/v2/venues/search?&client_id=${foursquareId}&client_secret=${foursquareSecret}`
const fetchVenuesData = async (searchInput) => {
    const resp = await fetch(foursquareUrl + '&near=' + searchInput + '&limit=3&v=20210225')
    if (resp.ok) {
        const data = await resp.json()
        return data;
    } else {
        throw new Error('Request failed')
    }
};

const createWeatherWidget = (data) => {
    let temp = data.main.temp - 273.15
    temp = Math.round(temp * 100 )/100
    const condition = data.weather[0].description
    const iconCode = data.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png"
    return `
    <div class="weatherWidget">
        <h3>Current weather</h3>
        <img src="${iconUrl}" id="iconWeather">
        <p>Condition: ${condition}</p>
        <p>Temperature: ${temp} degrees C</p>
    </div>
    `
};

const createVenuesWidget = (arr) => {
    if (arr.length > 1) {
        let arrWidget = arr.map((e) => {
            return `
            <div id=venues>
                <h3>${e.name}</h3>
                <p>Address:</p>
                <p>${e.location.address}</p>
                <p>${e.location.city}</p>
                <img src="${e.categories[0].icon.prefix}64${e.categories[0].icon.suffix}" id="icon"></img>
            </div>
            `
        });
        return `
            <div class="venuesWidget">
                <h3 id=attractions>TOP ATTRACTIONS ></h3>
                ${arrWidget[0]}
                ${arrWidget[1]}
                ${arrWidget[2]}
            </div>
            `
    } else {
        return venuesDiv.innerHTML = ''
    }
};

const weatherCheckbox = document.querySelector('#weatherCheckbox')
weatherCheckbox.addEventListener('change', function() {
  if (this.checked) {
    venuesDiv.style.display='none'
  } else {
    venuesDiv.style.display='inline'
  }
});

const venuesCheckbox = document.querySelector('#venuesCheckbox')
venuesCheckbox.addEventListener('change', function() {
  if (this.checked) {
    weatherDiv.style.display='none'
  } else {
    weatherDiv.style.display='inline'
  }
});

const alphaCheckbox = document.querySelector('#alphaCheckbox')
alphaCheckbox.addEventListener('change', function() {
    if (this.checked) {
        let venuesArrSorted = [...venuesArr]
        venuesArrSorted.sort((a, b) => a.name.localeCompare(b.name))
        /*venuesArrSorted.sort((a, b) => {
            if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
            if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
            return 0;
        })*/
        venuesDiv.innerHTML = createVenuesWidget(venuesArrSorted)
    } else {
        venuesDiv.innerHTML = createVenuesWidget(venuesArr)
    }
});