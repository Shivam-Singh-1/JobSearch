import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  location: { type: String, required: true },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], required: true },
  category: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  applicationDeadline: Date,
  experienceLevel: { type: String, enum: ['entry', 'mid', 'senior'], required: true }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);