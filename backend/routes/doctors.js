const express = require('express');
const router = express.Router();
const con = require('../database');

router.post('/register', (req, res) => {
  const { email, password, name, gender } = req.body;
  const query = 'INSERT INTO Doctor SET ?';
  
  con.query(query, { email, password, name, gender }, (err, result) => {
    if (err) return res.status(400).json(err);
    res.json({ message: 'Doctor registered successfully' });
  });
});

router.get('/', (req, res) => {
  const query = 'SELECT * FROM Doctor';
  con.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;