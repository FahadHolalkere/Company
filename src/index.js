
const express = require('express');
const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
const path = require("path");
const event = require('./models/event');
const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const template_path = path.join(__dirname, "../templates/views");
app.set("view engine", "ejs"); 
app.set("views", template_path);
require('dotenv').config()

const PORT = process.env.PORT;

mongoose.connect(process.env.MongoAPI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


app.get('/', (req, res) => {
  res.render('Home');
})

app.get('/events/add', (req, res) => {
  res.render('Event_pages');
})


app.post('/events/added', async (req, res) => {
    csvtojson()
      .fromFile(req.body.inputfile)
      .then(csvData => {
        event.insertMany(csvData).then(function () {
          console.log("data inserted");
          res.send("data Inserted Successfully");
        }).catch(function (error) {
          console.log(error);
          res.send("Error Occured in Insertion")
        })
      })
});

const axios = require('axios');

app.get('/events/find', async (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const startdate = req.query.startdate;

  const specifiedDate = startdate;
  const date = new Date(startdate);
  date.setDate(date.getDate() + 14);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');

  const endDate = `${year}-${month}-${day}`;

  try {
    const events = await event.find({ date: { $gte: specifiedDate, $lte: endDate }}).sort({ date: 1 }).sort({time : 1});
  
    const eventsWithDetails = await Promise.all(events.map(async (event) => {
      const weather = await getWeather(event.city_name, event.date);
      const distance = await calculateDistance(latitude, longitude, event.latitude, event.longitude);
      const et = event.toObject();
      return { 
        "event_name": et.event_name,
        "city_name": et.city_name,
        "date": et.date,
        "weather": weather,
        "distance_km": distance
    }
    })
    );

    var event_data = await getPages(eventsWithDetails)

    const page = req.query.page || 1;
    const pageSize = 1;
    const startIndex = (page-1) * pageSize;
    const endIndex = startIndex + pageSize;

    const pageData = event_data.slice(startIndex, endIndex);
  

    res.json(pageData[0]);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


async function getWeather(city, date) {
  try {
    const response = await axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${process.env.WeatherAPI}&city=${encodeURIComponent(city)}&date=${date}`);
    return response.data.weather;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return 'Unknown';
  }
}

async function getPages(eventsWithDetails) {
  try {
    const ans = [];
    const total_events = eventsWithDetails.length;
    var total_pages = 0;
    if (total_events % 10 != 0) {
      total_pages = Math.floor(total_events / 10) + 1;
    }
    else {
      total_pages = Math.floor(total_events / 10);
    }

    for (var i = 0; i < total_pages; i++) {
      var j = 0;
      var event_no = (i*10)+j;
      var page = {};
      var events = []
      while (event_no < total_events && j < 10) {
        const current_event = await eventsWithDetails[event_no];
        events.push(current_event);
        j++;
        event_no++;
      }
      page = {
          "events": events,
          "page": i+1,
          "pageSize": j,
          "totalEvents": total_events,
          "totalPages": total_pages
      }
      ans[i] = page;
    }
    return ans;
  } catch (error) {
    console.error('Error getting page info:', error);
    return 'page not found';
  }
}


async function calculateDistance(lat1, lon1, lat2, lon2) {
  try {
    const response = await axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${process.env.DistanceAPI}&latitude1=${lat1}&longitude1=${lon1}&latitude2=${lat2}&longitude2=${lon2}`);
    return response.data.distance;
  } catch (error) {
    console.error('Error calculating distance:', error);
    return -1; 
  }
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


