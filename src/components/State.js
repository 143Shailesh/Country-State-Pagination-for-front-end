import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../Country.css';

const State = () => {
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [currentStatePage, setCurrentStatePage] = useState(0);
    const [statePageSize, setStatePageSize] = useState(10);
    const [stateTotalPages, setStateTotalPages] = useState(0);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        fetchStates(currentStatePage);
        fetchCountries();
    }, [currentStatePage, statePageSize]);

    const fetchStates = (page) => {
        axios.get(`http://localhost:8080/states?page=${page}&size=${statePageSize}`)
            .then(response => {
                setStates(response.data.content || []);
                setStateTotalPages(response.data.totalPages);
            })
            .catch(error => {
                console.error('Error fetching states:', error.message);
            });
    };

    const fetchCountries = () => {
        axios.get('http://localhost:8080/countries')
            .then(response => {
                setCountries(response.data.content || []);
            })
            .catch(error => {
                console.error('Error fetching countries:', error.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const state = {
            name,
            country: selectedCountry,
        };

        if (editId) {
            axios.put(`http://localhost:8080/states/${editId}`, state)
                .then(() => {
                    fetchStates(currentStatePage);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error updating the state!', error);
                });

        } else {
            axios.post('http://localhost:8080/states', state)
                .then(() => {
                    fetchStates(currentStatePage);
                    resetForm();
                })
                .catch(error => {
                    console.error('Error creating the state!', error);
                });
        }
    };

    const resetForm = () => {
        setEditId(null);
        setName('');
        setSelectedCountry('');
        setSelectedState(null);
    };

    const handleEdit = (state) => {
        setEditId(state.id);
        setName(state.name);
        setSelectedCountry(state.country);
    };

    const handleView = (state) => {
        setSelectedState(state);
    };

    const handleDelete = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this state?");
        if (isConfirmed) {
            axios.delete(`http://localhost:8080/states/${id}`)
                .then(() => {
                    fetchStates(currentStatePage);
                })
                .catch(error => {
                    console.error('Error deleting the state!', error);
                });
        }
    };

    const handleStatePagination = (direction) => {
        if (direction === 'prev' && currentStatePage > 0) {
            setCurrentStatePage(currentStatePage - 1);
        } else if (direction === 'next' && currentStatePage < stateTotalPages - 1) {
            setCurrentStatePage(currentStatePage + 1);
        }
    };

    return (
        <>
            <div className="container">
                <h1>States Management</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Name: </label>
                        <input
                            type="text"
                            placeholder="Enter the State Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="country">Country:</label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            required
                        >
                            <option value="">Select Country</option>
                            {Array.isArray(countries) && countries.map(country => (
                                <option key={country.id} value={country.name}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit">{editId ? 'Update State' : 'Add State'}</button>
                    <button type="button" onClick={resetForm}>Reset</button>
                </form>
            </div>

            <div className='tableData'>
                <h1>State Lists</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {states.map(state => (
                            <tr key={state.id}>
                                <td>{state.name}</td>
                                <td>{state.country}</td>
                                <td>
                                    <button onClick={() => handleEdit(state)}>Edit</button>
                                    <button onClick={() => handleView(state)}>View</button>
                                    <button onClick={() => handleDelete(state.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button disabled={currentStatePage === 0} onClick={() => handleStatePagination('prev')}>Previous</button>
                    <span>Page {currentStatePage + 1} of {stateTotalPages}</span>
                    <button disabled={currentStatePage === stateTotalPages - 1} onClick={() => handleStatePagination('next')}>Next</button>
                    <label>
                        Page Size:
                        <select value={statePageSize} onChange={(e) => setStatePageSize(Number(e.target.value))}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </label>
                </div>
            </div>

            {selectedState && (
                <div className="state-details">
                    <h2>State Details</h2>
                    <p><strong>Name:</strong> {selectedState.name}</p>
                    <p><strong>Country:</strong> {selectedState.country}</p>
                    <button onClick={resetForm}>Close</button>
                </div>
            )}
        </>
    );
};

export default State;
