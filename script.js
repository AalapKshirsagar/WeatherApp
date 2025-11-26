const apiKey = "a9997a5af028a60837dd9727250039a5"

document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  if (city.trim() !== "") getWeatherByCity(city);
});

document.getElementById("locationBtn").addEventListener("click", () => {
  getWeatherByLocation();
});

document.getElementById("cityInput").addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const city = e.target.value;
    if (city.trim() !== "") getWeatherByCity(city);
  }
});

function getWeatherByCity(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  )
    .then(res => res.json())
    .then(data => renderWeather(data))
    .catch(() => showError());
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      )
        .then(res => res.json())
        .then(data => renderWeather(data))
        .catch(() => showError());
    });
  }
}

function renderWeather(data) {
  if (data.cod === "404") {
    showError();
    return;
  }

  document.getElementById("error").classList.add("hidden");
  document.getElementById("weatherResult").classList.remove("hidden");

  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temp").textContent = `🌡️ ${data.main.temp}°C`;
  document.getElementById("desc").textContent = `☁️ ${data.weather[0].description}`;
  document.getElementById("wind").textContent = `💨 Wind: ${data.wind.speed} m/s`;

  const icon = data.weather[0].icon;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  updateBackground(data.weather[0].main);
}

function showError() {
  document.getElementById("error").classList.remove("hidden");
  document.getElementById("weatherResult").classList.add("hidden");
}

function updateBackground(weather) {
  const body = document.body;

  const backgrounds = {
    Clear: "linear-gradient(135deg, #f6d365, #fda085)",
    Clouds: "linear-gradient(135deg, #bdc3c7, #2c3e50)",
    Rain: "linear-gradient(135deg, #667db6, #0082c8)",
    Snow: "linear-gradient(135deg, #e6e9f0, #eef1f5)",
    Thunderstorm: "linear-gradient(135deg, #141e30, #243b55)",
    Drizzle: "linear-gradient(135deg, #89f7fe, #66a6ff)",
    Mist: "linear-gradient(135deg, #3e5151, #decba4)"
  };

  body.style.background = backgrounds[weather] || backgrounds["Clear"];
}
