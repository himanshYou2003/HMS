const express = require('express');
const router = express.Router();
const con = require('../database');

router.post('/', (req, res) => {
  const { patient, date, conditions, surgeries, medication } = req.body;
  const historyQuery = 'INSERT INTO MedicalHistory SET ?';
  const patientHistoryQuery = 'INSERT INTO PatientsFillHistory SET ?';

  con.beginTransaction(err => {
    if (err) return res.status(500).json(err);

    con.query(historyQuery, { date, conditions, surgeries, medication }, (err, result) => {
      if (err) return con.rollback(() => res.status(400).json(err));
      
      const historyId = result.insertId;
      con.query(patientHistoryQuery, { patient, history: historyId }, err => {
        if (err) return con.rollback(() => res.status(400).json(err));
        
        con.commit(err => {
          if (err) return con.rollback(() => res.status(500).json(err));
          res.json({ message: 'Medical history added successfully', historyId });
        });
      });
    });
  });
});

module.exports = router;