Doctor appointment system - LLD

1. Class Diagram
classDiagram
    class Doctor {
        -String _id
        -String name
        -String specialization
        -Array<ObjectId> clinics
        -Array<Availability> availability
        +createDoctor()
        +updateDoctor()
        +getDoctorById()
        +getDoctorAvailability()
    }

    class Clinic {
        -String _id
        -String name
        -Address address
        -Array<ObjectId> doctors
        -Array<OperatingHours> operatingHours
        +createClinic()
        +updateClinic()
        +getClinicById()
        +getDoctorsInClinic()
    }

    class Patient {
        -String _id
        -String name
        -String email
        -String phone
        -Date dateOfBirth
        +createPatient()
        +updatePatient()
        +getPatientById()
    }

    class Appointment {
        -String _id
        -ObjectId patientId
        -ObjectId doctorId
        -ObjectId clinicId
        -Date date
        -TimeSlot timeSlot
        -String status
        +createAppointment()
        +updateStatus()
        +cancelAppointment()
        +getAvailableSlots()
    }

    Doctor "1" -- "*" Clinic : works at
    Doctor "1" -- "*" Appointment : has
    Patient "1" -- "*" Appointment : books
    Clinic "1" -- "*" Appointment : hosts


2. Database Schema
Collections
1.doctors

   {
     _id: ObjectId,
     name: String,
     specialization: String,
     clinics: [ObjectId],
     availability: [{
       clinicId: ObjectId,
       days: [String],
       timeSlots: [{startTime: String, endTime: String}]
     }]
   }
   

2. clinics
   javascript
   {
     _id: ObjectId,
     name: String,
     address: {
       street: String,
       city: String,
       state: String,
       zipCode: String
     },
     doctors: [ObjectId],
     operatingHours: [{
       day: String,
       openTime: String,
       closeTime: String
     }]
   }
3.patients
   {
     _id: ObjectId,
     name: String,
     email: String,
     phone: String,
     dateOfBirth: Date
   }
   ```

4.appointments
   {
     _id: ObjectId,
     patientId: ObjectId,
     doctorId: ObjectId,
     clinicId: ObjectId,
     date: Date,
     timeSlot: {
       startTime: String,
       endTime: String
     },
     status: String
   }
   ```

3.API Endpoints

Doctor APIs
- GET `/api/doctors` - Get all doctors
- GET `/api/doctors/:id` - Get doctor by ID
- POST `/api/doctors` - Create doctor
- GET `/api/doctors/:id/availability` - Get doctor's availability

Appointment APIs
- POST `/api/appointments` - Book appointment
- PATCH `/api/appointments/:id/status` - Update status
- GET `/api/appointments/available-slots/:doctorId/:date` - Get available slots
- GET `/api/appointments/patient/:patientId` - Get patient's appointments

4. Key Features

1. Appointment Booking Flow
   
   sequenceDiagram
       Patient->>System: Request available slots
       System->>Doctor: Check availability
       System->>Clinic: Check operating hours
       System-->>Patient: Return available slots
       Patient->>System: Book appointment
       System-->>Patient: Confirm booking
   

2. Data Validations
   - Prevent double booking
   - Check doctor availability
   - Validate clinic operating hours
   - Ensure valid time slots

5. Technical Considerations

1. Indexes
   - `doctors`: `_id`, `clinics`
   - `appointments`: `doctorId`, `date`, `status`
   - `patients`: `_id, `email`

2. Error Handling
   - Invalid bookings
   - Time slot conflicts
   - Not found resources
   - Server errors

3. Security
   - Input validation
   - Data sanitization
   - API rate limiting 