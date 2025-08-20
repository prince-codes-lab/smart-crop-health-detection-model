const express = require('express');
const Sensor = require('../models/Sensor');
const router = express.Router();

router.post('/', async (req, res) => {
  const sensor = new Sensor(req.body);
  await sensor.save();
  res.json(sensor);
});
router.get('/export/csv', async (req, res) => {
  const sensors = await Sensor.find();
  const csv = sensors.map(s => `${s.temperature},${s.humidity},${s.moisture}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

module.exports = router;
