const express = require('express');
const router = express.Router();
const con = require('../database');

router.post('/register', (req, res) => {
  const { email, password, name, address, gender } = req.body;
  const query = 'INSERT INTO Patient SET ?';
  
  con.query(query, { email, password, name, address, gender }, (err, result) => {
    if (err) return res.status(400).json(err);
    res.json({ message: 'Patient registered successfully' });
  });
});

// Get patient profile
router.get('/:email', (req, res) => {
  const query = 'SELECT * FROM Patient WHERE email = ?';
  con.query(query, [req.params.email], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(result[0]);
  });
});

module.exports = router;