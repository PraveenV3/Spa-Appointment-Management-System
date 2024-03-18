import mongoose from 'mongoose';

const supplyRequestSchema = mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
    },
    supply: {
      type: String,
      required: true,
    },
    qty: {
      type: String,
      required: true,
    },
    requestDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending', 
    },
  },
  {
    timestamps: true,
  }
);

export const SupplyRequest = mongoose.model('SupplyRequest', supplyRequestSchema);
