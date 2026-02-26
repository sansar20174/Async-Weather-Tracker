const API_KEY = "ca2fb287aff257a252c222ee96b556a6";

const city = document.querySelector("#city");
const search = document.querySelector("#search");
visitCites = [];

search.addEventListener("click", async (e) => {
  e.preventDefault();

  const data = city.value;
  if(data){
    try {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${API_KEY}`);
         const weatherData = await response.json();
            console.log(weatherData);
        
        if(weatherData.cod === 200){
            container.innerHTML = `<h3>Weather Info</h3>
            <p>City: ${weatherData.name}</p>
            <p>Temp: ${(weatherData.main.temp - 273).toFixed(1)} °C</p>
            <p>Weather: ${weatherData.weather[0].main}</p>
            <p>Humidity: ${weatherData.main.humidity}</p>
            <p>Wind: ${weatherData.wind.speed} miles/hr</p>`;

            visitCites.push(weatherData.name);
            localStorage.setItem("visitedCities", JSON.stringify(visitCites));
            
        } else {
            container.innerHTML = `<h3>Weather Info</h3>
            <p>${weatherData.message}</p>`
        } 
    } catch (error) {
        console.error("Error fetching weather data:", error);
        container.innerHTML = `<p>Error fetching weather data. Please try again later.</p>`;
    }
  }
});