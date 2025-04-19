# Doctor Appointment Booking System

A Node.js and MongoDB-based API for managing doctor appointments across multiple clinics.

## Features

- Manage doctors, clinics, patients, and appointments
- Book appointments with specific doctors or at specific clinics
- Check doctor availability and time slots
- Track appointment status (scheduled, completed, cancelled)
- Support for doctors working in multiple clinics
- Flexible scheduling system

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd appointment-booking-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/appointment-system
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PATCH /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor
- `GET /api/doctors/:id/availability` - Get doctor's availability

### Clinics
- `GET /api/clinics` - Get all clinics
- `GET /api/clinics/:id` - Get clinic by ID
- `POST /api/clinics` - Create new clinic
- `PATCH /api/clinics/:id` - Update clinic
- `DELETE /api/clinics/:id` - Delete clinic
- `GET /api/clinics/:id/doctors` - Get doctors in a clinic

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PATCH /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/patient/:patientId` - Get appointments by patient
- `GET /api/appointments/doctor/:doctorId` - Get appointments by doctor
- `POST /api/appointments` - Create new appointment
- `PATCH /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/available-slots/:doctorId/:date` - Get available time slots

## Data Models

### Doctor
```javascript
{
  name: String,
  specialization: String,
  clinics: [Clinic],
  availability: [{
    clinic: Clinic,
    days: [String],
    timeSlots: [{
      startTime: String,
      endTime: String
    }]
  }]
}
```

### Clinic
```javascript
{
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  doctors: [Doctor],
  operatingHours: [{
    day: String,
    openTime: String,
    closeTime: String
  }]
}
```

### Patient
```javascript
{
  name: String,
  email: String,
  phone: String,
  dateOfBirth: Date,
  medicalHistory: String
}
```

### Appointment
```javascript
{
  patient: Patient,
  doctor: Doctor,
  clinic: Clinic,
  date: Date,
  timeSlot: {
    startTime: String,
    endTime: String
  },
  status: String,
  reason: String
}
```

## Error Handling

The API uses standard HTTP status codes for error responses:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error responses include a message field explaining the error.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 