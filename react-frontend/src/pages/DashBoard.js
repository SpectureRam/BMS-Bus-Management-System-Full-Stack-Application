import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../styles/dashboard.css";
import Sidebar from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';

const Dashboard = () => {
  const [totalBuses, setTotalBuses] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [totalRoutes, setTotalRoutes] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalBusPasses, setTotalBusPasses] = useState(0); // Add state for total bus passes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const busResponse = await fetch('http://localhost:8080/api/buses');
        if (busResponse.ok) {
          const busData = await busResponse.json();
          setTotalBuses(busData.length);
        } else {
          console.error('Failed to fetch bus data. Please try again.');
        }

        const driverResponse = await fetch('http://localhost:8080/api/drivers');
        if (driverResponse.ok) {
          const driverData = await driverResponse.json();
          setTotalDrivers(driverData.length);
        } else {
          console.error('Failed to fetch driver data. Please try again.');
        }

        const routeResponse = await fetch('http://localhost:8080/api/routes');
        if (routeResponse.ok) {
          const routeData = await routeResponse.json();
          setTotalRoutes(routeData.length);
        } else {
          console.error('Failed to fetch route data. Please try again.');
        }

        const passengerResponse = await fetch('http://localhost:8080/api/passengers');
        if (passengerResponse.ok) {
          const passengerData = await passengerResponse.json();
          setTotalPassengers(passengerData.length);
        } else {
          console.error('Failed to fetch passenger data. Please try again.');
        }

        const busPassResponse = await fetch('http://localhost:8080/buspass');
        if (busPassResponse.ok) {
          const busPassData = await busPassResponse.json();
          setTotalBusPasses(busPassData.length);
        } else {
          console.error('Failed to fetch bus pass data. Please try again.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main__layout">
        <TopNav />
        <div className="dashboard-container" style={{ marginTop: '8%' }}>
          <div className="dashboard-card">
            <h2>Total Buses</h2>
            <span>{totalBuses}</span>
            <Link to="/bus">
              <button className="view-button">View Buses</button>
            </Link>
          </div>
          <div className="dashboard-card">
            <h2>Total Drivers</h2>
            <span>{totalDrivers}</span>
            <Link to="/driver">
              <button className="view-button">View Drivers</button>
            </Link>
          </div>
          <div className="dashboard-card">
            <h2>Total Routes</h2>
            <span>{totalRoutes}</span>
            <Link to="/route">
              <button className="view-button">View Routes</button>
            </Link>
          </div>
          <div className="dashboard-card">
            <h2>Total Passengers</h2>
            <span>{totalPassengers}</span>
            <Link to="/passenger">
              <button className="view-button">View Passengers</button>
            </Link>
          </div>
          <div className="dashboard-card">
            <h2>Total Bus Passes</h2>
            <span>{totalBusPasses}</span>
            <Link to="/buspass">
              <button className="view-button">View Bus Passes</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
