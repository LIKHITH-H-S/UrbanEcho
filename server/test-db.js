const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/urbanecho', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  process.exit(0);
})
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});
