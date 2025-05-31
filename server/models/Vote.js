const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'ProblemReport', required: true },
  createdAt: { type: Date, default: Date.now }
});

voteSchema.index({ user: 1, problem: 1 }, { unique: true }); // user can vote once per problem

module.exports = mongoose.model('Vote', voteSchema);
