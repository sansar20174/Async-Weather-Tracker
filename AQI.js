const API_KEY = "ca2fb287aff257a252c222ee96b556a6";

const city = document.querySelector("#city");
const search = document.querySelector("#weatherForm");
const history=document.querySelector("#SearchCities");
const Container = document.querySelector(".info");
const consoleLog = document.getElementById('consoleLog');

let visitedCities = JSON.parse(localStorage.getItem("visitedCities")) || [];

function addEventLog(message) {
    if (!consoleLog) {
        return;
    }

    const item = document.createElement("li");
    item.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    consoleLog.appendChild(item);

    if (consoleLog.children.length > 30) {
        consoleLog.removeChild(consoleLog.firstChild);
    }

    consoleLog.parentElement.scrollTop = consoleLog.parentElement.scrollHeight;
}

search.addEventListener("submit", async (e) => {
    e.preventDefault();
    addEventLog("Submit handler started (call stack)");

    Promise.resolve().then(() => {
        addEventLog("Microtask executed (Promise.then)");
    });

    setTimeout(() => {
        addEventLog("Macrotask executed (setTimeout 0)");
    }, 0);

    const data = city.value;
    if(data.trim()) {
        addEventLog(`Starting async weather request for ${data}`);
        await searchWeather(data);
        city.value = "";
    } else {
        addEventLog("Empty city input ignored");
    }

})

async function searchWeather(city){
    if(city){
        try{
            addEventLog(`searchWeather called for ${city}`);
            addEventLog("Fetch request queued to Web API");
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            addEventLog("Fetch resolved and returned to call stack");
            const weatherData = await response.json();
            addEventLog("response.json() microtask completed");
            console.log(weatherData);

            if (weatherData.cod === 200 || weatherData.cod === "200") {
                Container.innerHTML = `
                <p>City: ${weatherData.name}</p>
                <p>Temp: ${(weatherData.main.temp - 273.15).toFixed(1)} °C</p>
                <p>Weather: ${weatherData.weather[0].main}</p>
                <p>Humidity: ${weatherData.main.humidity}</p>
                <p>Wind: ${weatherData.wind.speed} miles/hr</p>`;
                addEventLog("Weather card updated in DOM");
                if(!visitedCities.includes(city)){
                    visitedCities.push(city);
                    localStorage.setItem("visitedCities", JSON.stringify(visitedCities));
                    addEventLog(`Saved ${city} to localStorage history`);
                }
                showHistory();
                addEventLog("History buttons rendered");

            } else {
                Container.innerHTML=`<h3>Weather Info Not Available</h3>
                <p>${weatherData.message}</p>`
                addEventLog(`Weather API error: ${weatherData.message}`);
            }
        }catch(e){
                Container.innerHTML = `<h3>Error</h3><p>Could not fetch weather data.</p>`;
                console.log(e);
                addEventLog("Network or parsing error while fetching weather");
            }
        }
    }

function showHistory(){
    history.innerHTML="";
    const cities=JSON.parse(localStorage.getItem("visitedCities"))
    if(cities){
        cities.forEach((city)=>{
            const li=document.createElement("button");
            li.textContent=city;
            li.addEventListener("click",()=>{
                addEventLog(`History button clicked for ${city}`);
                searchWeather(city);
            })
            history.appendChild(li);
        })
    }
    
}

showHistory()

function handleSearch(city) {
    searchWeather(city);
}