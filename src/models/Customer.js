import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }
}, { timestamps: true });

if (mongoose.models.Customer) {
  delete mongoose.models.Customer;
}
export default mongoose.model('Customer', CustomerSchema);
