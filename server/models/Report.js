const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: String, // (Optional: for categorizing issues later)
   location: {
    type: {
      type: String, // "Point"
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
  type: [Number],
  required: false // or just remove `required`
}

  },
  imageUrl: String,
  mediaUrl: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  upvotes: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' }, // Pending / In Progress / Resolved
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      user: String,
      text: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
});
reportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);
