const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  moisture: Number,
  timestamp: { type: Date, default: Date.now },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
});

module.exports = mongoose.model('Sensor', sensorSchema);
