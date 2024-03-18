import React from 'react';
import profileImage from '../images/profile.jpg';


const Header = ({ isDarkMode }) => {
    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px', 
        backgroundColor: isDarkMode ? '#242526' : '#FFF', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
        transition: 'background-color 0.3s ease',
        fontFamily: "'Poppins', sans-serif", 
    };

    const userActionsStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const userAccountStyle = {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
    };

    const usernameStyle = {
        marginLeft: '8px',
        color: isDarkMode ? '#E4E9F7' : '#695CFE', 
        fontWeight: '500', 
    };

    const logoutStyle = {
        cursor: 'pointer',
        marginLeft: '20px',
        color: isDarkMode ? '#E4E9F7' : '#695CFE',
    };

    const profileImageStyle = {
        width: '30px', 
        height: '30px', 
        borderRadius: '50%', 
        objectFit: 'cover', 
    };

    return (
        <header style={headerStyle}>
        
            <div style={{ fontSize: '24px', color: isDarkMode ? '#FFF' : '#695CFE', fontWeight: '600' }}>
              
            </div>
            <div style={userActionsStyle}>
                <div style={userAccountStyle}>
                
                <img src={profileImage} alt="Profile" style={profileImageStyle} />
                    <span style={usernameStyle}>Anna White</span>
                </div>
                <div style={logoutStyle}>
           
                </div>
            </div>
        </header>
    );
};

export default Header;
