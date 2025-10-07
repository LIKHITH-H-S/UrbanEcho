const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true, enum: ['Waste', 'Roads', 'Water', 'Electricity', 'Safety', 'Environment', 'Other'] },
  location: { type: String, required: true },
  image: { type: String }, // URL or path to the image
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  votesCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'verified', 'sent_to_government', 'done'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedAt: {
    type: Date,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verificationImage: {
    type: String,
    default: null
  },
  submittedToGovernment: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: null
  },
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
