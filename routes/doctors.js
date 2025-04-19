const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

//To get all the doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('clinics');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//To get the doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('clinics');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//To create a new doctor
router.post('/', async (req, res) => {
  const doctor = new Doctor({
    name: req.body.name,
    specialization: req.body.specialization,
    clinics: req.body.clinics,
    availability: req.body.availability
  });

  try {
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//To update the doctor
router.patch('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (req.body.name) doctor.name = req.body.name;
    if (req.body.specialization) doctor.specialization = req.body.specialization;
    if (req.body.clinics) doctor.clinics = req.body.clinics;
    if (req.body.availability) doctor.availability = req.body.availability;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//To delete the doctor
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    await doctor.remove();
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//To get the doctor's available time slots
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('clinics');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor.availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 