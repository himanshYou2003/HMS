// backend/routes/appointments.js
const express = require('express');
const router = express.Router();
const con = require('../database');

// Create Appointment
router.post('/', (req, res) => {
  const { patient_id, doctor_id, date, start_time, end_time, status } = req.body;
  const query = `INSERT INTO Appointment 
    (patient_id, doctor_id, date, start_time, end_time, status) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  con.query(query, [patient_id, doctor_id, date, start_time, end_time, status], (err, result) => {
    if (err) return res.status(400).json(err);
    res.json({
      id: result.insertId,
      patient_id,
      doctor_id,
      date,
      start_time,
      end_time,
      status,
      created_on: new Date().toISOString()
    });
  });
});

// Get All Appointments
router.get('/', (req, res) => {
  con.query('SELECT * FROM Appointment', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get patient appointments
router.get('/patient/:patientId', (req, res) => {
  const { patientId } = req.params;
  const query = 'SELECT * FROM Appointment WHERE patient_id = ?';
  
  con.query(query, [patientId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get doctor appointments - simplified version without JOIN to avoid errors
router.get('/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  
  const query = 'SELECT * FROM Appointment WHERE doctor_id = ? ORDER BY date DESC, start_time ASC';
  
  con.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }
    res.json(results);
  });
});

// Update appointment status
router.put('/:appointmentId/status', (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  
  const query = 'UPDATE Appointment SET status = ? WHERE id = ?';
  
  con.query(query, [status, appointmentId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ id: appointmentId, status });
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM Appointment WHERE id = ?';
  
  con.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(results[0]);
  });
});

module.exports = router;