require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI 
const farmerRoutes = require('./routes/farmerRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


mongoose.connect(MONGO_URI);

app.use('/api/farmers', farmerRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/images', imageRoutes);

// Add to your routes






app.listen(port, () => {
  console.log('Server running on http://localhost:3000');
});
