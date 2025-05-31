const mongoose = require('mongoose');

const problemReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true, enum: ['Waste', 'Road', 'Water', 'Electricity', 'Other'] },
  location: { type: String, required: true },
  votesCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ProblemReport', problemReportSchema);
