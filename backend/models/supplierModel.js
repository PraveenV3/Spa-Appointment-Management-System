import mongoose from 'mongoose';

const supplierSchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);


export const Supplier = mongoose.model('Supplier', supplierSchema);
