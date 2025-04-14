//backend/routes/schedule.js

const express = require('express');
const router = express.Router();
const con = require('../database');

// Create a schedule entry for a doctor

// Create a new schedule
router.post('/', (req, res) => {
  const { doctor_id, day_of_week, start_time, end_time, break_start, break_end, is_enable } = req.body;
  
  // Validate required fields
  if (!doctor_id || !day_of_week || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Make sure the day_of_week is one of the allowed values
  const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  if (!validDays.includes(day_of_week)) {
    return res.status(400).json({ error: 'Invalid day of week' });
  }
  
  const query = `
    INSERT INTO Schedule 
    (doctor_id, day_of_week, start_time, end_time, break_start, break_end, is_enable)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  // Added debugging to see request data
  console.log('Inserting schedule with values:', { 
    doctor_id, 
    day_of_week, 
    start_time, 
    end_time, 
    break_start, 
    break_end, 
    is_enable: is_enable || 'true' 
  });
  
  con.query(
    query, 
    [doctor_id, day_of_week, start_time, end_time, break_start, break_end, is_enable || 'true'], 
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message || 'Database error', details: err });
      }
      
      // Get the inserted schedule
      const insertId = results.insertId;
      con.query('SELECT * FROM Schedule WHERE id = ?', [insertId], (err, schedules) => {
        if (err) {
          console.error('Error fetching created schedule:', err);
          return res.status(500).json({ error: err.message || 'Error fetching created schedule' });
        }
        res.status(201).json(schedules[0]);
      });
    }
  );
});

// Get schedule for a doctor
router.get('/doctor/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  const query = 'SELECT * FROM Schedule WHERE doctor_id = ?';
  
  con.query(query, [doctorId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
