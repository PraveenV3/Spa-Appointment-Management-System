import React from 'react';

const modal = ({ children, toggleModal }) => {
    const modalBackgroundStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const modalContentStyle = {
        backgroundColor: '#fefefe',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    };

    const closeBtnStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        fontSize: '20px'
    };

    return (
        <div style={modalBackgroundStyle}>
            <div style={modalContentStyle}>
                <span style={closeBtnStyle} onClick={toggleModal}>&times;</span>
                {children}
            </div>
        </div>
    );
}

export default modal;
