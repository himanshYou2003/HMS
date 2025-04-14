// backend/routes/master.js
const express = require('express');
const router = express.Router();
const con = require('../database');

// Master_state Endpoints
router.post('/states', (req, res) => {
  const { state } = req.body;
  const query = 'INSERT INTO Master_state (state) VALUES (?)';
  
  con.query(query, [state], (err, result) => {
    if (err) return res.status(400).json(err);
    res.json({ 
      id: result.insertId,
      state,
      is_enable: 'true',
      created_on: new Date().toISOString()
    });
  });
});

router.get('/states', (req, res) => {
  const query = 'SELECT * FROM Master_state WHERE is_enable = "true"';
  con.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Master_city Endpoints
router.post('/states/:stateId/cities', (req, res) => {
  const { stateId } = req.params;
  const { city } = req.body;
  const query = `INSERT INTO Master_city 
    (state_id, city) 
    VALUES (?, ?)`;

  con.query(query, [stateId, city], (err, result) => {
    if (err) return res.status(400).json(err);
    res.json({
      id: result.insertId,
      state_id: stateId,
      city,
      is_enable: 'true',
      created_on: new Date().toISOString()
    });
  });
});

router.get('/states/:stateId/cities', (req, res) => {
  const { stateId } = req.params;
  const query = `SELECT * FROM Master_city 
    WHERE state_id = ? AND is_enable = "true"`;
  
  con.query(query, [stateId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;