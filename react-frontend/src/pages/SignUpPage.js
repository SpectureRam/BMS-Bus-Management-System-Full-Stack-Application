import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Sidebar from '../components/Sidebar/Sidebar';
import TopNav from '../components/TopNav/TopNav';
import '../styles/signup.css';

const SignUpPage = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/signup');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch user data. Please try again.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      username,
      password,
    };

    try {
      let response;

      if (editUserId) {
        // Update existing user entry
        response = await fetch(`http://localhost:8080/api/signup/${editUserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      } else {
        // Add new user entry
        response = await fetch('http://localhost:8080/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      }

      if (response.ok) {
        const updatedUser = await response.json();
        if (editUserId) {
          const updatedUsers = users.map((user) => {
            if (user.id === updatedUser.id) {
              return updatedUser;
            }
            return user;
          });
          setUsers(updatedUsers);
        } else {
          setUsers([...users, updatedUser]);
        }

        setName('');
        setEmail('');
        setUsername('');
        setPassword('');
        setShowForm(false);
        setEditUserId(null);
      } else {
        console.error('Failed to add/update user. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFormCancel = () => {
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setShowForm(false);
    setEditUserId(null);
  };

  const handleEditUser = (id) => {
    const selectedUser = users.find((user) => user.id === id);
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setUsername(selectedUser.username);
      setPassword(selectedUser.password);
      setEditUserId(id);
      setShowForm(true);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/signup/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
      } else {
        console.error('Failed to delete user. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleGeneratePDF = () => {
    const tableElement = document.querySelector('.signup-table');

    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 10);
        pdf.save('signup_details.pdf');
      });
    }
  };

  return (
    <div className='layout'>
      <Sidebar />
      <div className="main__layout">
        <TopNav />
        <div className="signup-container" style={{marginTop:'5%'}}>
          <h1>User Management</h1>
          <div className='buttons-to-add'>
          <button className="add-button" onClick={() => setShowForm(true)}>Add Users</button>
      <button className="generate-pdf-button" onClick={handleGeneratePDF}>Generate PDF</button>
      </div>
          {showForm && (
            <div className="add-form">
            <form onSubmit={handleFormSubmit}>
            <ul className="form-list">
              <li className="form-item">
              <label className='form-field-input-data' htmlFor="name">Name:</label>
              <input
                type="name"
                id="nam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              </li>
              <li className="form-item">
              <label className='form-field-input-data' htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              </li>
              <li className="form-item">
              <label className='form-field-input-data' htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              </li>
              <li className="form-item">
              <label className='form-field-input-data' htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              </li>
              </ul>
              <div className="form-buttons">
                <button className="submit-button" type="submit">{editUserId ? 'Update' : 'Add'}</button>
                <button className="cancel-button"type="button"onClick={handleFormCancel}>Cancel</button>
              </div>
            </form>
            </div>
          )}

          <table className="signup-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditUser(user.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
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

export default SignUpPage;
