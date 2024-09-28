const { parse } = require("dotenv");

async function getWeather() {
  try {
    console.log("getWeather() called");
    const city = document.getElementById("searchinput").value;
    const response = await axios.get(`http://localhost:3000/weather?city=${city}`);

    const weatherData = response.data;
    console.log(weatherData.description);


    document.getElementById("temperature").textContent = weatherData.temperature + "°C";
    document.getElementById("description").textContent = weatherData.description;
    document.getElementById("feelslike").textContent = weatherData.feelsLike + "°C";
    document.getElementById("humidity").textContent = weatherData.humidity + "%";
    document.getElementById("pressure").textContent = weatherData.pressure + " hPa";
    document.getElementById("wind").textContent = weatherData.windSpeed + " m/s";
    document.getElementById("rain").textContent = weatherData.rainVolumeLast3Hours + " mm";
    document.getElementById("location").textContent = weatherData.cityName + ", " + weatherData.countryCode;
    document.getElementById("weathericon").src = "http://openweathermap.org/img/wn/" + weatherData.icon + ".png";

    initMap(weatherData.coordinates.latitude, weatherData.coordinates.longitude);
    fetchNews(weatherData.cityName);
    getExchange();
  } catch (error) {
    console.log("Error script.js, getWeather: ", error.message);
  }
}

let map;
async function initMap(lat, lng) {
  const placeholder = document.getElementById("placeholderimg");
  placeholder.classList.add('d-none');
 
  const position = { lat: lat, lng: lng };
  
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    zoom: 12,
    center: position,
    mapId: "7ed43e691499dec5",
  });


}


async function fetchNews(city) {
  try {
   
    const response = await axios.get(`http://localhost:3000/news?city=${city}`);
    const newsData = response.data;
    const carouselContainer = document.getElementById('carousel-container');
    while (carouselContainer.firstChild) {
      carouselContainer.removeChild(carouselContainer.firstChild);
    }
    const carousel = document.getElementById('carouselExampleDark');

    for (let i = 0; i < newsData.length; i++) {
      const news = newsData[i];
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      carouselItem.setAttribute('data-bs-interval', '5000');

      if (i === 0) {
        carouselItem.classList.add('active');
      }


      const newsImage = document.createElement('img');
      newsImage.classList.add('d-block', 'w-100', 'opacity-75');
      newsImage.src = news.imageUrl;
      newsImage.alt = news.title;
      const caption = document.createElement('div');
      caption.classList.add('carousel-caption', 'd-none', 'd-md-block', 'bg-gradient');


      const title = document.createElement('h5');
      title.textContent = news.title;

      const description = document.createElement('p');
      description.textContent = news.description;

      const author = document.createElement('p');
      author.textContent = news.author;

      const visitLink = document.createElement('a');
      visitLink.classList.add('btn', 'btn-light', 'btn-sm');
      visitLink.href = news.url;
      visitLink.textContent = 'Visit Website';

      caption.appendChild(title);
      caption.appendChild(description);
      caption.appendChild(author);
      caption.appendChild(visitLink);

      carouselItem.appendChild(newsImage);
      carouselItem.appendChild(caption);

      carouselContainer.appendChild(carouselItem);

    }
    carousel.classList.remove('d-none');


  } catch (error) {
    console.error('Error fetching news data:', error.message);
  }
}



async function getExchange() {
  try{
    const exchangediv = document.getElementById("exchangediv");
    exchangediv.classList.remove('d-none');
    const response = await axios.get(`http://localhost:3000/exchange`);
    const exchangeData = response.data;
    console.log(exchangeData);

    console.log(exchangeData.base_code);
    console.log(exchangeData.conversion_rates.USD);
  
    document.getElementById("baseCurrency").textContent = exchangeData.base_code  ;

    document.getElementById("USD").textContent = (1/((parseFloat(exchangeData.conversion_rates.USD)))).toString().substr(0, 5) + " KZT";  
    document.getElementById("EUR").textContent = (1/((parseFloat(exchangeData.conversion_rates.EUR)))).toString().substr(0, 5) + " KZT";
    document.getElementById("GBP").textContent = (1/((parseFloat(exchangeData.conversion_rates.GBP)))).toString().substr(0, 5) + " KZT";
    document.getElementById("RUB").textContent = (1/((parseFloat(exchangeData.conversion_rates.RUB)))).toString().substr(0, 5) + " KZT";
    document.getElementById("JPY").textContent = (1/((parseFloat(exchangeData.conversion_rates.JPY)))).toString().substr(0, 5) + " KZT";
    document.getElementById("CNY").textContent = (1/((parseFloat(exchangeData.conversion_rates.CNY)))).toString().substr(0, 5) + " KZT";

  }catch(error){
    console.log("Error script.js, getExchange: ", error.message);
  }
}
