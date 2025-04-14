//backend/routes/medicalHistory.js

const express = require('express');
const router = express.Router();
const con = require('../database');

router.post('/', (req, res) => {
  const { patient_id, conditions, surgeries, medications, notes } = req.body;
  const query = `INSERT INTO MedicalHistory 
    (patient_id, conditions, surgeries, medications, notes) 
    VALUES (?, ?, ?, ?, ?)`;

  con.query(query, [patient_id, conditions, surgeries, medications, notes], (err, result) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Medical history added successfully',
      history_id: result.insertId,
      created_on: new Date().toISOString()
    });
  });
});

router.get('/patient/:patientId', (req, res) => {
  const { patientId } = req.params;
  const query = `SELECT * FROM MedicalHistory 
                 WHERE patient_id = ? AND is_enable = 'true'`;

  con.query(query, [patientId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
