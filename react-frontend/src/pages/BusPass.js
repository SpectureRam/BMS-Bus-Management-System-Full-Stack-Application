import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';
import '../styles/buspass.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BusPassPage = () => {
  const [busPasses, setBusPasses] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [passengerId, setPassengerId] = useState('');
  const [passType, setPassType] = useState('');
  const [validityStart, setValidityStart] = useState('');
  const [validityEnd, setValidityEnd] = useState('');
  const [active, setActive] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPassId, setEditingPassId] = useState(null);

  useEffect(() => {
    fetchBusPasses();
    fetchPassengers();
  }, []);

  const fetchBusPasses = async () => {
    try {
      const response = await fetch('http://localhost:8080/buspass');
      if (response.ok) {
        const data = await response.json();
        setBusPasses(data);
      } else {
        console.error('Failed to fetch bus passes. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const fetchPassengers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/passengers');
      if (response.ok) {
        const data = await response.json();
        setPassengers(data);
      } else {
        console.error('Failed to fetch passengers. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      passenger: {
        id: passengerId,
      },
      passType,
      validityStart,
      validityEnd,
      active,
    };

    try {
      if (editingPassId) {
        const response = await fetch(`http://localhost:8080/buspass/${editingPassId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          fetchBusPasses();
          setEditingPassId(null);
        } else {
          console.error('Failed to update bus pass. Please try again.');
        }
      } else {
        const response = await fetch('http://localhost:8080/buspass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          fetchBusPasses();
        } else {
          console.error('Failed to add bus pass. Please try again.');
        }
      }

      setPassengerId('');
      setPassType('');
      setValidityStart('');
      setValidityEnd('');
      setActive('');
      setShowForm(false);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleDeleteBusPass = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/buspass/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBusPasses();
      } else {
        console.error('Failed to delete bus pass. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleEditBusPass = (busPass) => {
    setEditingPassId(busPass.id);
    setPassengerId(busPass.passenger.id);
    setPassType(busPass.passType);
    setValidityStart(busPass.validityStart);
    setValidityEnd(busPass.validityEnd);
    setActive(busPass.active);
    setShowForm(true);
  };

  const handleGeneratePDF = () => {
    const tableElement = document.querySelector('.buspass-table');

    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 10);
        pdf.save('bus_pass.pdf');
      });
    }
  };

  const handleDownloadPDF = (busPass) => {
    const tableElement = document.createElement('table');
    tableElement.classList.add('buspass-table');
  
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');
  
    const th1 = document.createElement('th');
    th1.textContent = 'ID';
    const th2 = document.createElement('th');
    th2.textContent = 'Passenger Name';
    const th3 = document.createElement('th');
    th3.textContent = 'Pass Type';
    const th4 = document.createElement('th');
    th4.textContent = 'Validity Start';
    const th5 = document.createElement('th');
    th5.textContent = 'Validity End';
    const th6 = document.createElement('th');
    th6.textContent = 'Active';
  
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    tr.appendChild(th5);
    tr.appendChild(th6);
    thead.appendChild(tr);
  
    const row = document.createElement('tr');
  
    const td1 = document.createElement('td');
    td1.textContent = busPass.id;
    const td2 = document.createElement('td');
    td2.textContent = getPassengerName(busPass.passenger.id);
    const td3 = document.createElement('td');
    td3.textContent = busPass.passType;
    const td4 = document.createElement('td');
    td4.textContent = busPass.validityStart;
    const td5 = document.createElement('td');
    td5.textContent = busPass.validityEnd;
    const td6 = document.createElement('td');
    td6.textContent = busPass.active;
  
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    row.appendChild(td6);
    tbody.appendChild(row);
  
    tableElement.appendChild(thead);
    tableElement.appendChild(tbody);
  
    html2canvas(tableElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 10);
      pdf.save('bus_pass.pdf');
    });
  };
  

  const getPassengerName = (passengerId) => {
    const passenger = passengers.find((passengerItem) => passengerItem.id === passengerId);
    return passenger ? passenger.name : '';
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main__layout">
        <TopNav />
        <div className="buspass-container" style={{ marginTop: '5%' }}>
          <h1>Bus Passes</h1>
          <div className="buttons-to-add">
            <button className="add-button" onClick={() => setShowForm(true)}>
              Add Passenger
            </button>
            <button className="generate-pdf-button" onClick={handleGeneratePDF}>
              Generate PDF
            </button>
          </div>
        {showForm && (
          <div className="add-form">
            <form onSubmit={handleFormSubmit}>
            <ul className="form-list">
              <li className="form-item">
              <label htmlFor="passengerId">Passenger Name:</label>
              <select
                id="passengerId"
                value={passengerId}
                onChange={(e) => setPassengerId(e.target.value)}
              >
                <option value="">Select Passenger</option>
                {passengers.map((passenger) => (
                  <option key={passenger.id} value={passenger.id}>
                    {passenger.name}
                  </option>
                ))}
              </select>
              </li>
              <li className="form-item">
              <label htmlFor="passType">Pass Type:</label>
<select
  id="passType"
  value={passType}
  onChange={(e) => setPassType(e.target.value)}
>
  <option value="">Select Pass Type</option>
  <option value="MONTHLY">MONTHLY</option>
  <option value="ANNUALLY">ANNUALLY</option>
  <option value="DAILY">DAILY</option>
  <option value="SEMESTER">SEMESTER</option>
</select>
</li>
<li className="form-item">
              <label htmlFor="validityStart">Validity Start:</label>
              <input
                id="validityStart"
                type="date"
                value={validityStart}
                onChange={(e) => setValidityStart(e.target.value)}
              />
</li>
<li className="form-item">
              <label htmlFor="validityEnd">Validity End:</label>
              <input
                id="validityEnd"
                type="date"
                value={validityEnd}
                onChange={(e) => setValidityEnd(e.target.value)}
              />
</li>
<li className="form-item">
              <label htmlFor="active">Active:</label>
<select
  id="active"
  value={active}
  onChange={(e) => setActive(e.target.value)}
>
  <option value="">Select Active</option>
  <option value="Yes">Yes</option>
  <option value="No">No</option>
</select>
</li>
</ul>
              <div className="form-buttons">
                <button className="submit-button" type="submit">
                  {editingPassId ? 'Update' : 'Add'}
                </button>
                <button
                  className="cancel-button"
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPassId('');
                    setPassengerId('');
                    setPassType('');
                    setValidityStart('');
                    setValidityEnd('');
                    setActive('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="buspass-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Passenger Name</th>
              <th>Pass Type</th>
              <th>Validity Start</th>
              <th>Validity End</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {busPasses.map((busPass) => (
              <tr key={busPass.id}>
                <td>{busPass.id}</td>
                <td>{getPassengerName(busPass.passenger.id)}</td>
                <td>{busPass.passType}</td>
                <td>{busPass.validityStart}</td>
                <td>{busPass.validityEnd}</td>
                <td>{busPass.active}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEditBusPass(busPass)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteBusPass(busPass.id)}
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

export default BusPassPage;
