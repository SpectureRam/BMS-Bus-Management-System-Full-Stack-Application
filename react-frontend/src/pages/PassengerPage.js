import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "../styles/passenger.css";
import Sidebar from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';

const PassengerPage = () => {
  const [passengers, setPassengers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [editPassengerId, setEditPassengerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/passengers');
        if (response.ok) {
          const data = await response.json();
          setPassengers(data);
        } else {
          console.error('Failed to fetch passenger data. Please try again.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name,
      contactNumber,
    };

    try {
      let response;

      if (editPassengerId) {
        // Update existing passenger entry
        response = await fetch(`http://localhost:8080/api/passengers/${editPassengerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new passenger entry
        response = await fetch('http://localhost:8080/api/passengers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        const updatedPassenger = await response.json();
        if (editPassengerId) {
          // Update the existing passenger entry in the state
          const updatedPassengers = passengers.map((passenger) => {
            if (passenger.id === updatedPassenger.id) {
              return updatedPassenger;
            }
            return passenger;
          });
          setPassengers(updatedPassengers);
        } else {
          // Add the new passenger entry to the state
          setPassengers([...passengers, updatedPassenger]);
        }

        setName('');
        setContactNumber('');
        setShowForm(false);
        setEditPassengerId(null);
      } else {
        console.error('Failed to add/update passenger. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFormCancel = () => {
    setName('');
    setContactNumber('');
    setShowForm(false);
    setEditPassengerId(null);
  };

  const handleEditPassenger = (id) => {
    const selectedPassenger = passengers.find((passenger) => passenger.id === id);
    if (selectedPassenger) {
      setName(selectedPassenger.name);
      setContactNumber(selectedPassenger.contactNumber);
      setEditPassengerId(id);
      setShowForm(true);
    }
  };

  const handleDeletePassenger = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/passengers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedPassengers = passengers.filter((passenger) => passenger.id !== id);
        setPassengers(updatedPassengers);
      } else {
        console.error('Failed to delete passenger. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleGeneratePDF = () => {
    const tableElement = document.querySelector('.passenger-table');

    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 10);
        pdf.save('passenger_details.pdf');
      });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPassengers = passengers.filter((passenger) =>
    passenger.name.toLowerCase().includes(searchQuery.toLowerCase())||
    passenger.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main__layout">
        <TopNav />
        <div className="passenger-container" style={{ marginTop: '5%' }}>
          <h1>Passenger Details</h1>
          <div className='buttons-to-add'>
            <button className="add-button" onClick={() => setShowForm(true)}>Add Passenger</button>
            <button className="generate-pdf-button" onClick={handleGeneratePDF}>Generate PDF</button>
          </div>

          {showForm && (
            <div className="add-form">
              <form onSubmit={handleFormSubmit}>
                <ul className="form-list">
                  <li className="form-item">
                    <label className='form-field-input-data' htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="passengerName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </li>
                  <li className="form-item">
                    <label className='form-field-input-data' htmlFor="contactNumber">Contact Number:</label>
                    <input
                      type="text"
                      id="contactNumber"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </li>
                </ul>
                <div className="form-buttons">
                  <button className="submit-button" type="submit">{editPassengerId ? 'Update' : 'Add'}</button>
                  <button className="cancel-button" type="button" onClick={handleFormCancel}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <table className="passenger-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPassengers.map((passenger) => (
                <tr key={passenger.id}>
                  <td>{passenger.name}</td>
                  <td>{passenger.contactNumber}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditPassenger(passenger.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeletePassenger(passenger.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PassengerPage;
