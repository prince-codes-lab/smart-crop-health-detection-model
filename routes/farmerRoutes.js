const express = require('express');
const Farmer = require('../models/Farmer');
const router = express.Router();

router.post('/', async (req, res) => {
  const farmer = new Farmer(req.body);
  await farmer.save();
  res.json(farmer);
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const farmer = await Farmer.findOne({ name });
  if (farmer && farmer.password === password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

module.exports = router;
