// backend/routes/patient.js
const con = require('../database');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.get('/', (req, res) => {
  const query = 'SELECT * FROM Patient';
  
  con.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }
    
    res.json(results);
  });
});


// Patient Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  

  const query = 'SELECT * FROM Patient WHERE email = ?';
  con.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'No user found with this email' }); // Changed to 404
    }

    const patient = results[0];
    try {
      const match = await bcrypt.compare(password, patient.password);
      if (!match) {
        return res.status(401).json({ error: 'Incorrect password' }); // Specific password error
      }

      const { password: _, ...patientData } = patient;
      res.json(patientData);
    } catch (error) {
      res.status(500).json({ error: 'Error comparing passwords' });
    }
  });
});

// Modified Patient Registration with Password Hashing
router.post('/register', async (req, res) => {
  const { email, password, name, street_address, city_id, state_id, pin_code, gender } = req.body;

  try {
    const checkQuery = 'SELECT id FROM Patient WHERE email = ?';
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
        INSERT INTO Patient 
        (email, password, name, street_address, city_id, state_id, pin_code, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      con.query(insertQuery, 
        [email, hashedPassword, name, street_address, city_id, state_id, pin_code, gender], 
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(409).json({ error: 'An account already exists with this email' });
            }
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Registration failed' });
          }
          res.json({ 
            message: 'Patient registered successfully', 
            id: result.insertId 
          });
        });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});
// Keep all existing patient routes below...


// backend/routes/patient.js - Add this route
router.get('/id/:patientId', (req, res) => {
  const { patientId } = req.params;
  
  const query = 'SELECT * FROM Patient WHERE id = ?';
  
  con.query(query, [patientId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(results[0]);
  });
});

// Get patient profile
router.get('/:email', (req, res) => {
  const { email } = req.params;
  
  const query = 'SELECT * FROM Patient WHERE email = ?';
  
  con.query(query, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(results[0]);
  });
});

router.get('/id/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'SELECT * FROM Patient WHERE id = ?';
  
  con.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: err.message || 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(results[0]);
  });
});
// Similarly, update the update and delete endpoints
router.put('/id/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // Exclude id from updateData if it exists
  const { id: _, ...dataToUpdate } = updateData;
  
  const query = 'UPDATE Patient SET ? WHERE id = ?';
  
  con.query(query, [dataToUpdate, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(400).json(err);
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ ...updateData, id: Number(id) });
  });
});
router.delete('/id/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM Patient WHERE id = ?';
  
  con.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(400).json(err);
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  });
});

module.exports = router;