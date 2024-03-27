import React, { useState, useEffect } from 'react';
import axios from 'axios';
import sideImage from '../images/reqBack.png';
import { FaUserFriends, FaHistory } from 'react-icons/fa';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';

const RequestSupply = ({ isDarkMode }) => {
    const [formData, setFormData] = useState({
        supplierName: '',
        supply: '',
        quantity: '',
        requestDate: '',
    });
    const [companyNames, setCompanyNames] = useState([]);

    useEffect(() => {
        fetchCompanyNames();
    }, []);

    const fetchCompanyNames = async () => {
        try {
            const response = await axios.get('http://localhost:5555/suppliers');
            const names = response.data.data.map(supplier => supplier.companyName);
            setCompanyNames(names);
        } catch (error) {
            console.error('Error fetching company names:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.supplierName) {
            swal("", "Supplier Name cannot be empty.", "error");
            return false;
        }
        if (!formData.supply) {
            swal("", "Supply cannot be empty.", "error");
            return false;
        }
        if (!formData.quantity) {
            swal("", "Quantity cannot be empty.", "error");
            return false;
        }
        if (!formData.requestDate) {
            swal("", "Request Date cannot be empty.", "error");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post('http://localhost:5555/supply-requests', {
                supplierName: formData.supplierName,
                supply: formData.supply,
                qty: formData.quantity,
                requestDate: formData.requestDate,
            });
            swal("Success!", "Your request has been successfully submitted.", "success");
        } catch (error) {
            console.error('Error submitting form:', error);
            swal("Failed!", "There was a problem submitting your request.", "error");
        }
    };

    const cardStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%', 
        margin: '50px',
        marginTop: '50px',
        backgroundColor: isDarkMode ? '#333' : '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        padding: '20px',
        fontFamily: 'sans-serif',
        position: 'relative',
    };

    const formSectionStyle = {
        width: '50%',
        paddingRight: '20px', 
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 0',
        margin: '10px 20px',
        border: 'none',
        borderBottom: `2px solid ${isDarkMode ? '#555' : '#ccc'}`,
        backgroundColor: 'transparent',
        color: isDarkMode ? '#ddd' : '#333',
        fontSize: '16px',
        outline: 'none',
    };

    const labelStyle = {
        fontWeight: 'lighter',
        marginBottom: '5px',
        color: isDarkMode ? '#ddd' : '#333',
    };

    const buttonStyle = {
        width: '100%',
        padding: '15px',
        marginTop: '20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '10px 20px',
        textDecoration: 'none'
    };

    const buttontwo = {
        width: '85%',
        padding: '15px',
        marginTop: '10px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#009688',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        margin: '10px 20px',
        textDecoration: 'none'
    };

    const imageStyle = {
        width: '50%',
        height: 'auto',
    };

    const iconStyle = {
        marginRight: '10px',
    };

    

    const buttonContainerStyle = {
        position: 'absolute',
        top: '28%',
        right: '50px',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    };

    return (
        <div>
            <div style={cardStyle}>
                <form onSubmit={handleSubmit} style={formSectionStyle}>
                    <h2 style={{ color: isDarkMode ? '#fff' : '#000', marginBottom: '20px' }}>Request Supplies</h2>

                    <label htmlFor="supplierName" style={labelStyle}>Company Name</label>
                    <select
                        id="supplierName"
                        name="supplierName"
                        style={inputStyle}
                        value={formData.supplierName}
                        onChange={handleChange}
                    >
                        <option value="">Select Company</option>
                        {companyNames.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>

                    <label htmlFor="supply" style={labelStyle}>Supply</label>
                    <input
                        type="text"
                        id="supply"
                        name="supply"
                        placeholder="Supply"
                        style={inputStyle}
                        value={formData.supply}
                        onChange={handleChange}
                    />

                    <label htmlFor="quantity" style={labelStyle}>Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        placeholder="Quantity"
                        style={inputStyle}
                        value={formData.quantity}
                        onChange={handleChange}
                    />

                    <label htmlFor="requestDate" style={labelStyle}>Request Date</label>
                    <input
                        type="date"
                        id="requestDate"
                        name="requestDate"
                        style={inputStyle}
                        value={formData.requestDate}
                        onChange={handleChange}
                    />

                    <button type="submit" style={buttonStyle}>Submit Request</button>
                </form>

                <div style={imageStyle}>
                    <img src={sideImage} alt="Profile" style={{ width: '120%', height: 'auto' }} />
                </div>
            </div>

            <div style={buttonContainerStyle}>
            <Link to="/manage-suppliers" style={buttontwo}>
                <FaUserFriends style={iconStyle} />
                Manage Suppliers
                </Link>
                <Link to="/request-history" style={buttontwo}>
                    <FaHistory style={iconStyle} />
                    Request History
                    </Link>
            </div>
        </div>
    );
};

export default RequestSupply;
