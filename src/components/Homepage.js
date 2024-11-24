import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
    return (
        <div className="homepage-container">
            <h1>Welcome to the Management Portal</h1>
            <div className="navigation-links">
                <Link to="/countries" className="nav-link">
                    Manage Countries
                </Link>
                <Link to="/states" className="nav-link">
                    Manage States
                </Link>
            </div>
        </div>
    );
};

export default Homepage;