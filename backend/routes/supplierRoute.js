import express from 'express';
import { Supplier } from '../models/supplierModel.js'; // Adjusted import to use the Supplier model

const router = express.Router();

// Route for Save a new Supplier
router.post('/', async (request, response) => {
  try {
    if (
      !request.body.companyName ||
      !request.body.contactNumber ||
      !request.body.address ||
      !request.body.email ||
      !request.body.productType
    ) {
      return response.status(400).send({
        message: 'Send all required fields: companyName, contactNumber, address, email, productType',
      });
    }
    const newSupplier = {
      companyName: request.body.companyName,
      contactNumber: request.body.contactNumber,
      address: request.body.address,
      email: request.body.email,
      productType: request.body.productType,
    };

    const supplier = await Supplier.create(newSupplier);

    return response.status(201).send(supplier);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get All Suppliers from database
router.get('/', async (request, response) => {
  try {
    const suppliers = await Supplier.find({});

    return response.status(200).json({
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Supplier from database by id
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return response.status(404).json({ message: 'Supplier not found' });
    }

    return response.status(200).json(supplier);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Supplier
router.put('/:id', async (request, response) => {
  try {
    const updateData = {
      companyName: request.body.companyName,
      contactNumber: request.body.contactNumber,
      address: request.body.address,
      email: request.body.email,
      productType: request.body.productType,
    };

    const { id } = request.params;

    const result = await Supplier.findByIdAndUpdate(id, updateData, { new: true });

    if (!result) {
      return response.status(404).json({ message: 'Supplier not found' });
    }

    return response.status(200).json({ message: 'Supplier updated successfully', data: result });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Delete a Supplier
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Supplier.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Supplier not found' });
    }

    return response.status(200).send({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
