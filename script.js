const apiKey = `b92db6cf8e69e7bd8836e2ac2d2742c8`

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();

    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
        suffix = 'st';
    } else if (day === 2 || day === 22) {
        suffix = 'nd';
    } else if (day === 3 || day === 23) {
        suffix = 'rd';
    }

    return `${dayOfWeek}, ${month} ${day}${suffix}`;
}

function getWeatherForcast(city) {
    const cityEncoded = encodeURIComponent(city);

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityEncoded}&units=imperial&appid=${apiKey}`).then((response) => response.json()).then((weatherForecast) => {

        if (weatherForecast.cod !== "200") return window.alert(`${weatherForecast.message}!`)

        $('#city-name').text(weatherForecast.city.name)

        for (var i = 0; i < weatherForecast.list.length; i += 8) {
            const weatherData = weatherForecast.list[i]

            const filteredData = {
                "date": weatherData.dt,
                "temperature": weatherData.main.temp,
                "humidity": weatherData.main.humidity,
                "windSpeed": weatherData.wind.speed,
                "weatherIcon": `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`
            }

            const dayNumber = (i / 8) + 1

            $(`#d${dayNumber}-date`).text(formatDate(filteredData.date))
            $(`#d${dayNumber}-humidity`).text(`Humidity: ${filteredData.humidity}%`)
            $(`#d${dayNumber}-temp`).text(`Temperature: ${filteredData.temperature}°F`)
            $(`#d${dayNumber}-wind`).text(`Wind Speed: ${filteredData.windSpeed} MPH`)
            $(`#d${dayNumber}-icon`).attr("src", filteredData.weatherIcon)
        }
    })


}

function searchForWeather() {
    const city = $("#city-input").val()

    let recents = JSON.parse(window.localStorage.getItem('recents'))

    recents.push(city)

    window.localStorage.setItem('recents', JSON.stringify(recents));

    refreshRecents()
    getWeatherForcast(city)
}

function refreshRecents() {
    $("#recent-searches").empty()

    let recents = JSON.parse(window.localStorage.getItem('recents')).slice(0, 6)

    $("#recent-searches").append(`<li></li>`)
    recents.forEach(recentCity => {
        $("#recent-searches").append(`<li class="card list-group-item mx-3">${recentCity}</li>`)
    })
    $("#recent-searches").append(`<li hidden></li>`)
}

document.addEventListener('keypress', function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
    }
});


window.addEventListener("load", (event) => {
    getWeatherForcast("Round rock")

    const recents = window.localStorage.getItem('recents');

    if (!recents || recents === "") {
        window.localStorage.setItem('recents', '["Round Rock"]');
    }

    refreshRecents()
});