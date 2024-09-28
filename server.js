const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(express.static('public'));
app.use(cors());


const weatherAPI = '0ebc630767745875cf4dac1e7fd231d3';
const newsApi = 'd85f8433a39841468d6d6c9e818ab411';
const exchangeApi = '2855c46173e0b6ba265fd353';


app.get('/weather', async (req, res) => {
    try {

        console.log("server getweatehred called");
        const city = req.query.city || 'Almaty';
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPI}&units=metric`);

        const weatherData = response.data;


        const { main, weather, coord, wind, sys, rain, name } = weatherData;


        const weatherInfo = {
            temperature: main.temp,
            description: weather[0].description,
            icon: weather[0].icon,
            coordinates: {
                latitude: coord.lat,
                longitude: coord.lon
            },
            feelsLike: main.feels_like,
            humidity: main.humidity,
            pressure: main.pressure,
            windSpeed: wind.speed,
            countryCode: sys.country,
            cityName: name,
            rainVolumeLast3Hours: rain ? rain['3h'] : 0
        };

        res.json(weatherInfo);

    } catch (error) {
        console.log("Error: server.js, method /weather get ", error.message);
    }
});


 app.get('/news', async (req, res) => {
    try {
        const city = req.query.city || 'Almaty';
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${city}&apiKey=${newsApi}&pageSize=5&sortBy=relevancy`);
        const news = response.data.articles.map(article => ({
            title: article.title,
            description: article.description,
            author: article.author,
            url: article.url,
            imageUrl: article.urlToImage,
        }));

        res.json(news);
    } catch (error) {
        console.error('Error fetching news data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/exchange', async (req, res) => {
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${exchangeApi}/latest/kzt`);
        const exchangeRatesData = response.data;

        res.json(exchangeRatesData);
    } catch (error) {
        console.error('Error fetching exchange rates data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});  



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });