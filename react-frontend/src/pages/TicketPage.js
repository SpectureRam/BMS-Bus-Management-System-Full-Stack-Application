import React, { useState, useEffect } from 'react';
import "../styles/ticket.css";
import Sidebar  from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';

const TicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [passengerId, setPassengerId] = useState('');
  const [scheduleId, setScheduleId] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsResponse, passengersResponse, schedulesResponse] = await Promise.all([
          fetch('http://localhost:8080/api/tickets'),
          fetch('http://localhost:8080/api/passengers'),
          fetch('http://localhost:8080/api/schedules')
        ]);

        if (ticketsResponse.ok && passengersResponse.ok && schedulesResponse.ok) {
          const ticketsData = await ticketsResponse.json();
          const passengersData = await passengersResponse.json();
          const schedulesData = await schedulesResponse.json();
          setTickets(ticketsData);
          setPassengers(passengersData);
          setSchedules(schedulesData);
        } else {
          console.error('Failed to fetch ticket, passenger, or schedule data. Please try again.');
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
      passenger: {
        id: passengerId
      },
      schedule: {
        id: scheduleId
      }
    };

    try {
      const response = await fetch('http://localhost:8080/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newTicket = await response.json();
        setTickets([...tickets, newTicket]);
        setPassengerId('');
        setScheduleId('');
        setShowForm(false);
      } else {
        console.error('Failed to add ticket. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFormCancel = () => {
    setPassengerId('');
    setScheduleId('');
    setShowForm(false);
  };

  const handleDeleteTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedTickets = tickets.filter((ticket) => ticket.id !== id);
        setTickets(updatedTickets);
      } else {
        console.error('Failed to delete ticket. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const getPassengerName = (passengerId) => {
    const passenger = passengers.find((passenger) => passenger.id === passengerId);
    return passenger ? passenger.name : '';
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main__layout">
        <TopNav />
    <div className="ticket-container" style={{ marginTop: '5%' }}>
      <h1>Ticket Details</h1>

      {!showForm && (
        <button className="add-button" onClick={() => setShowForm(true)}>Add Ticket</button>
      )}

      {showForm && (
        <form className="add-form" onSubmit={handleFormSubmit}>
          <label className='form-field-input-data' htmlFor="passengerId">Passenger:</label>
          <select
            id="passengerId"
            value={passengerId}
            onChange={(e) => setPassengerId(e.target.value)}
            required
          >
            <option value="">Select a passenger</option>
            {passengers.map((passenger) => (
              <option key={passenger.id} value={passenger.id}>{passenger.name}</option>
            ))}
          </select>

          <label className='form-field-input-data' htmlFor="scheduleId">Schedule ID:</label>
          <select
            id="scheduleId"
            value={scheduleId}
            onChange={(e) => setScheduleId(e.target.value)}
            required
          >
            <option value="">Select a schedule</option>
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>{schedule.id}</option>
            ))}
          </select>

          <div className="form-buttons">
            <button className="submit-button" type="submit">Add</button>
            <button className="cancel-button" type="button" onClick={handleFormCancel}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Passenger</th>
              <th>Schedule ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{getPassengerName(ticket.passenger.id)}</td>
                <td>{ticket.schedule.id}</td>
                <td>
                  <button className="delete-button" onClick={() => handleDeleteTicket(ticket.id)}>Delete</button>
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

export default TicketPage;
