import React, { Component } from 'react';
import logoImage from '../images/p.jpg';

class Sidebar extends Component {
    render() {
        const { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode,
         } = this.props;
        return (
            <nav className={`sidebar ${isSidebarOpen ? "" : "close"}`}>
                <header>
                    <div className="image-text">
                        <span className="image">
                        <img src={logoImage} alt="Profile" style={{ marginLeft: '-25%' }} />
                           
                        </span>
                        <div className="text logo-text">
                            <span className="name" style={{ marginLeft: '-10%' }}>P&D Auto Engineers</span>
                            <span className="profession" style={{ marginLeft: '-44%' }}>Private Limited</span>
                        </div>
                    </div>
                    <i className='fas fa-arrow-right toggle' style={{ fontSize: '90%' }} onClick={toggleSidebar}></i> 
                </header>
                <div className="menu-bar">
                    <div className="menu">
                        <ul className="menu-links">
                          
                            <li className="nav-link">
                                <a href="#">
                                    <i className='fas fa-car icon'></i> 
                                    <span className="text nav-text">Supplies</span>
                                </a>
                                </li>

                                <li className="nav-link">
                                 <a href="#">
                                     <i className='fas fa-users icon'></i> 
                                     <span className="text nav-text">Employees</span>
                              </a>
                                </li>
                                 <li className="nav-link">
                                     <a href="#">
                                         <i className='fas fa-shop icon'></i> 
                                         <span className="text nav-text">Online Shop</span>
                                    </a>
                                </li>
                                 <li className="nav-link">
                                     <a href="#">
                                         <i className='fas fa-exclamation-triangle icon'></i> 
                                         <span className="text nav-text">Issues</span>
                                    </a>
                                </li>
                                <li className="nav-link">
                                    <a href="#">
                                         <i className='fas fa-calendar icon'></i> 
                                         <span className="text nav-text">Service & Appointment</span>
                                     </a>
                                 </li>
                                 <li className="nav-link">
                                     <a href="#">
                                         <i className='fas fa-archive icon'></i> 
                                         <span className="text nav-text">Inventories</span>
                                     </a>
                                 </li>
                                 <li className="nav-link">
                                     <a href="#">
                                         <i className='fas fa-handshake icon'></i> 
                                         <span className="text nav-text">Customers</span>
                                     </a>
                                 </li>
                                 <li className="nav-link">
                                     <a href="#">
                                         <i className='fas fa-credit-card icon'></i> 
                                        <span className="text nav-text">Payments</span>
                                    </a>
                                 </li>
                            
                        </ul>
                    </div>
                    {/* <div className="bottom-content">
                        <li className="mode">
                            <div className="sun-moon">
                                <i className='fas fa-moon icon moon'></i> 
                                <i className='fas fa-sun icon sun'></i> 
                            </div>
                            <span className="mode-text text" onClick={toggleDarkMode}>{isDarkMode ? "Light mode" : "Dark mode"}</span>
                            <div className="toggle-switch" onClick={toggleDarkMode}>
                                <span className={`switch ${isDarkMode ? 'dark' : ''}`}></span>
                            </div>
                        </li>
                    </div> */}
                </div>
            </nav>
        );
    }
}

export default Sidebar;

