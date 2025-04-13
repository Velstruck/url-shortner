import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const urlSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  longUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortId: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(8)
  },
  customAlias: {
    type: String,
    sparse: true,
    trim: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  expirationDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


const Url = mongoose.model('Url', urlSchema);

export default Url;