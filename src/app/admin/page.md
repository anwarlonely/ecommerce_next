"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import '../../styles/styles.scss';
import Cookies from 'js-cookie';
import { 
  useGetLayoutDataQuery,
  useGetLayoutPositionDataMutation,
  useGetLayoutPositionInnerDataMutation,
} from "@/redux/features/admin/adminApi";
import { useAddLayoutMutation, useUpdateLayoutMutation, useDeleteLayoutMutation } from "@/redux/features/admin/adminApi";
import { useAddMediaMutation } from "@/redux/features/admin/adminMediaFileApi";

const LayoutForm = () => {
  const [formData, setFormData] = useState({
    page: '',
    position: '',
    serial: '',
    link: '',
    url: null,
    visibility: '',
    status: ''
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [layout, setLayout] = useState([]);
  const [position, setPosition] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const token = Cookies.get('token') || null;
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [oldUrl, setOldUrl] = useState('');
  const [getLayoutPositionData, {}] = useGetLayoutPositionDataMutation();
  const [getLayoutPositionInnerData, {}] = useGetLayoutPositionInnerDataMutation();
  const [addLayout, {}] = useAddLayoutMutation();
  const [updateLayout] = useUpdateLayoutMutation();
  const [deleteLayout, {}] = useDeleteLayoutMutation();
  const [addMedia, {}] = useAddMediaMutation();

  const layoutApiResponse = useGetLayoutDataQuery();

  useEffect(()=>{
    if(layoutApiResponse?.isSuccess){
      setLayout(layoutApiResponse.data.data)
    }else{
      setLayout([]);
    }
  },[layoutApiResponse])


  const handlePosition = async (page) => {
    setSelectedLayout(page);
    getLayoutPositionData(page).then((res) => {
      if (res) {
        setPosition(res.data.data);
      } else {
        setPosition([]);
      }
    });

  };

  const handlePositionLayout = async (page, position) => {
    getLayoutPositionInnerData({page: page, position: position}).then((res) => {
      
      if (res) {
        setSelectedPosition(res.data.data);
      } else {
        setSelectedPosition([]);
      }
    });
  };

  const handleEdit = (value) => {
    setOldUrl(value.url)
    setFormData({
      page: value.page,
      position: value.position,
      serial: value.serial,
      link: value.link,
      url: value.url,
      visibility: value.visibility,
      status: value.status
    });

    setShowForm(true);
    setIsEditMode(true);
    setEditId(value.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let mappedValue = value;

    if (name === 'status') {
      mappedValue = value === 'publish' ? 1 : value === 'unpublish' ? 0 : '';
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: mappedValue
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
     
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        };

        const formDataToSend = new FormData();
        formDataToSend.append('thumbnail', file);
        formDataToSend.append('old_url', oldUrl);

        try {
          const response = await axios.post(`${backendURL}/api/mediafile`, formDataToSend, { headers });
          setFormData(prevData => ({
              ...prevData,
              url: response.data.url
            }));
          
        } catch (error) {
          console.error('Error uploading file:', error);
        }
     }
  };
  
  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
     
  //       const formDataToSend = {
  //         thumbnail: file,
  //         old_url: oldUrl
  //       }

  //       addMedia(JSON.stringify(formDataToSend)).then((res) => {
  //         console.log(res, 'res');
  //         if (res) {
  //           setFormData(prevData => ({
  //             ...prevData,
  //             url: response.data.url
  //           }));
            
  //         } else {
  //           setMessage('An error occurred');
  //         }
  //       });
  //    }
  // };

  const handleCreate = async () => {
    addLayout(formData).then((res) => {

      if (res) {
        setMessage(res.data.message);
        setFormData({ page: '', position: '', serial: '', link: '', url: null, visibility: '', status: ''});
        setShowForm(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } else {
        setMessage('An error occurred');
      }
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      const updatedData = {};
      if (formData.page) updatedData.page = formData.page;
      if (formData.position) updatedData.position = formData.position;
      if (formData.serial) updatedData.serial = formData.serial;
      if (formData.link) updatedData.link = formData.link;
      if (formData.url) updatedData.url = formData.url;
      if (formData.visibility) updatedData.visibility = formData.visibility;
      updatedData.status = formData.status;

      await handleUpdate(editId, updatedData);
    } else {
      await handleCreate();
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const res = await updateLayout({ data: updatedData, id: id }).unwrap();
      setMessage(JSON.stringify(res.message)); 
      setFormData({ page: '', position: '', serial: '', link: '', url: null, visibility: '', status: ''});
      setShowForm(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Update failed: ', error);
      setMessage('An error occurred');
    }
  };

  const handleDelete = async (itemId) => {
    deleteLayout(itemId).then((res) => {
    
      if (res) {
        setMessage(res.data.message);
        setShowForm(false);
        setLayout(layout.filter(item => item.id !== itemId));
      } else {
        setMessage('An error occurred');
      }
    });
  };

  const inputFields = [
    { label: "Page", name: "page" },
    { label: "Position", name: "position" },
    { label: "Serial", name: "serial", type: "number" },
    { label: "Link", name: "link" },
  ];

  return (
    <div className='p-12'>
      <div>
        <Button onClick={() => {
          setShowForm(true);
          setIsEditMode(false);
          setFormData({ page: '', position: '', serial: '', link: '', url: null, visibility: '', status: '' });
        }} variant="contained" color="primary" className='mb-8'>
          Create Layout
        </Button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className='flex flex-col w-80 p-8 rounded-lg shadow-xl'>
          {inputFields.map((field, index) => (
            <TextField
              key={index}
              label={field.label}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              type={field.type || "text"}
              required
              className='mb-4'
            />
          ))}
          <input
            type="file"
            onChange={handleFileChange}
          />
          {preview && (
          <div className="imagePreviewContainer">
            <img src={preview} alt="Image Preview" className="imagePreview "/>
          </div>
        )}
          {isEditMode && formData.url && (
            <div className="image-preview">
              <img src={`${backendURL}/storage/${formData.url}`} alt={formData.url} className='w-64 h-64 m' />
              <Button onClick={() => setFormData(prevData => ({ ...prevData, url: null }))} variant="outlined" color="secondary" className='mt-4'>
                Remove Image
              </Button>
            </div>
          )}
          <TextField
            select
            label="Visibility"
            name="visibility"
            value={formData.visibility || ''}
            onChange={handleChange}
            required
            fullWidth
            className='mt-4'
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Visibility</option>
            <option value="public">Public</option>
            <option value="protected">Protected</option>
          </TextField>
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status === undefined ? '' : formData.status ? 'publish' : 'unpublish'}
            onChange={handleChange}
            required
            fullWidth
            className='mt-4'
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select Status</option>
            <option value="publish">Publish</option>
            <option value="unpublish">UnPublish</option>
          </TextField>
          <Button type="submit" variant="contained" color="primary" className='mt-4'>
            {isEditMode ? 'Update' : 'Submit'}
          </Button>
        </form>
      )}
      <div className='admin-container'>
      <h1 className='text-3xl font-bold mb-4'>Layout</h1>
      <div className="layoutContainer">
        {layout?.map((item, index) => (
          <div key={index} className="pageContainer">
            <Button className='shadow-lg w-32' onClick={() => handlePosition(item.page)}>{item.page}</Button>
            {selectedLayout === item.page && (
              <div className="positionContainer">
                {position?.map((pos, idx) => (
                  <div className='flex flex-row items-start' key={idx}>
                  <Button className='shadow-lg w-32 mb-4' onClick={() => handlePositionLayout(item.page, pos.position)}>{pos.position}</Button>
                  <div key={idx} className="positionBlock">
                    
                    {selectedPosition?.filter(value => value.position === pos.position).map((value, idx) => (
                      <div key={idx} className="detailBlock">
                        <p>URL:<img src={`${backendURL}/storage/${value.url}`} alt={`${value.url}`} className="image" /></p>
                        <p>Link: {value.link}</p>
                        <div className='flex flex-row gap-4'>
                        <Button onClick={() => handleEdit(value)} variant="contained" color="secondary">
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(value.id)} variant="contained" color="secondary">
                          Delete
                        </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LayoutForm;
