import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "./Sidebar.jsx";
import Navbar from './Navbar.jsx';
import { Edit3 } from "lucide-react";
import Swal from 'sweetalert2';


const Profile = () => {
  // const [showToast,setShowToast]=useState(false);

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    gender: 'other',
    address: '',
    location: '',
    phone: '',
    linkedin: '',
    designation: '',
    role: 'user'
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem('access');

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile_post/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data.data);
      setFormData({
        full_name: response.data.data.full_name,
        gender: response.data.data.gender,
        address: response.data.data.address,
        location: response.data.data.location,
        phone: response.data.data.phone,
        linkedin: response.data.data.linkedin,
        designation: response.data.data.designation,
        role: response.data.data.role
      });
    } catch (error) {
      console.log('No profile found. You can create one.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile && profile.id) 
       {
        const res = await axios.patch(`http://localhost:8000/api/profile/${profile.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // alert("Profile updated");
        setProfile(res.data.data);
        setIsEditing(false);
        Swal.fire({
          icon:'success',
          title:"Profile updated ",
          text:"Your profile has been updated successfully! "

        })
        // setShowToast(true);

        // setTimeout(() => {
        //   setShowToast(false);
        // }, 3000);
      } else {
        const res = await axios.post('http://localhost:8000/api/profile_post/', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // alert("Profile created");
        setProfile(res.data.data);
        Swal.fire({
          icon:"success",
          title:"Profile created",
          text:"Your profile has been created successfully!"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while submitting the profile!',
      });
      // alert('Error submitting profile');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* {showToast && (
  <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
    Profile updated successfully!
  </div>
)} */}

      <div className="fixed left-0 top-0 h-screen w-64 sidebar">
        <Sidebar />
      </div>
      
      <div className='flex-1 content' >
      <div className="fixed top-0 left-0 w-full navbar z-10">
          <Navbar />
        </div>
      
      <div
        className="flex-1 flex flex-col profile-box"
        style={{
          marginLeft: '400px',
          marginTop: '100px',
          backgroundColor: '#085191',
          width: '500px',
          textAlign: 'center',
          padding: '20px',
          borderRadius: '10px',
          color: 'white',
        }}
      >
   
      
        <div className="flex justify-center items-start p-6" style={{ marginTop: '50px' }}>
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          {profile && !isEditing ? (
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Full Name:</strong> {profile.full_name || 'Not provided'}</p>
              <p><strong>Gender:</strong> {profile.gender || 'Not provided'}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <p><strong>Location:</strong> {profile.location}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>LinkedIn:</strong> <a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin}</a></p>
              <p><strong>Designation:</strong> {profile.designation}</p>
              <p><strong>Role:</strong> {profile.role}</p>
              
  <button className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-yellow-600 hover:text-black flex items-center gap-2 transition-all duration-200"
  onClick={() => setIsEditing(true)}
>
  <Edit3 size={15} />
  Edit
</button>
            </div>
          ) : (
<form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded space-y-4 text-left">
  <div>
    <label className="block mb-1 font-medium">Full Name</label>
    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
  </div>

  <div>
    <label className="block mb-1 font-medium">Gender</label>
    <div className="flex gap-4 mt-2">
      <label>
        <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="mr-1" />
        Male
      </label>
      <label>
        <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="mr-1" />
        Female
      </label>
      <label>
        <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} className="mr-1" />
        Other
      </label>
    </div>
  </div>

  <div>
    <label className="block mb-1 font-medium">Address</label>
    <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
  </div>

  <div>
    <label className="block mb-1 font-medium">Location</label>
    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
  </div>

  <div>
    <label className="block mb-1 font-medium">Phone</label>
    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
  </div>

  <div>
    <label className="block mb-1 font-medium">LinkedIn</label>
    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
  </div>

  <div>
    <label className="block mb-1 font-medium">Designation</label>
    <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
  </div>

  <div>
    <label className="block mb-1 font-medium">Role</label>
    <div className="flex gap-4 mt-2">
      <label>
        <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleChange} className="mr-1" />
        Admin
      </label>
      <label>
        <input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleChange} className="mr-1" />
        User
      </label>
    </div>
  </div>

  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
    {profile ? 'Update Profile' : 'Create Profile'}
  </button>
</form>



          )}
        </div>
      </div>
    </div>
    </div>
  );
};
export default Profile;