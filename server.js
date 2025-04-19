const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDBBB'))
  .catch((err) => console.error('MongoDB connection errr:', err));

const doctorRoutes = require('./routes/doctors');
const clinicRoutes = require('./routes/clinics');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');


app.use('/api/doctors', doctorRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on portt ${PORT}`);
}); 