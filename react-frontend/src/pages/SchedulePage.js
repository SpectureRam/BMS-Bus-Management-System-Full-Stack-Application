import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Sidebar  from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "../styles/schedule.css";

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [busId, setBusId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [editScheduleId, setEditScheduleId] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let busesData, routesData, driversData;
      
      try {
        const [busesResponse, routesResponse, driversResponse, schedulesResponse] = await Promise.all([
          fetch('http://localhost:8080/api/buses'),
          fetch('http://localhost:8080/api/routes'),
          fetch('http://localhost:8080/api/drivers'),
          fetch('http://localhost:8080/api/schedules')
        ]);
    
        if (busesResponse.ok) {
          busesData = await busesResponse.json();
          setBuses(busesData);
        } else {
          console.error('Failed to fetch bus data. Please try again.');
        }
    
        if (routesResponse.ok) {
          routesData = await routesResponse.json();
          setRoutes(routesData);
        } else {
          console.error('Failed to fetch route data. Please try again.');
        }
    
        if (driversResponse.ok) {
          driversData = await driversResponse.json();
          setDrivers(driversData);
        } else {
          console.error('Failed to fetch driver data. Please try again.');
        }
    
        if (schedulesResponse.ok) {
          const schedulesData = await schedulesResponse.json();
          const schedulesWithDetails = schedulesData.map(schedule => ({
            ...schedule,
            bus: busesData.find(bus => bus.id === schedule.bus.id),
            route: routesData.find(route => route.id === schedule.route.id),
            driver: driversData.find(driver => driver.id === schedule.driver.id)
          }));
          setSchedules(schedulesWithDetails);
        } else {
          console.error('Failed to fetch schedule data. Please try again.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };    

    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formattedDepartureTime = moment(departureTime, 'h:mm A').format('HH:mm');
    const formData = {
      bus: { id: busId },
      route: { id: routeId },
      driver: { id: driverId },
      departureTime: formattedDepartureTime,
      arrivalTime,
    };

    try {
      let response;

      if (editScheduleId) {
        // Update existing schedule entry
        response = await fetch(`http://localhost:8080/api/schedules/${editScheduleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new schedule entry
        response = await fetch('http://localhost:8080/api/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        const updatedSchedule = await response.json();
        if (editScheduleId) {
          // Update the existing schedule entry in the state
          const updatedSchedules = schedules.map((schedule) => {
            if (schedule.id === updatedSchedule.id) {
              return updatedSchedule;
            }
            return schedule;
          });
          setSchedules(updatedSchedules);
        } else {
          // Add the new schedule entry to the state
          setSchedules([...schedules, updatedSchedule]);
        }

        setBusId('');
        setRouteId('');
        setDriverId('');
        setDepartureTime('');
        setArrivalTime('');
        setShowForm(false);
        setEditScheduleId(null);
      } else {
        console.error('Failed to add/update schedule. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFormCancel = () => {
    setBusId('');
    setRouteId('');
    setDriverId('');
    setDepartureTime('');
    setArrivalTime('');
    setShowForm(false);
    setEditScheduleId(null);
  };

  const handleEditSchedule = (id) => {
    const selectedSchedule = schedules.find((schedule) => schedule.id === id);
    if (selectedSchedule) {
      setBusId(selectedSchedule.bus.id);
      setRouteId(selectedSchedule.route.id);
      setDriverId(selectedSchedule.driver.id);
      setDepartureTime(selectedSchedule.departureTime);
      setArrivalTime(selectedSchedule.arrivalTime);
      setEditScheduleId(id);
      setShowForm(true);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/schedules/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedSchedules = schedules.filter((schedule) => schedule.id !== id);
        setSchedules(updatedSchedules);
      } else {
        console.error('Failed to delete schedule. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const handleGeneratePDF = () => {
    const tableElement = document.querySelector('.bus-table');

    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
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

  return (
    <div className="layout">
      <Sidebar />
      <div className="main__layout">
        <TopNav />
    <div className="schedule-container" style={{ marginTop: '5%' }}>
      <h1>Schedule Details</h1>
      <div className='buttons-to-add'>
      <button className="add-button" onClick={() => setShowForm(true)}>Add Schedule</button>
      <button className="generate-pdf-button" onClick={handleGeneratePDF}>Generate PDF</button>
      </div>

      {showForm && (
        <form className="add-form" onSubmit={handleFormSubmit}>
        <label className='form-field-input-data' htmlFor="busId">Bus ID:</label>
        <select
          id="busId"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          required
        >
          <option value="">Select Bus</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>{bus.busName}</option>
          ))}
        </select>
        

          <label className='form-field-input-data' htmlFor="routeId">Route ID:</label>
          <select
            id="routeId"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            required
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>

          <label className='form-field-input-data' htmlFor="driverId">Driver ID:</label>
          <select
            id="driverId"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            required
          >
            <option value="">Select Driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>

          <label className='form-field-input-data' htmlFor="departureTime">Departure Time:</label>
          <input
            type="time"
            id="departureTime"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />

          <label className='form-field-input-data' htmlFor="arrivalTime">Arrival Time:</label>
          <input
            type="time"
            id="arrivalTime"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
          />

          <div className="form-buttons">
            <button className="submit-button" type="submit">{editScheduleId ? 'Update' : 'Add'}</button>
            <button className="cancel-button" type="button" onClick={handleFormCancel}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Route Name</th>
              <th>Driver Name</th>            
              <th>Departure Time</th>
              <th>Arrival Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
              <td>{schedule.bus.busName}</td>
              <td>{schedule.route.name}</td>
              <td>{schedule.driver.name}</td>              
                <td>{schedule.departureTime}</td>
                <td>{schedule.arrivalTime}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEditSchedule(schedule.id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteSchedule(schedule.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default SchedulePage;
