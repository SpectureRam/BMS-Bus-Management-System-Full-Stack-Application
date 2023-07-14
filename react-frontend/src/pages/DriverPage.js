import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/driver.css';
import Sidebar from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';

const DriverPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [editDriverId, setEditDriverId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/drivers');
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
        } else {
          console.error('Failed to fetch driver data. Please try again.');
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
      licenseNumber,
      contactNumber,
    };

    try {
      let response;

      if (editDriverId) {
        // Update existing driver entry
        response = await fetch(
          `http://localhost:8080/api/drivers/${editDriverId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Add new driver entry
        response = await fetch('http://localhost:8080/api/drivers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        const updatedDriver = await response.json();
        if (editDriverId) {
          // Update the existing driver entry in the state
          const updatedDrivers = drivers.map((driver) => {
            if (driver.id === updatedDriver.id) {
              return updatedDriver;
            }
            return driver;
          });
          setDrivers(updatedDrivers);
        } else {
          // Add the new driver entry to the state
          setDrivers([...drivers, updatedDriver]);
        }

        setName('');
        setLicenseNumber('');
        setContactNumber('');
        setShowForm(false);
        setEditDriverId(null);
      } else {
        console.error('Failed to add/update driver. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFormCancel = () => {
    setName('');
    setLicenseNumber('');
    setContactNumber('');
    setShowForm(false);
    setEditDriverId(null);
  };

  const handleEditDriver = (id) => {
    const selectedDriver = drivers.find((driver) => driver.id === id);
    if (selectedDriver) {
      setName(selectedDriver.name);
      setLicenseNumber(selectedDriver.licenseNumber);
      setContactNumber(selectedDriver.contactNumber);
      setEditDriverId(id);
      setShowForm(true);
    }
  };

  const handleDeleteDriver = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/drivers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedDrivers = drivers.filter((driver) => driver.id !== id);
        setDrivers(updatedDrivers);
      } else {
        console.error('Failed to delete driver. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleGeneratePDF = () => {
    const tableElement = document.querySelector('.driver-table');

    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 10);
        pdf.save('driver_details.pdf');
      });
    }
  };

  return (
    <div className="layout">
      <Sidebar /> 
      <div className="main__layout">
        <TopNav />
        <div className="driver-container" style={{ marginTop: '5%' }}>
          <h1>Driver Details</h1>
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
                    <label className="form-field-input-data" htmlFor="name">
                      Name:
                    </label>
                    <input
                      id="driverName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </li>
                  <li className="form-item">
                    <label
                      className="form-field-input-data"
                      htmlFor="licenseNumber"
                    >
                      License Number:
                    </label>
                    <input
                      id="licenseNumber"
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </li>
                  <li className="form-item">
                    <label
                      className="form-field-input-data"
                      htmlFor="contactNumber"
                    >
                      Contact Number:
                    </label>
                    <input
                      id="contactNumber"
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </li>
                </ul>
                <div className="form-buttons">
                  <button className="submit-button" type="submit">
                    {editDriverId ? 'Update' : 'Create'}
                  </button>
                  <button
                    className="cancel-button"
                    type="button"
                    onClick={handleFormCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="search-bar">
         
            <input
              type="text"
              placeholder="Search drivers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <table className="driver-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>License Number</th>
                <th>Contact Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers
                .filter((driver) =>
                  driver.name.toLowerCase().includes(searchQuery.toLowerCase())||
                  driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())||
                  driver.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((driver) => (
                  <tr key={driver.id}>
                    <td>{driver.name}</td>
                    <td>{driver.licenseNumber}</td>
                    <td>{driver.contactNumber}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEditDriver(driver.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteDriver(driver.id)}
                      >
                        Delete
                      </button>
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

export default DriverPage;
