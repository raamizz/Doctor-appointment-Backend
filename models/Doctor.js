const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  clinics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic'
  }],
  availability: [{
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic'
    },
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    timeSlots: [{
      startTime: String,
      endTime: String
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema); 