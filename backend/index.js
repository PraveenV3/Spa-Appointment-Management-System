// server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, mongoDBURL } from './config.js';
import supplierRoute from './routes/supplierRoute.js';
import supplyRequestRoute from './routes/supplyRequestRoute.js'; // Import supply request route

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());

// Default route
app.get('/', (req, res) => {
  console.log(req);
  return res.status(200).send('Welcome to the Supplier Management System');
});

// Supplier routes
app.use('/suppliers', supplierRoute);

// Supply request routes
app.use('/supply-requests', supplyRequestRoute); // Use the supply request route here

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('Connected to the database successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Failed to connect to the database', error);
  });
