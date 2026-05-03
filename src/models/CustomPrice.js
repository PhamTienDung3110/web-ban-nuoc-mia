import mongoose from 'mongoose';

const CustomPriceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true });

// Ensure one custom price per product per customer
CustomPriceSchema.index({ customer: 1, product: 1 }, { unique: true });

if (mongoose.models.CustomPrice) {
  delete mongoose.models.CustomPrice;
}
export default mongoose.model('CustomPrice', CustomPriceSchema);
