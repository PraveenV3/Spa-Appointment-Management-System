import React, { Component } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import swal from 'sweetalert';

import Header from '../components/header';
import Sidebar from '../components/sidebar';
import '../styles/style.css';

class ManageSupply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDarkMode: false,
            isSidebarOpen: false,
            suppliers: [],
            isAddModalOpen: false,
            isEditModalOpen: false,
            currentSupplierId: '',
            newSupplier: {
                companyName: '',
                contactNumber: '',
                address: '',
                email: '',
                productType: ''
            },
            validationMessages: {
                companyName: '',
                contactNumber: '',
                address: '',
                email: '',
                productType: ''
            }
        };
    }

    componentDidMount() {
        this.fetchSuppliers();
    }

    fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:5555/suppliers');
            this.setState({ suppliers: response.data.data });
        } catch (error) {
            console.error("Couldn't fetch suppliers", error);
        }
    };

    toggleDarkMode = () => {
        const { isDarkMode } = this.state;
        this.setState(prevState => ({
            isDarkMode: !prevState.isDarkMode,
        }));
        document.body.classList.toggle("dark", !isDarkMode);
    }

    toggleSidebar = () => {
        this.setState(prevState => ({
            isSidebarOpen: !prevState.isSidebarOpen,
        }));
    }

    toggleAddModal = () => {
        this.setState(prevState => ({
            isAddModalOpen: !prevState.isAddModalOpen,
            newSupplier: {
                companyName: '',
                contactNumber: '',
                address: '',
                email: '',
                productType: ''
            },
            validationMessages: {
                companyName: '',
                contactNumber: '',
                address: '',
                email: '',
                productType: ''
            }
        }));
    }

    toggleEditModal = (supplierId = '') => {
        if (supplierId) {
            const supplier = this.state.suppliers.find(supplier => supplier._id === supplierId);
            this.setState({
                currentSupplierId: supplierId,
                newSupplier: { ...supplier },
                isEditModalOpen: true,
            });
        } else {
            this.setState(prevState => ({
                isEditModalOpen: !prevState.isEditModalOpen,
            }));
        }
    }

    handleDelete = async (supplierId) => {
        try {
            await axios.delete(`http://localhost:5555/suppliers/${supplierId}`);
            this.fetchSuppliers();
            swal("Deleted!", "Your supplier has been deleted successfully.", "success");
        } catch (error) {
            console.error("Couldn't delete supplier", error);
            swal("Failed!", "There was a problem deleting your supplier.", "error");
        }
    };

    validateForm = () => {
        const { newSupplier } = this.state;
        let isValid = true;
        let validationMessages = {
            companyName: '',
            contactNumber: '',
            address: '',
            email: '',
            productType: ''
        };

        if (!newSupplier.companyName) {
            validationMessages.companyName = 'Company Name cannot be empty.';
            isValid = false;
        }
        if (!newSupplier.contactNumber.match(/^\d{10}$/)) {
            validationMessages.contactNumber = 'Enter a valid contact number (10 digits).';
            isValid = false;
        }
        if (!newSupplier.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
            validationMessages.email = 'Enter a valid email address.';
            isValid = false;
        }
        if (!newSupplier.address) {
            validationMessages.address = 'Address cannot be empty.';
            isValid = false;
        }
        if (!newSupplier.productType) {
            validationMessages.productType = 'Product Type cannot be empty.';
            isValid = false;
        }

        this.setState({ validationMessages });

        return isValid;
    }

    addSupplier = async () => {
        if (this.validateForm()) {
            const { newSupplier } = this.state;
            try {
                await axios.post('http://localhost:5555/suppliers', newSupplier);
                this.toggleAddModal();
                this.fetchSuppliers();
                swal("Success!", "Supplier added successfully.", "success");
            } catch (error) {
                console.error("Couldn't add supplier", error);
                swal("Failed!", "There was a problem adding the supplier.", "error");
            }
        }
    };

    updateSupplier = async () => {
        if (this.validateForm()) {
            const { newSupplier, currentSupplierId } = this.state;
            try {
                await axios.put(`http://localhost:5555/suppliers/${currentSupplierId}`, newSupplier);
                this.toggleEditModal();
                this.fetchSuppliers();
                swal("Success!", "Supplier updated successfully.", "success");
            } catch (error) {
                console.error("Couldn't update supplier", error);
                swal("Failed!", "There was a problem updating the supplier.", "error");
            }
        }
    };

    handleChange = (field, value) => {
        this.setState(prevState => ({
            newSupplier: {
                ...prevState.newSupplier,
                [field]: value
            }
        }));
    }

    render() {
        const { isDarkMode, isSidebarOpen, suppliers, newSupplier, isAddModalOpen, isEditModalOpen, validationMessages } = this.state;

        const modalStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
        const modalContentStyle = { backgroundColor: isDarkMode ? '#333' : 'white', color: isDarkMode ? 'white' : 'black', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', width: '400px' };
        const cardStyleAdjustment = {
            transition: 'all 0.3s',
            marginLeft: isSidebarOpen ? '90px' : '80px', // Adjust based on your sidebar width
            width: isSidebarOpen ? 'calc(100% - 150px)' : '85%' // Adjust based on your sidebar width
        };

        const commonStyles = {
            cardStyle: {
                display: 'absolute',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '20px',
                marginTop: '70px',
                backgroundColor: isDarkMode ? '#333' : '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                padding: '20px',
                fontFamily: 'sans-serif',
                position: 'relative',
                ...cardStyleAdjustment,
                transition: 'all 0.3s',
                marginLeft: 'var(--sidebar-width, 80px)',
                width: 'calc(100% - var(--sidebar-width, 80px) - 20px)', /* Adjust based on sidebar, 20px for some padding */
            },

            tableStyle: {
                width: '97%', borderCollapse: 'collapse', marginTop: '20px',

            },
            thStyle: {
                backgroundColor: isDarkMode ? '#555' : '#ddd', color: isDarkMode ? '#ddd' : '#333', padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap',
            },
            tdStyle: {
                padding: '12px 15px', borderBottom: '1px solid #ddd', color: isDarkMode ? '#ddd' : '#333', textAlign: 'left',
            },
            actionStyle: {
                display: 'flex', justifyContent: 'space-around',
            },
            buttonContainerStyle: {
                position: 'absolute', top: '8%', right: '20px', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            },
            inputStyle: {
                width: '100%', padding: '10px', marginTop: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', backgroundColor: isDarkMode ? '#444' : '#fff', color: isDarkMode ? '#ddd' : '#333',
            },
            buttonStyle: {
                width: '80%', padding: '10px', marginRight: '10px', marginTop: '10px', borderRadius: '5px', border: 'none', backgroundColor: isDarkMode ? '#009688' : '#009688', color: '#fff', cursor: 'pointer', fontSize: '16px', textDecoration: 'none'
            },
            validationMessageStyle: {
                color: '#ff3860', fontSize: '0.8rem', marginTop: '0.25rem',
            },
        };


        return (
            <div className={`container ${isDarkMode ? "dark" : ""}`}>
                <Header isDarkMode={isDarkMode} />
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={this.toggleSidebar}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={this.toggleDarkMode}
                />

                <div className="home">
                    <div style={commonStyles.cardStyle}>
                        <table style={commonStyles.tableStyle}>
                            <thead>
                                <tr>
                                    <th style={commonStyles.thStyle}>Company Name</th>
                                    <th style={commonStyles.thStyle}>Contact Number</th>
                                    <th style={commonStyles.thStyle}>Address</th>
                                    <th style={commonStyles.thStyle}>Email</th>
                                    <th style={commonStyles.thStyle}>Product Type</th>
                                    <th style={commonStyles.thStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map(supplier => (
                                    <tr key={supplier._id}>
                                        <td style={commonStyles.tdStyle}>{supplier.companyName}</td>
                                        <td style={commonStyles.tdStyle}>{supplier.contactNumber}</td>
                                        <td style={commonStyles.tdStyle}>{supplier.address}</td>
                                        <td style={commonStyles.tdStyle}>{supplier.email}</td>
                                        <td style={commonStyles.tdStyle}>{supplier.productType}</td>
                                        <td style={commonStyles.tdStyle}>
                                            <span style={commonStyles.actionStyle}>
                                                <FaEdit onClick={() => this.toggleEditModal(supplier._id)} />
                                                <FaTrash onClick={() => this.handleDelete(supplier._id)} />
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={commonStyles.buttonContainerStyle}>
                        <button onClick={this.toggleAddModal} style={commonStyles.buttonStyle}>
                            <FaPlus style={{ marginRight: '8px' }} />
                            Add Suppliers
                        </button>
                    </div>
                    {isAddModalOpen && (
                        <div style={modalStyle}>
                            <div style={modalContentStyle}>
                                <span style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: isDarkMode ? 'white' : 'black' }} onClick={this.toggleAddModal}>&times;</span>
                                <h2>Add Supplier</h2>
                                <input type="text" placeholder="Company Name" style={commonStyles.inputStyle} value={newSupplier.companyName} onChange={(e) => this.handleChange('companyName', e.target.value)} />
                                {validationMessages.companyName && <div style={commonStyles.validationMessageStyle}>{validationMessages.companyName}</div>}
                                <input type="text" placeholder="Contact Number" style={commonStyles.inputStyle} value={newSupplier.contactNumber} onChange={(e) => this.handleChange('contactNumber', e.target.value)} />
                                {validationMessages.contactNumber && <div style={commonStyles.validationMessageStyle}>{validationMessages.contactNumber}</div>}
                                <input type="text" placeholder="Address" style={commonStyles.inputStyle} value={newSupplier.address} onChange={(e) => this.handleChange('address', e.target.value)} />
                                {validationMessages.address && <div style={commonStyles.validationMessageStyle}>{validationMessages.address}</div>}
                                <input type="text" placeholder="Email" style={commonStyles.inputStyle} value={newSupplier.email} onChange={(e) => this.handleChange('email', e.target.value)} />
                                {validationMessages.email && <div style={commonStyles.validationMessageStyle}>{validationMessages.email}</div>}
                                <input type="text" placeholder="Product Type" style={commonStyles.inputStyle} value={newSupplier.productType} onChange={(e) => this.handleChange('productType', e.target.value)} />
                                {validationMessages.productType && <div style={commonStyles.validationMessageStyle}>{validationMessages.productType}</div>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button onClick={this.addSupplier} style={commonStyles.buttonStyle}>Add Supplier</button>
                                    <button onClick={this.toggleAddModal} style={commonStyles.buttonStyle}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isEditModalOpen && (
                        <div style={modalStyle}>
                            <div style={modalContentStyle}>
                                <span style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: isDarkMode ? 'white' : 'black' }} onClick={() => this.toggleEditModal()}>&times;</span>
                                <h2>Edit Supplier</h2>
                                <input type="text" placeholder="Company Name" style={commonStyles.inputStyle} value={newSupplier.companyName} onChange={(e) => this.handleChange('companyName', e.target.value)} />
                                {validationMessages.companyName && <div style={commonStyles.validationMessageStyle}>{validationMessages.companyName}</div>}
                                <input type="text" placeholder="Contact Number" style={commonStyles.inputStyle} value={newSupplier.contactNumber} onChange={(e) => this.handleChange('contactNumber', e.target.value)} />
                                {validationMessages.contactNumber && <div style={commonStyles.validationMessageStyle}>{validationMessages.contactNumber}</div>}
                                <input type="text" placeholder="Address" style={commonStyles.inputStyle} value={newSupplier.address} onChange={(e) => this.handleChange('address', e.target.value)} />
                                {validationMessages.address && <div style={commonStyles.validationMessageStyle}>{validationMessages.address}</div>}
                                <input type="text" placeholder="Email" style={commonStyles.inputStyle} value={newSupplier.email} onChange={(e) => this.handleChange('email', e.target.value)} />
                                {validationMessages.email && <div style={commonStyles.validationMessageStyle}>{validationMessages.email}</div>}
                                <input type="text" placeholder="Product Type" style={commonStyles.inputStyle} value={newSupplier.productType} onChange={(e) => this.handleChange('productType', e.target.value)} />
                                {validationMessages.productType && <div style={commonStyles.validationMessageStyle}>{validationMessages.productType}</div>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                    <button onClick={this.updateSupplier} style={commonStyles.buttonStyle}>Update Supplier</button>
                                    <button onClick={() => this.toggleEditModal()} style={commonStyles.buttonStyle}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ManageSupply;
