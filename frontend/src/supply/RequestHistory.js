import React, { Component } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import swal from 'sweetalert';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 

class RequestHistory extends Component {
    state = {
        isDarkMode: false,
        isSidebarOpen: false,
        requests: [],
        isModalOpen: false,
        editedRequest: {},
        flashMessage: '',
        flashMessageType: '',
        validationMessages: {
            supply: '',
            qty: ''
        },
        companyNames: [],
        searchQuery: '', 
        filteredSupply: [],
    };

    componentDidMount() {
        this.fetchRequests();
        this.fetchCompanyNames();
    }

    fetchCompanyNames = async () => {
        try {
            const response = await axios.get('http://localhost:5555/suppliers');
            const companyNames = response.data.data.map(supplier => supplier.companyName);
            this.setState({ companyNames });
        } catch (error) {
            console.error("Couldn't fetch company names", error);
        }
    };

    fetchRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5555/supply-requests');
            this.setState({ requests: response.data.data, filteredSupply: response.data.data });
        } catch (error) {
            console.error("Couldn't fetch requests", error);
            this.setFlashMessage('Failed to fetch requests', 'error');
        }
    };

    handleSearch = (e) => {
        const { value } = e.target;
        const { requests } = this.state; 
        
        const filteredSupply = requests.filter(request =>
            request.supplierName.toLowerCase().includes(value.toLowerCase()) ||
             request.status.toLowerCase().includes(value.toLowerCase()) ||
             request.status.toLowerCase().includes(value.toLowerCase())
        );
        
        this.setState({ searchQuery: value, filteredSupply });
    };

    toggleDarkMode = () => {
        this.setState(prevState => ({
            isDarkMode: !prevState.isDarkMode,
        }));
    };

    toggleSidebar = () => {
        this.setState(prevState => ({
            isSidebarOpen: !prevState.isSidebarOpen,
        }));
    };

    openModal = (request) => {
        this.setState({
            isModalOpen: true,
            editedRequest: request,
            validationMessages: {
                supply: '',
                qty: ''
            }
        });
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
            editedRequest: {},
            flashMessage: '',
            flashMessageType: '',
            validationMessages: {
                supply: '',
                qty: ''
            }
        });
    };

    handleUpdateRequest = async (id) => {
        if (this.validateForm()) {
            const { editedRequest } = this.state;
            try {
                await axios.put(`http://localhost:5555/supply-requests/${id}`, editedRequest);
                this.fetchRequests();
                this.setFlashMessage('Request updated successfully', 'success');
                swal("Success!", "Request updated successfully.", "success");
            } catch (error) {
                console.error("Couldn't update request", error);
                this.setFlashMessage('Failed to update request', 'error');
            } finally {
                this.closeModal();
            }
        }
    };

    handleDeleteRequest = async (id) => {
        try {
            await axios.delete(`http://localhost:5555/supply-requests/${id}`);
            this.fetchRequests();
            swal("Deleted!", "Your request has been deleted successfully.", "success");
        } catch (error) {
            console.error("Couldn't delete request", error);
            swal("Failed!", "There was a problem deleting your request.", "error");
        }
    };

    handleChange = (e, key) => {
        this.setState({
            editedRequest: {
                ...this.state.editedRequest,
                [key]: e.target.value,
            }
        }, () => this.validateField(key, e.target.value));
    };



    validateField = (fieldName, value) => {
        let message = '';

        switch (fieldName) {
            case 'supply':
                message = value.trim().length === 0 ? 'Supply is required' : '';
                break;
            case 'qty':
                message = value.trim().length === 0 ? 'Quantity is required' : (!/^\d+$/.test(value) ? 'Quantity must be a valid number' : '');
                break;
            default:
                break;
        }

        this.setState(prevState => ({
            validationMessages: {
                ...prevState.validationMessages,
                [fieldName]: message,
            }
        }));

        return message === '';
    };



    handlePDFGeneration = () => {
        const { requests } = this.state;
        if (requests.length > 0) {
            const pdf = new jsPDF();
            pdf.setFontSize(18);
            pdf.setTextColor(40);
            pdf.text('Request History', 105, 15, null, null, 'center');
    
            const tableColumn = ['Company Name', 'Supply', 'Quantity', 'Request Date', 'Status'];
            const tableRows = requests.map(request => [
                request.supplierName,
                request.supply,
                request.qty.toString(),
                request.requestDate,
                request.status
            ]);
    
            pdf.autoTable(tableColumn, tableRows, { startY: 20 });
            pdf.save('request_history.pdf');
        } else {
            swal("No Requests", "There are no requests to generate a PDF.", "info");
        }
    };


    validateForm = () => {
        const { supply, qty } = this.state.editedRequest;
        const fields = ['supply', 'qty'];
        const validations = fields.map(field => this.validateField(field, this.state.editedRequest[field]));

        return validations.every(validation => validation);
    };
    setFlashMessage = (message, type) => {
        this.setState({
            flashMessage: message,
            flashMessageType: type,
        }, () => {
            setTimeout(() => {
                this.setState({ flashMessage: '', flashMessageType: '' });
            }, 3000);
        });
    };
    getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'blue';
            case 'accepted':
                return '#3cb371';
            case 'rejected':
                return 'red';
            default:
                return 'inherit';
        }
    };
    render() {
        const { isDarkMode, isSidebarOpen, requests, isModalOpen, editedRequest, flashMessage, flashMessageType, validationMessages, companyNames } = this.state;

        const modalStyle = {
            display: isModalOpen ? 'flex' : 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        };

        const modalContentStyle = {
            position: 'relative',
            backgroundColor: isDarkMode ? '#252525' : 'white',
            color: isDarkMode ? 'white' : 'black',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            width: '400px',
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
                {flashMessage && (
                    <div style={{ backgroundColor: flashMessageType === 'success' ? '#4CAF50' : '#F44336', color: '#fff', textAlign: 'center', padding: '10px', position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, }}>
                        {flashMessage}
                    </div>
                )}
                    <button onClick={this.handlePDFGeneration} style={{ ...commonStyles.buttonStyle2, background: '#009688' }}>
                        Generate PDF
                    </button>
                <div className="request-history-container" style={{ marginLeft: isSidebarOpen ? '260px' : '90px', transition: 'margin-left 0.3s' }}>
                    <div style={{ margin: '20px', marginTop: '1%', padding: '20px', background: isDarkMode ? '#252525' : '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px',backgroundColor:'#FAFAFA' }}>
                    <input
                            type="text"
                            placeholder="Search by Company Name"
                            style={{ ...commonStyles.inputStyle, marginBottom: '10px' }}
                            value={this.state.searchQuery}
                            onChange={this.handleSearch}
                        />
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th style={{ background: isDarkMode ? '#555' : '#ddd', color: isDarkMode ? '#fff' : '#333', padding: '12px 15px', textAlign: 'left' }}>Company Name</th>
                                    <th style={{ background: isDarkMode ? '#555' : '#ddd', color: isDarkMode ? '#fff' : '#333', padding: '12px 15px', textAlign: 'left' }}>Supply</th>
                                    <th style={{ background: isDarkMode ? '#555' : '#ddd', color: isDarkMode ? '#fff' : '#333', padding: '12px 15px', textAlign: 'left' }}>Quantity</th>
                                    <th style={{ background: isDarkMode ? '#555' : '#ddd', color: isDarkMode ? '#fff' : '#333', padding: '12px 15px', textAlign: 'left' }}>Request Date</th>
                                    <th style={{ background: isDarkMode ? '#555' : '#ddd', color: isDarkMode ? '#fff' : '#333', padding: '12px 15px', textAlign: 'left' }}>Status</th>
                                    <th style={{ background: isDarkMode ? '#555' : '#ddd', color: isDarkMode ? '#fff' : '#333', padding: '12px 15px', textAlign: 'left' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.filteredSupply.map(request => (
                                    <tr key={request._id}>
                                        <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', color: isDarkMode ? '#fff' : '#333', textAlign: 'left' }}>{request.supplierName}</td>
                                        <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', color: isDarkMode ? '#fff' : '#333', textAlign: 'left' }}>{request.supply}</td>
                                        <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', color: isDarkMode ? '#fff' : '#333', textAlign: 'left' }}>{request.qty}</td>
                                        <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', color: isDarkMode ? '#fff' : '#333', textAlign: 'left' }}>{request.requestDate}</td>
                                        <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', color: isDarkMode ? '#fff' : '#333', textAlign: 'left' }}>
                                            <span style={{ color: this.getStatusColor(request.status), textTransform: 'capitalize' }}>{request.status}</span>
                                        </td>
                                        <td style={{ padding: '12px 15px', borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                                            {request.status === 'pending' && (
                                                <>
                                                    <FaEdit onClick={() => this.openModal(request)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                                    <FaTrashAlt onClick={() => {
                                                        swal({
                                                            title: "Are you sure?",
                                                            text: "Once deleted, you will not be able to recover this request!",
                                                            icon: "warning",
                                                            buttons: true,
                                                            dangerMode: true,
                                                        })
                                                            .then((willDelete) => {
                                                                if (willDelete) {
                                                                    this.handleDeleteRequest(request._id);
                                                                } else {
                                                                    swal("Your request is safe!");
                                                                }
                                                            });
                                                    }} style={{ cursor: 'pointer' }} />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal" style={modalStyle} onClick={this.closeModal}>
                    <div className="modal-content" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Request</h2>
                        {flashMessage && flashMessageType === 'error' && <div style={{ color: 'red' }}>{flashMessage}</div>}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            this.handleUpdateRequest(editedRequest._id);
                        }}>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Supplier Name:</label>
                            <select
                                value={editedRequest.supplierName || ''}
                                onChange={(e) => this.handleChange(e, 'supplierName')}
                                style={commonStyles.inputStyle}
                            >
                                <option value="">Select Company</option>
                                {companyNames.map((name, index) => (
                                    <option key={index} value={name}>{name}</option>
                                ))}
                            </select>
                            <label style={{ marginBottom: '10px', display: 'block' }}>Supply:</label>
                            <input
                                type="text"
                                value={editedRequest.supply || ''}
                                onChange={(e) => this.handleChange(e, 'supply')}
                                style={commonStyles.inputStyle}
                            />
                            {validationMessages.supply && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{validationMessages.supply}</div>}
                            <label style={{ marginBottom: '10px', display: 'block' }}>Quantity:</label>
                            <input
                                type="text"
                                value={editedRequest.qty || ''}
                                onChange={(e) => this.handleChange(e, 'qty')}
                                style={commonStyles.inputStyle}
                            />
                            {validationMessages.qty && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{validationMessages.qty}</div>}
                            <button type="submit" style={{ ...commonStyles.buttonStyle, background: '#009688', margin: '10px 0' }}>Update</button>
                            <button type="button" onClick={this.closeModal} style={{ ...commonStyles.buttonStyle3, background: '#285955', margin: '15px 10px' }}>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
const commonStyles = {
    inputStyle: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        marginBottom: '10px',
        boxSizing: 'border-box',
    },
    buttonStyle: {
        padding: '12px 55px',
        borderRadius: '5px',
        fontSize: '16px',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
    },

    buttonStyle2: {
        padding: '8px 10px',
        borderRadius: '5px',
        fontSize: '14px',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        marginTop: '5%',
        width: '10%',
        marginLeft: '85%'
    },

    buttonStyle3: {
        padding: '12px 55px',
        borderRadius: '5px',
        fontSize: '16px',
        border: 'none',
        color: '#fff',
        backgroundColor:'#285955',
        cursor: 'pointer',
    },
    
};

export default RequestHistory;
