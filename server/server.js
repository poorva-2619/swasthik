require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { User, Patient, Record } = require('./models');
const { initializeExcel, appendRecordToExcel } = require('./excelService');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Excel Log File
initializeExcel();

// Database Connection
async function connectDB() {
  let uri = MONGO_URI;
  if (!uri) {
    console.log('No MONGO_URI provided in .env. Starting in-memory MongoDB...');
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB at', uri.includes('mongodb-memory-server') ? 'In-Memory DB' : uri);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
  }
}
connectDB();

// --- API Endpoints ---

// 1. Auth / Login (Get or Create User)
app.post('/api/auth', async (req, res) => {
  try {
    const { contact_no } = req.body;
    if (!contact_no) return res.status(400).json({ error: 'Contact number is required' });

    let user = await User.findOne({ contact_no });
    let isNew = false;
    
    if (!user) {
      user = new User({ contact_no });
      await user.save();
      isNew = true;
    }

    res.json({ user, isNew });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Patients for a User
app.get('/api/users/:contact_no/patients', async (req, res) => {
  try {
    const { contact_no } = req.params;
    const user = await User.findOne({ contact_no });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const patients = await Patient.find({ contact_no });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Add a new Patient
app.post('/api/patients', async (req, res) => {
  try {
    const { contact_no, name, age, gender, locality, occupation } = req.body;
    if (!contact_no || !name || !age || !gender || !locality) {
      return res.status(400).json({ error: 'Missing required patient fields' });
    }

    const patient = new Patient({ contact_no, name, age, gender, locality, occupation });
    await patient.save();
    
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Records for a Patient
app.get('/api/patients/:patient_id/records', async (req, res) => {
  try {
    const { patient_id } = req.params;
    const records = await Record.find({ patient_id }).sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Save a Diagnosis Record
app.post('/api/records', async (req, res) => {
  try {
    const { patient_id, symptoms, diagnosis_result } = req.body;
    
    const patient = await Patient.findById(patient_id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const record = new Record({
      patient_id,
      symptoms,
      diagnosis_result
    });
    await record.save();

    // Auto-log to Excel
    await appendRecordToExcel({
      contact_no: patient.contact_no,
      patient_name: patient.name,
      age: patient.age,
      gender: patient.gender,
      locality: patient.locality,
      symptoms: record.symptoms,
      diagnosis_result: record.diagnosis_result
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
