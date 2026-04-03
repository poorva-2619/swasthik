const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  contact_no: { type: String, required: true, unique: true, index: true },
  created_at: { type: Date, default: Date.now },
});

const patientSchema = new mongoose.Schema({
  contact_no: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  locality: { type: String, required: true },
  occupation: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const recordSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Patient' },
  symptoms: [{ type: String }],
  diagnosis_result: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Patient: mongoose.model('Patient', patientSchema),
  Record: mongoose.model('Record', recordSchema)
};
