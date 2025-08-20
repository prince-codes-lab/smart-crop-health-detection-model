const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: String,
  healthStatus: String,
  recommendation: String,
  timestamp: { type: Date, default: Date.now },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
});

module.exports = mongoose.model('Image', imageSchema);
