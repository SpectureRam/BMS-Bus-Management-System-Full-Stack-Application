import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "../styles/bus.css"
import Sidebar from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';

const BusPage = () => {
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [busNumber, setBusNumber] = useState('');
  const [busName, setBusName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [editBusId, setEditBusId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/buses');
        if (response.ok) {
          const data = await response.json();
          setBuses(data);
        } else {
          console.error('Failed to fetch bus data. Please try again.');
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
      busNumber,
      busName,
      capacity,
      make,
      model,
    };

    try {
      let response;

      if (editBusId) {
        response = await fetch(`http://localhost:8080/api/buses/${editBusId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch('http://localhost:8080/api/buses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        const updatedBus = await response.json();
        if (editBusId) {
          const updatedBuses = buses.map((bus) => {
            if (bus.id === updatedBus.id) {
              return updatedBus;
            }
            return bus;
          });
          setBuses(updatedBuses);
        } else {
          setBuses([...buses, updatedBus]);
        }

        setBusNumber('');
        setBusName('');
        setCapacity('');
        setMake('');
        setModel('');
        setShowForm(false);
        setEditBusId(null);
        setSearchQuery('');
      } else {
        console.error('Failed to add/update bus. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFormCancel = () => {
    setBusNumber('');
    setBusName('');
    setCapacity('');
    setMake('');
    setModel('');
    setShowForm(false);
    setEditBusId(null);
    setSearchQuery('');
  };

  const handleEditBus = (id) => {
    const selectedBus = buses.find((bus) => bus.id === id);
    if (selectedBus) {
      setBusNumber(selectedBus.busNumber);
      setBusName(selectedBus.busName);
      setCapacity(selectedBus.capacity);
      setMake(selectedBus.make);
      setModel(selectedBus.model);
      setEditBusId(id);
      setShowForm(true);
    }
  };

  const handleDeleteBus = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/buses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedBuses = buses.filter((bus) => bus.id !== id);
        setBuses(updatedBuses);
      } else {
        console.error('Failed to delete bus. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleGeneratePDF = () => {
    const tableElement = document.querySelector('.bus-table');
  
    if (tableElement) {
      const actionBarElement = tableElement.querySelector('.action-bar');
      if (actionBarElement) {
        actionBarElement.style.display = 'none';
      }
  
      html2canvas(tableElement).then((canvas) => {
        if (actionBarElement) {
          actionBarElement.style.display = 'block';
        }
  
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 10);
        pdf.save('bus_details.pdf');
      });
    }
  };
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBuses = buses.filter((bus) => {
    const searchFields = [bus.busNumber, bus.busName, bus.model];
    return searchFields.some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="layout">
      <Sidebar />
      <div className="main__layout">
        <TopNav />
        <div className="bus-container" style={{ marginTop: '5%' }}>
          <h1>Bus Details</h1>
          <div className="buttons-to-add">
            <button className="add-button" onClick={() => setShowForm(true)}>
              Add Driver
            </button>
            <button
              className="generate-pdf-button"
              onClick={handleGeneratePDF}
            >
              Generate PDF
            </button>
          </div>

          {showForm && (
            <div className="add-form">
              <form onSubmit={handleFormSubmit}>
                <ul className="form-list">
                  <li className="form-item">
                    <label className='form-field-input-data' htmlFor="busNumber">Bus Number:</label>
                    <input
                      id="busNumber"
                      type="text"
                      value={busNumber}
                      onChange={(e) => setBusNumber(e.target.value)}
                    />
                  </li>
                  <li className="form-item">
                    <label className='form-field-input-data' htmlFor="busName">Bus Name:</label>
                    <input
                      id="busName"
                      type="text"
                      value={busName}
                      onChange={(e) => setBusName(e.target.value)}
                    />
                  </li>
                  <li className="form-item">
                    <label className='form-field-input-data' htmlFor="capacity">Capacity:</label>
                    <input
                      id="capacity"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                    />
                  </li>
                  <li className="form-item">
                    <label className='form-field-input-data' htmlFor="make">Make:</label>
                    <input
                      id="make"
                      type="text"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                    />
                  </li>
                  <li className="form-item">
                    <label className='form-field-input-data' htmlFor="model">Model:</label>
                    <input
                      id="model"
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    />
                  </li>
                </ul>
                <div className="form-buttons">
                <button className="submit-button" type="submit">
                {editBusId ? 'Update' : 'Submit'}
              </button>
              <button className="cancel-button" type="button" onClick={handleFormCancel}>
                Cancel
              </button>
                </div>
              </form>
            </div>
          )}

          <div className="search-container">
            <input
              type="text"
              placeholder="Search buses"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {filteredBuses.length > 0 ? (
            <table className="bus-table">
              <thead>
                <tr>
                  <th>Bus Number</th>
                  <th>Bus Name</th>
                  <th>Capacity</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map((bus) => (
                  <tr key={bus.id}>
                    <td>{bus.busNumber}</td>
                    <td>{bus.busName}</td>
                    <td>{bus.capacity}</td>
                    <td>{bus.make}</td>
                    <td>{bus.model}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEditBus(bus.id)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteBus(bus.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No buses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusPage;
