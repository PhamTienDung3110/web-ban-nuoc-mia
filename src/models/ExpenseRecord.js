import mongoose from 'mongoose';

const ExpenseRecordSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Bó mía", "Ly nhựa"
  amount: { type: Number, required: true, min: 0 }, // Total cost
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.ExpenseRecord || mongoose.model('ExpenseRecord', ExpenseRecordSchema);
