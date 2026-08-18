import React from 'react';
import './WelcomePage.css';

function WelcomePage({ title, content }) {
    return (
        <div className="welcome-container">
            <span className="welcome-emoji">🛵</span>
            <h1 className="welcome-title">{title}</h1>
            <p className="welcome-text">{content}</p>
        </div>
    );
}

export default WelcomePage;