const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='0789f811a50fb08d2fe3582be6486bde';
const cityApi = "https://api.openweathermap.org/data/2.5/weather/?q="; 

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

function currentConditions(city) {
    fetch(cityApi + city + apiKey).then(function (response) {
        // if search returns
        if (response.ok) {
            response.json().then(function (data) {
                //get coordinates for forecast
                console.log(data);
                lat = data.coord.lat;
                lon = data.coord.lon;
                icon = data.weather[0].icon;
            // call showConditions fn to display
                showConditions(city);
            });
        } else {
            // if search not found
            savedSearch.shift();
            // alert
            alert("City not found, please enter another city name");
            location.reload();
        }
    });
}

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){
    let {humidity, uvi, wind_speed} = data.current;


    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>UV Index</div>
        <div>${uvi}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    
    
    `;

    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
            <div class="weather-item">
                <div>Humidity</div>
                <div>${humidity}%</div>
            </div>
            <div class="weather-item">
                <div>UV Index</div>
                <div>${uvi}</div>
            </div>
            <div class="weather-item">
                <div>Wind Speed</div>
                <div>${wind_speed}</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="weather-item">
                <div>Humidity</div>
                <div>${humidity}%</div>
            </div>
            <div class="weather-item">
                <div>UV Index</div>
                <div>${uvi}</div>
            </div>
            <div class="weather-item">
                <div>Wind Speed</div>
                <div>${wind_speed}</div>
            </div>
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}