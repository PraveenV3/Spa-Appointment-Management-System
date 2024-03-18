import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './supply/Home';

import ManageSuppliers from './supply/ManageSupply';
import RequestHistory from './supply/RequestHistory';

import './App.css'; // Assuming your CSS file is correctly placed

function App() {
  return (
    <Router>
      <div className="App">
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manage-suppliers" element={<ManageSuppliers />} /> 
          
          <Route path="/request-history" element={<RequestHistory />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
