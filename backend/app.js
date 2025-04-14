//backend/app.js
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const app = express();


// Middleware
// backend/app.js

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/patient', require('./routes/patients'));
app.use('/api/diagnosis', require('./routes/diagnosis'));
app.use('/api/masters', require('./routes/master'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/medical-history', require('./routes/medicalHistory'));

// Error handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;