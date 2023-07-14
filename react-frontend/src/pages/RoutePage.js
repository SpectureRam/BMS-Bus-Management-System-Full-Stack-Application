import React, { useState, useEffect } from 'react';
import "../styles/route.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Sidebar from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';

const RoutePage = () => {
  const [routes, setRoutes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [editRouteId, setEditRouteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/routes');
        if (response.ok) {
          const data = await response.json();
          setRoutes(data);
        } else {
          console.error('Failed to fetch route data. Please try again.');
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
      source,
      destination,
    };

    try {
      let response;

      if (editRouteId) {
        // Update existing route entry
        response = await fetch(`http://localhost:8080/api/routes/${editRouteId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new route entry
        response = await fetch('http://localhost:8080/api/routes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        const updatedRoute = await response.json();
        if (editRouteId) {
          // Update the existing route entry in the state
          const updatedRoutes = routes.map((route) => {
            if (route.id === updatedRoute.id) {
              return updatedRoute;
            }
            return route;
          });
          setRoutes(updatedRoutes);
        } else {
          // Add the new route entry to the state
          setRoutes([...routes, updatedRoute]);
        }

        setName('');
        setSource('');
        setDestination('');
        setShowForm(false);
        setEditRouteId(null);
      } else {
        console.error('Failed to add/update route. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFormCancel = () => {
    setName('');
    setSource('');
    setDestination('');
    setShowForm(false);
    setEditRouteId(null);
  };

  const handleEditRoute = (id) => {
    const selectedRoute = routes.find((route) => route.id === id);
    if (selectedRoute) {
      setName(selectedRoute.name);
      setSource(selectedRoute.source);
      setDestination(selectedRoute.destination);
      setEditRouteId(id);
      setShowForm(true);
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/routes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedRoutes = routes.filter((route) => route.id !== id);
        setRoutes(updatedRoutes);
      } else {
        console.error('Failed to delete route. Please try again.');
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

  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())||
    route.source.toLowerCase().includes(searchQuery.toLowerCase())||
    route.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main__layout">
        <TopNav />
        <div className="route-container" style={{ marginTop: '5%' }}>
          <h1>Route Details</h1>
          <div className="buttons-to-add">
            <button className="add-button" onClick={() => setShowForm(true)}>
              Add Route
            </button>
            <button className="generate-pdf-button" onClick={handleGeneratePDF}>
              Generate PDF
            </button>
          </div>
          {showForm && (
            <form className="add-form" onSubmit={handleFormSubmit}>
              <label className="form-field-input-data" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                id="routeName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label className="form-field-input-data" htmlFor="source">
                Source:
              </label>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />

              <label className="form-field-input-data" htmlFor="destination">
                Destination:
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />

              <div className="form-buttons">
                <button className="submit-button" type="submit">
                  {editRouteId ? 'Update' : 'Add'}
                </button>
                <button className="cancel-button" type="button" onClick={handleFormCancel}>
                  Cancel
                </button>
              </div>
            </form>
          )}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search routes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table className="route-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.id}>
                    <td>{route.name}</td>
                    <td>{route.source}</td>
                    <td>{route.destination}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEditRoute(route.id)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteRoute(route.id)}>
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
    </div>
  );
};

export default RoutePage;
