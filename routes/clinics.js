const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');

//To get all the clinics
router.get('/', async (req, res) => {
  try {
    const clinics = await Clinic.find().populate('doctors');
    res.json(clinics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//To get the clinic by ID
router.get('/:id', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate('doctors');
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json(clinic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//To create a new clinic
router.post('/', async (req, res) => {
  const clinic = new Clinic({
    name: req.body.name,
    address: req.body.address,
    doctors: req.body.doctors,
    operatingHours: req.body.operatingHours
  });

  try {
    const newClinic = await clinic.save();
    res.status(201).json(newClinic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//To update the clinic
router.patch('/:id', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    if (req.body.name) clinic.name = req.body.name;
    if (req.body.address) clinic.address = req.body.address;
    if (req.body.doctors) clinic.doctors = req.body.doctors;
    if (req.body.operatingHours) clinic.operatingHours = req.body.operatingHours;

    const updatedClinic = await clinic.save();
    res.json(updatedClinic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//To delete the clinic
router.delete('/:id', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    await clinic.remove();
    res.json({ message: 'Clinic deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//To get the doctors in a clinic
router.get('/:id/doctors', async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate('doctors');
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json(clinic.doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 