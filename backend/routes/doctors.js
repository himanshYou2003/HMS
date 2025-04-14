// backend/routes/doctors.js
const express = require('express');
const router = express.Router();
const con = require('../database');
const bcrypt = require('bcrypt');
const saltRounds = 10;


// Doctor Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const query = 'SELECT * FROM Doctor WHERE email = ?';
  con.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No user found with this email' });
    }

    const doctor = results[0];
    try {
      const match = await bcrypt.compare(password, doctor.password);
      if (!match) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      const { password: _, ...doctorData } = doctor;
      res.json(doctorData);
    } catch (error) {
      res.status(500).json({ error: 'Error comparing passwords' });
    }
  });
});

// Modified Doctor Registration with Password Hashing
router.post('/register', async (req, res) => {
  const { email, password, name, specialization, gender } = req.body;

  try {
    const checkQuery = 'SELECT id FROM Doctor WHERE email = ?';
    con.query(checkQuery, [email], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Database error:', checkErr);
        return res.status(500).json({ error: 'Database error' });
      }

      if (checkResults.length > 0) {
        return res.status(409).json({ error: 'An account already exists with this email' });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const insertQuery = `
        INSERT INTO Doctor 
        (email, password, name, specialization, gender) 
        VALUES (?, ?, ?, ?, ?)
      `;

      con.query(insertQuery, 
        [email, hashedPassword, name, specialization, gender], 
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(409).json({ error: 'An account already exists with this email' });
            }
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Registration failed' });
          }
          res.json({ 
            message: 'Doctor registered successfully', 
            id: result.insertId 
          });
        });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.get('/', (req, res) => {
  const query = 'SELECT * FROM Doctor';
  con.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM Doctor WHERE id = ?';
  con.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(results[0]);
  });
});

module.exports = router;