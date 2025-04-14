// backend/routes/diagnosis.js
const express = require('express');
const router = express.Router();
const con = require('../database');

router.post('/', (req, res) => {
    const { appointment_id, doctor_id, diagnosis, prescription, notes } = req.body;
    const query = `INSERT INTO Diagnosis 
      (appointment_id, doctor_id, diagnosis, prescription, notes) 
      VALUES (?, ?, ?, ?, ?)`;
  
    con.query(
      query,
      [appointment_id, doctor_id, diagnosis, prescription, notes || null],
      (err, result) => {
        if (err) return res.status(400).json(err);
        res.json({
          id: result.insertId,
          appointment_id,
          doctor_id,
          diagnosis,
          prescription,
          notes: notes || null,
          created_on: new Date().toISOString()
        });
      }
    );
  });
  

  router.get('/appointments/:appointmentId', (req, res) => {
    const { appointmentId } = req.params;
    
    const query = 'SELECT * FROM Diagnosis WHERE appointment_id = ? ORDER BY created_on DESC';
    
    con.query(query, [appointmentId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message || 'Database error' });
      }
      
      res.json(results);
    });
  });

router.post('/', (req, res) => {
  const { appointment_id, doctor_id, diagnosis, prescription, notes } = req.body;
  
  const query = `INSERT INTO Diagnosis 
    (appointment_id, doctor_id, diagnosis, prescription, notes) 
    VALUES (?, ?, ?, ?, ?)`;
  
  con.query(query, [appointment_id, doctor_id, diagnosis, prescription, notes || null], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(400).json(err);
    }
    
    res.status(201).json({
      id: result.insertId,
      appointment_id,
      doctor_id,
      diagnosis,
      prescription,
      notes,
      created_on: new Date().toISOString()
    });
  });
});

module.exports = router;