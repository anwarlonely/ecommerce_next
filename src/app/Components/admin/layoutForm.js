import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import Cookies from 'js-cookie';

const LayoutForm = () => {
  const [formData, setFormData] = useState({
    page: '',
    position: '',
    serial: '',
    link: '',
    url: null,
  });
  const [message, setMessage] = useState('');
  const [layout, setLayout] = useState([]);
  const [position, setPosition] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [id, setId] = useState('');
  const token = Cookies.get('token') || null;
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const handleGetLayout = async () => {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      try {
        const response = await axios.get(`${backendURL}/api/layout`, { headers });
        setLayout(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    handleGetLayout();
  }, [token, backendURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      url: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEditMode ? handleUpdate() : handleCreate();
  };

  const handleCreate = async () => {
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await axios.post(`${backendURL}/api/layout`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage(response.data.message);
      // Refresh layout list
      handleGetLayout();
    } catch (error) {
      setMessage('An error occurred');
    }
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
      const response = await axios.put(`${backendURL}/api/layout/${id}`, formDataToSend, { headers });
      setMessage(response.data.message);

      handleGetLayout();
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handleDelete = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.delete(`${backendURL}/api/layout/${id}`, { headers });
      setMessage(response.data.message);
      setShowForm(false); 
      setLayout(layout.filter(item => item.id !== id)); 
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  const handlePosition = async (page) => {
    setSelectedLayout(page);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${backendURL}/api/position/${page}`, { headers });
      setPosition(response.data.data);
    } catch (error) {
      console.error('Error fetching data for page:', error);
    }
  };

  const handlePositionLayout = async (page, position) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${backendURL}/api/positionLayout/${page}/${position}`, { headers });
      
      const id = response.data.data.map((item) => item.id)[0];
      setId(id);
      const data = response.data.data.reduce((acc, item) => {
        return {
          page: item.page,
          position: item.position,
          serial: item.serial,
          link: item.link,
          url: null, // Handle file input separately
        };
      }, {});

   
      setFormData(data); 
      
      setShowForm(true);
      setIsEditMode(true); 
    } catch (error) {
      console.error('Error fetching data for page:', error);
    }
  };

  const inputFields = [
    { label: "Page", name: "page" },
    { label: "Position", name: "position" },
    { label: "Serial", name: "serial", type: "number" },
    { label: "Link", name: "link" },
  ];

  return (
    <div>
      <div>
        <Button onClick={() => {
          setShowForm(true);
          setIsEditMode(false);
          setFormData({ page: '', position: '', serial: '', link: '', url: null });
        }} variant="contained" color="primary">
          Create Layout
        </Button>
      </div>
      {showForm && ( 
        <form onSubmit={handleSubmit} className='flex flex-col w-72'>
          {inputFields.map((field, index) => (
            <TextField
              key={field.name} // Ensure key is unique and stable
              label={field.label}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              type={field.type || "text"}
              required
            />
          ))}
          <input
            type="file"
            onChange={handleFileChange}
          />
          <Button type="submit" variant="contained" color="primary">
            {isEditMode ? 'Edit' : 'Submit'}
          </Button>
          {isEditMode && (
            <Button onClick={handleDelete} variant="contained" color="secondary">
              Delete
            </Button>
          )}
        </form>
      )}
      <div>
        {layout?.map((item) => (
          <div key={item.id}> 
            <Button onClick={() => handlePosition(item.page)}>{item.page}</Button>
            {selectedLayout === item.page && position?.map((pos) => (
              <Button key={pos.id} onClick={() => handlePositionLayout(item.page, pos.position)}>{pos.position}</Button>
            ))}
          </div>
        ))}
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LayoutForm;
