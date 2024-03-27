import React, { Component } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import swal from 'sweetalert';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import '../styles/style.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

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
            },
            searchQuery: '', 
            filteredSuppliers: [],
        };
    }

    componentDidMount() {
        this.fetchSuppliers();
    }

    fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:5555/suppliers');
            this.setState({ suppliers: response.data.data, filteredSuppliers: response.data.data });
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

    handlePDFGeneration = async () => {
        try {
            const response = await axios.get('http://localhost:5555/suppliers');
            const suppliers = response.data.data;
    
            if (suppliers.length > 0) {
                const pdf = new jsPDF();
                
                pdf.setFontSize(24);
                pdf.setTextColor(44, 62, 80);
                pdf.text('Supplier List', 105, 20, null, null, 'center');
    
                const tableHeaders = ['Company Name', 'Contact Number', 'Address', 'Email', 'Product Type'];
    

                const tableData = suppliers.map(supplier => [
                    supplier.companyName,
                    supplier.contactNumber,
                    supplier.address,
                    supplier.email,
                    supplier.productType
                ]);
    
                // Set up table styling
                const tableStyle = {
                    margin: { top: 40 },
                    headStyles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 12 },
                    bodyStyles: { textColor: 44, fontSize: 10 },
                    alternateRowStyles: { fillColor: 245 },
                    startY: 30
                };
    
                // Add table to PDF
                pdf.autoTable(tableHeaders, tableData, tableStyle);
    
                // Save the PDF with title and download it
                pdf.save('Suppliers_List.pdf');
            } else {
                console.error('No suppliers found.');
                swal("No Suppliers", "There are no suppliers to generate a PDF.", "info");
            }
        } catch (error) {
            console.error("Couldn't fetch suppliers", error);
            swal("Error", "There was a problem fetching suppliers.", "error");
        }
    };

    handleSearch = (e) => {
        const { value } = e.target;
        const { suppliers } = this.state; // Corrected typo here
        
        // Filter suppliers based on company name or product type
        const filteredSuppliers = suppliers.filter(supplier =>
            supplier.companyName.toLowerCase().includes(value.toLowerCase()) ||
            supplier.productType.toLowerCase().includes(value.toLowerCase())
        );
    
        this.setState({ searchQuery: value, filteredSuppliers }); // Updated state key to 'filteredSuppliers'
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
            marginLeft: isSidebarOpen ? '90px' : '80px',
            width: isSidebarOpen ? 'calc(100% - 150px)' : '85%' 
        };

        const commonStyles = {
            cardStyle: {
                display: 'absolute',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '20px',
                marginTop: '1%',
                backgroundColor: isDarkMode ? '#333' : '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                padding: '20px',
                fontFamily: 'sans-serif',
                position: 'relative',
                ...cardStyleAdjustment,
                transition: 'all 0.3s',
                marginLeft: 'var(--sidebar-width, 80px)',
                width: 'calc(100% - var(--sidebar-width, 80px) - 20px)', 
            },

            tableStyle: {
                width: '97%', borderCollapse: 'collapse', marginTop: '2px',

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
                width: '80%',
                 padding: '2%',
                  marginRight: '10px',
                   marginTop: '10px',
                    borderRadius: '5px',
                     border: 'none',
                      backgroundColor: '#009688',
                       color: '#fff', cursor: 'pointer', fontSize: '16px', textDecoration: 'none'
            },
            buttonStyle4: {
                width: '80%',
                 padding: '2%',
                  marginRight: '10px',
                   marginTop: '10px',
                    borderRadius: '5px',
                     border: 'none',
                      backgroundColor: '#285955',
                       color: '#fff', cursor: 'pointer', fontSize: '16px', textDecoration: 'none'
            },
            validationMessageStyle: {
                color: '#ff3860', fontSize: '0.8rem', marginTop: '0.25rem',
            },
            buttonStyle2: {
                padding: '8px 10px',
                borderRadius: '5px',
                fontSize: '14px',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                marginTop: '20px',
                width: '10%',
                marginLeft: '85%'
            },
            buttonStyle3: {
                padding: '8px 10px',
                borderRadius: '5px',
                fontSize: '14px',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                marginTop: '10px',
                marginBottom: '1%',
                width: '10%',
                marginLeft: '85%'
            }
        };
        

        return (
            
            <div className={`container ${isDarkMode ? "dark" : ""}`}  style={{ marginTop: '4%' }}>
                <Header isDarkMode={isDarkMode} />
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={this.toggleSidebar}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={this.toggleDarkMode}
                />
                        <button onClick={this.handlePDFGeneration} style={{ ...commonStyles.buttonStyle2, background: '#009688' }}>
                            Generate PDF
                        </button>

                     
                        <button onClick={this.toggleAddModal}  style={{ ...commonStyles.buttonStyle3, background: '#009688'}}>
                            <FaPlus style={{ marginRight: '8px' }} />
                            Add Suppliers
                        </button>
                      
                
                <div className="home">
                    <div style={commonStyles.cardStyle}>
                    <input
                            type="text"
                            placeholder="Search by Company Name or Product Type"
                            style={{ ...commonStyles.inputStyle, marginBottom: '10px' }}
                            value={this.state.searchQuery}
                            onChange={this.handleSearch}
                        />
                        
                        <table id="suppliers-table" style={commonStyles.tableStyle}>
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
                                {this.state.filteredSuppliers.map(supplier => (
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
                                    <button onClick={this.toggleAddModal} style={commonStyles.buttonStyle4}>Cancel</button>
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
                                    <button onClick={() => this.toggleEditModal()} style={commonStyles.buttonStyle4}>Cancel</button>
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
