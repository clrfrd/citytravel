let venuesArr = []

const searchButton = document.querySelector('#searchButton');
searchButton.addEventListener('click', async () => {
    let weatherResult = document.querySelector('#weatherResult')
    let venuesResult = document.querySelector('#venuesResult')
    weatherResult.innerHTML = ''
    venuesResult.innerHTML = ''
    let searchInput = document.querySelector('#searchBar').value
    try {
        const weatherData = await fetchWeatherData(searchInput)
        const venuesData = await fetchVenuesData(searchInput)
        console.log(weatherData)
        console.log(venuesData)
        document.querySelector('#cityName').innerHTML = '--> ' + venuesData.response.geocode.where
        weatherResult.innerHTML = createWeatherWidget(weatherData)
        venuesArr = venuesData.response.venues
        venuesResult.innerHTML = createVenuesWidget(venuesArr)
    }
    catch (error) {
        document.querySelector('#cityName').innerHTML = ''
        weatherResult.innerHTML = `
        <div>
            <h3 id="fail">Unable to find information on "${searchInput}", please try again later.</h3>
        </div>
        `}
});

const weatherId = 'c80f00a7693e6f405f768dd8ad021d4e'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?&appid=' + weatherId
const fetchWeatherData = async (cityName) => {
    const resp = await fetch(weatherUrl + '&q=' + cityName)
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
const fetchVenuesData = async (cityName) => {
    const resp = await fetch(foursquareUrl + '&near=' + cityName + '&limit=3&v=20210225')
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
        <img src="${iconUrl}">
        <p>Condition: ${condition}</p>
        <p>Temperature: ${temp} degrees C</p>
    </div>
    `
};

const createVenuesWidget = (arr) => {
    let venuesResult = document.querySelector('#venuesResult')
    venuesResult.innerHTML = ''
    let v1 = arr[0]
    let v2 = arr[1]
    let v3 = arr[2]
    return `
    <div class="venuesWidget">
        <h3 id=attractions>TOP ATTRACTIONS ></h3>
        <div id=venues>
            <h3>${v1.name}</h3>
            <p>Address:</p>
            <p>${v1.location.address}</p>
            <p>${v1.location.city}</p>
            <img src="${v1.categories[0].icon.prefix}64${v1.categories[0].icon.suffix}" id="icon"></img>
        </div>
        <div id=venues>
            <h3>${v2.name}</h3>
            <p>Address:</p>
            <p>${v2.location.address}</p>
            <p>${v2.location.city}</p>
            <img src="${v2.categories[0].icon.prefix}64${v2.categories[0].icon.suffix}" id="icon"></img>
        </div>
        <div id=venues>
            <h3>${v3.name}</h3>
            <p>Address:</p>
            <p>${v3.location.address}</p>
            <p>${v3.location.city}</p>
            <img src="${v3.categories[0].icon.prefix}64${v3.categories[0].icon.suffix}" id="icon"></img>
        </div>
    </div>
    `
};

const weatherCheckbox = document.querySelector('#weatherCheckbox')
weatherCheckbox.addEventListener('change', function() {
  if (this.checked) {
    venuesResult.style.display='none'
  } else {
    venuesResult.style.display='inline'
  }
});

const venuesCheckbox = document.querySelector('#venuesCheckbox')
venuesCheckbox.addEventListener('change', function() {
  if (this.checked) {
    weatherResult.style.display='none'
  } else {
    weatherResult.style.display='inline'
  }
});

const alphaCheckbox = document.querySelector('#alphaCheckbox')
alphaCheckbox.addEventListener('change', function() {
    if (this.checked) {
        let venuesArrSorted = venuesArr.sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        })

        venuesResult.innerHTML = createVenuesWidget(venuesArrSorted)
    }
});