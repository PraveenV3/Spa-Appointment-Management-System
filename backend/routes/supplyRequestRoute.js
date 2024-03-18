// SupplyRequestRoute.js

import express from 'express';
import { SupplyRequest } from '../models/supplyRequest.js';

const router = express.Router();

// Route for saving a new supply request
router.post('/', async (req, res) => {
  try {
    const { supplierName, supply, qty, requestDate } = req.body;

    const newSupplyRequest = new SupplyRequest({
      supplierName,
      supply,
      qty,
      requestDate
    });

    const savedSupplyRequest = await newSupplyRequest.save();

    res.status(201).json(savedSupplyRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Server Error' });
  }
});

// Route for getting all supply requests
router.get('/', async (req, res) => {
  try {
    const supplyRequests = await SupplyRequest.find();

    res.status(200).json({
      count: supplyRequests.length,
      data: supplyRequests
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Server Error' });
  }
});

// Route for getting a single supply request by id
router.get('/:id', async (req, res) => {
  try {
    const supplyRequest = await SupplyRequest.findById(req.params.id);

    if (!supplyRequest) {
      return res.status(404).json({ message: 'Supply request not found' });
    }

    res.status(200).json(supplyRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Server Error' });
  }
});

// Route for updating a supply request by id
router.put('/:id', async (req, res) => {
  try {
    const updatedSupplyRequest = await SupplyRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedSupplyRequest) {
      return res.status(404).json({ message: 'Supply request not found' });
    }

    res.status(200).json(updatedSupplyRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Server Error' });
  }
});

// Route for deleting a supply request by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedSupplyRequest = await SupplyRequest.findByIdAndDelete(req.params.id);

    if (!deletedSupplyRequest) {
      return res.status(404).json({ message: 'Supply request not found' });
    }

    res.status(200).json({ message: 'Supply request deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: 'Server Error' });
  }
});

export default router;
