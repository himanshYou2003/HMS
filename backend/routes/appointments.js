const express = require('express');
const router = express.Router();
const con = require('../database');

router.post('/', (req, res) => {
    const { date, starttime, endtime, patient, concerns, symptoms } = req.body;
    const appointmentQuery = `INSERT INTO Appointment 
      (date, starttime, endtime, status) 
      VALUES (?, ?, ?, 'scheduled')`;
    
    const patientAppointmentQuery = 'INSERT INTO PatientsAttendAppointments SET ?';
  
    con.beginTransaction(err => {
      if (err) return res.status(500).json(err);
  
      con.query(appointmentQuery, [date, starttime, endtime], (err, result) => {
        if (err) return con.rollback(() => res.status(400).json(err));
        
        const apptId = result.insertId;
        con.query(patientAppointmentQuery, 
          { patient, appt: apptId, concerns, symptoms }, 
          (err) => {
            if (err) return con.rollback(() => res.status(400).json(err));
            
            con.commit(err => {
              if (err) return con.rollback(() => res.status(500).json(err));
              res.json({ message: 'Appointment created successfully', apptId });
            });
          }
        );
      });
    });
  });

module.exports = router;