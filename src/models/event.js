// models/event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: String,
  city_name: String,
  date: String,
  time: String,
  latitude: Number,
  longitude: Number
});

const event = mongoose.model('Event', eventSchema);
module.exports = event;
