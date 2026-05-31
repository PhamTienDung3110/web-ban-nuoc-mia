import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  defaultPrice: { type: Number, required: true, default: 0 },
  unit: { type: String, default: 'Ly' }, // Ly, Chai, Bó, ...
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true });

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}
export default mongoose.model('Product', ProductSchema);
