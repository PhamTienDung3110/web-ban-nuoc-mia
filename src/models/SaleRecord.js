import mongoose from 'mongoose';

const SaleRecordSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Optional, can be null for walk-in
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.SaleRecord || mongoose.model('SaleRecord', SaleRecordSchema);
