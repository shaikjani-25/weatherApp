const express = require("express");
const request = require("request");
const app = express();
const API_KEY = "f5d8e142f09a37efd0c5f419b8373242";

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("https://weather-apip.onrender.com/weather/:page", (req, res) => {
  const cities = [
    "London",
    "Paris",
    "New York",
    "Moscow",
    "Abidjan",
    "Abu Dhabi",
    "Kolkata",
    "Delhi",
    "Damascus",
    "Chennai",
    "Chicago",
    "Kathmandu",
    "Kyiv",
    "London",
    "Amsterdam",
    "Warsaw",
    "Bengaluru",
    "Delhi",
    "Hyderabad",
    "Athens",
    "Kharkiv",
    "Los Angeles",
    "Osaka",
    "Palo Alto",
    "Singapore",
    "Sydney",
    "Washington",
    "Wellington",
    "Yokohama",
    "Yekaterinburg",
  ]; // List of 30 cities
  const perPage = 10;
  const page = req.params.page || 1;
  const start = (page - 1) * perPage;
  const end = page * perPage;
  const paginatedCities = cities.slice(start, end);

  const promises = paginatedCities.map((city) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    return new Promise((resolve, reject) => {
      request.get(url, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  });

  Promise.all(promises)
    .then((weatherData) => {
      res.json({
        totalPages: Math.ceil(cities.length / perPage),
        currentPage: page,
        data: weatherData,
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.listen(process.env.Port||3000, () => {
  console.log("API running on 3000");
});
