
require('dotenv').config();
const express = require('express');
const geoip = require('geoip-lite');
const axios = require('axios');

const app = express();

app.get('/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.ip;
    console.log(clientIp);
  
  // Use geoip-lite to get location info
  const geo = geoip.lookup(clientIp);
    const city = geo ? geo.city : 'Unknown';
    const latitude = geo ? geo.ll[0] : 'Unknown';
    const longitude = geo ? geo.ll[1] : 'Unknown';

  try {
      // Fetch weather data (replace with your preferred weather API)
      // const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_KEY}Y&units=metric`);
      const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=23&longitude=25&current=temperature_2m&forecast_days=1')
      const temperature = weatherResponse.data.current.temperature_2m;

    const response = {
      client_ip: clientIp,
        location: city,
        latitude: latitude,
        longitude: longitude,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}`
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});