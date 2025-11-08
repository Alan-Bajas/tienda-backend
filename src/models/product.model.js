import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  category: { type: String, index: true },
  price: { type: Number, required: true, index: true },
  stock: { type: Number, default: 0, index: true },
  status: { type: String, enum: ['active','inactive'], default: 'active', index: true },
  thumbnail: String
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', category: 'text' });

export const Product = mongoose.model('Product', productSchema);
