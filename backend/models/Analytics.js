import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  browser: {
    type: String,
    required: true
  },
  os: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster analytics queries
analyticsSchema.index({ url: 1, timestamp: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;