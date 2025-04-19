const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

//To get all the appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient')
      .populate('doctor')
      .populate('clinic');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//To get the appointments by patient ID
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate('doctor')
      .populate('clinic');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//To get the appointments by doctor ID
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId })
      .populate('patient')
      .populate('clinic');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//To create a new appointment
router.post('/', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    //To Check if the time slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      date: req.body.date,
      'timeSlot.startTime': req.body.timeSlot.startTime,
      status: 'scheduled'
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const appointment = new Appointment({
      patient: req.body.patient,
      doctor: req.body.doctor,
      clinic: req.body.clinic,
      date: req.body.date,
      timeSlot: req.body.timeSlot,
      reason: req.body.reason
    });

    const newAppointment = await appointment.save();
    await newAppointment.populate(['patient', 'doctor', 'clinic']);
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//To update the status of the appointment
router.patch('/:id/status', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = req.body.status;
    const updatedAppointment = await appointment.save();
    await updatedAppointment.populate(['patient', 'doctor', 'clinic']);
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//To cancel the appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//To get the available time slots for a doctor on a specific date
router.get('/available-slots/:doctorId/:date', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId).populate('clinics');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    const date = new Date(req.params.date);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    // Get doctor's availability for the day
    const availability = doctor.availability.find(a => 
      a.days.includes(dayOfWeek)
    );

    if (!availability) {
      return res.status(400).json({ message: 'Doctor is not available on this day' });
    }

    //To get the booked appointments for the day
    const bookedAppointments = await Appointment.find({
      doctor: req.params.doctorId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59))
      },
      status: 'scheduled'
    });

    //To get the booked slots
    const bookedSlots = bookedAppointments.map(app => app.timeSlot.startTime);
    const availableSlots = availability.timeSlots.filter(
      slot => !bookedSlots.includes(slot.startTime)
    );

    res.json(availableSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 