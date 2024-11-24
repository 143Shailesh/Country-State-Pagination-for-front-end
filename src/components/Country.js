import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../Country.css';

const Country = () => {
    const [countries, setCountries] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [viewCountry, setViewCountry] = useState(null);

    useEffect(() => {
        fetchCountries(currentPage);
    }, [currentPage, pageSize]);

    const fetchCountries = (page) => {
        axios.get(`http://localhost:8080/countries?page=${page}&size=${pageSize}`)
            .then((response) => {
                const data = response.data.content || [];
                setCountries(data);
                setTotalPages(response.data.totalPages);
            })
            .catch((error) => {
                setError('Error fetching countries');
                console.error(error);
            });
    };

    const handlePagination = (direction) => {
        if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const resetForm = () => {
        setEditId(null);
        setName('');
        setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const country = { id: editId, name };

        const request = editId
            ? axios.put(`http://localhost:8080/countries/${editId}`, country)
            : axios.post('http://localhost:8080/countries', country);

        request
            .then(() => {
                fetchCountries(currentPage);
                resetForm();
            })
            .catch((error) => {
                setError('Error submitting country');
                console.error(error);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this country?')) {
            axios.delete(`http://localhost:8080/countries/${id}`)
                .then(() => fetchCountries(currentPage))
                .catch((error) => {
                    setError('Error deleting country');
                    console.error(error);
                });
        }
    };

    const handleView = (country) => {
        setViewCountry(country);
    };

    const closeView = () => {
        setViewCountry(null);
    };

    return (
        <div className="container">
            <h1>Countries Management</h1>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit">{editId ? 'Update' : 'Add Countries'}</button>
                <button type="button" onClick={resetForm}>Reset</button>
            </form>

            <h2>Country List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(countries) && countries.map((country) => (
                        <tr key={country.id}>
                            <td>{country.name}</td>
                            <td>
                                <button onClick={() => { setEditId(country.id); setName(country.name); }}>Edit</button>
                                <button onClick={() => handleDelete(country.id)}>Delete</button>
                                <button onClick={() => handleView(country)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button disabled={currentPage === 0} onClick={() => handlePagination('prev')}>Previous</button>
                <span>Page {currentPage + 1} of {totalPages}</span>
                <button disabled={currentPage === totalPages - 1} onClick={() => handlePagination('next')}>Next</button>
                <label>
                    Page Size: 
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </label>
            </div>

        
            {viewCountry && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeView}>&times;</span>
                        <h2>{viewCountry.name}</h2>
                        <p>Country ID: {viewCountry.id}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Country;
