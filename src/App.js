import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Country from './components/Country';
import HomePage from './components/Homepage';
import State from './components/State';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/countries" element={<Country />} />
                <Route path="/states" element={<State />} />
            </Routes>
        </Router>
    );
};

export default App;
