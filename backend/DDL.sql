--backend/DDL.sql

-- Enhanced Hospital Management System (HMS) Schema
CREATE DATABASE IF NOT EXISTS HMS;
USE HMS;

-- Master Tables for Location Data
CREATE TABLE IF NOT EXISTS Master_state (
    id INT PRIMARY KEY AUTO_INCREMENT,
    state VARCHAR(255) NOT NULL,
    is_enable ENUM('true', 'false') DEFAULT 'true',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Master_city (
    id INT PRIMARY KEY AUTO_INCREMENT,
    state_id INT NOT NULL,
    city VARCHAR(255) NOT NULL,
    is_enable ENUM('true', 'false') DEFAULT 'true',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES Master_state(id) ON DELETE CASCADE
);

-- Enhanced Patient Table
CREATE TABLE IF NOT EXISTS Patient (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    name VARCHAR(50) NOT NULL,
    street_address VARCHAR(100) NOT NULL,
    city_id INT NOT NULL,
    state_id INT NOT NULL,
    pin_code CHAR(6) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    is_enable ENUM('true', 'false') DEFAULT 'true',
    registered_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES Master_city(id),
    FOREIGN KEY (state_id) REFERENCES Master_state(id)
);

-- Enhanced Medical History
CREATE TABLE IF NOT EXISTS MedicalHistory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    conditions TEXT NOT NULL,
    surgeries TEXT NOT NULL,
    medications TEXT NOT NULL,
    notes TEXT,
    is_enable ENUM('true', 'false') DEFAULT 'true',
    FOREIGN KEY (patient_id) REFERENCES Patient(id) ON DELETE CASCADE
);

-- Enhanced Doctor Table
CREATE TABLE IF NOT EXISTS Doctor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    is_enable ENUM('true', 'false') DEFAULT 'true',
    registered_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Appointment System
CREATE TABLE IF NOT EXISTS Appointment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'canceled') NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time),
    FOREIGN KEY (patient_id) REFERENCES Patient(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(id) ON DELETE CASCADE
);

-- Enhanced Schedule System
CREATE TABLE IF NOT EXISTS Schedule (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    day_of_week ENUM('mon','tue','wed','thu','fri','sat','sun') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start TIME,
    break_end TIME,
    is_enable ENUM('true', 'false') DEFAULT 'true',
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time),
    CHECK (break_end > break_start),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(id) ON DELETE CASCADE
);

-- Enhanced Diagnostic System
CREATE TABLE IF NOT EXISTS Diagnosis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT NOT NULL,
    doctor_id INT NOT NULL,
    diagnosis TEXT NOT NULL,
    prescription TEXT NOT NULL,
    notes TEXT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES Appointment(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(id) ON DELETE CASCADE
);

-- Audit Table for History Access
CREATE TABLE IF NOT EXISTS HistoryAccessLog (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    patient_id INT NOT NULL,
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_type ENUM('view', 'update') NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES Patient(id) ON DELETE CASCADE
);
