const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  upvotes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);