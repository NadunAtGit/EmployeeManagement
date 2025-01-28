import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaAddressCard, FaRegMoneyBillAlt, FaStar, FaSignOutAlt, FaClipboardList, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Adjust the path to your axios instance

const EmployeeDashBoard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [error, setError] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    leaveDate: '',
    leaveType: '',
    reason: '',
  });
  const [formError, setFormError] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data && !response.data.error && response.data.user) {
        setUserInfo({
          id: response.data.user._id,
          username: response.data.user.username,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          department: response.data.user.department,
          phone: response.data.user.phone,
          salary: response.data.user.salary,
          status: response.data.user.status,
          dateOfJoining: new Date(response.data.user.dateOfJoining).toLocaleDateString(),
          rating: response.data.user.rating,
          imageUrl: response.data.user.imageUrl,
        });
      } else {
        setError('Failed to retrieve user information.');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else {
        setError('An error occurred while fetching user data.');
      }
      console.error('Error fetching user data:', error);
    }
  };

  const getAppliedLeaves = async () => {
    try {
      const response = await axiosInstance.get('/applied-leaves');
      setAppliedLeaves(response.data.leaves);
    } catch (error) {
      console.error('Error fetching applied leaves:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleLeaveChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    const { leaveDate, leaveType, reason } = leaveForm;

    if (!leaveDate || !leaveType || !reason) {
      setFormError('All fields are required.');
      return;
    }

    try {
      const response = await axiosInstance.post('/apply-leave', leaveForm);
      if (response.data && !response.data.error) {
        alert('Leave application submitted successfully.');
        setLeaveForm({
          leaveDate: '',
          leaveType: '',
          reason: '',
        });
        setFormError(null);
      } else {
        setFormError(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      setFormError('Failed to submit leave application.');
    }
  };

  const markAttendance = async () => {
    try {
      const response = await axiosInstance.post('/mark-attendance');
      setAttendanceStatus(response.data.message);  // Display success or failure message
    } catch (error) {
      console.error('Error marking attendance:', error);
      setAttendanceStatus('Failed to mark attendance.');
    }
  };

  const markDeparture = async () => {
    try {
      const response = await axiosInstance.put('/mark-departure');
      setAttendanceStatus(response.data.message);  // Display success or failure message
    } catch (error) {
      console.error('Error marking departure:', error);
      setAttendanceStatus('Failed to mark departure.');
    }
  };

  useEffect(() => {
    getUserInfo();
    getAppliedLeaves();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Section */}
      <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-cyan-600 py-2 px-4 rounded-md hover:bg-red-600 flex items-center cursor-pointer font-bold"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto p-6 lg:flex lg:space-x-6">
        {/* Left Side (Profile Section) */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-4 border-blue-600 flex flex-col justify-center mb-3">
          <img
            src={userInfo?.imageUrl || 'https://via.placeholder.com/150'}
            alt={userInfo?.name}
            className="w-42 h-42 rounded-full border-2 border-gray-300 mb-4 object-cover"
          />
          <h2 className="text-xl font-semibold text-gray-800">{userInfo?.name}</h2>
          <p className="text-sm text-gray-500">{userInfo?.role}</p>
        </div>

        {/* Right Side (Details Section) */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-lg p-6 border-blue-600 border-4 flex flex-col justify-center mb-3">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaUser className="text-blue-500" />
              <span>{userInfo?.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-blue-500" />
              <span>{userInfo?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhone className="text-blue-500" />
              <span>{userInfo?.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendar className="text-blue-500" />
              <span>Joined: {userInfo?.dateOfJoining}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaRegMoneyBillAlt className="text-blue-500" />
              <span>Salary: ${userInfo?.salary}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaStar className="text-blue-500" />
              <span>Rating: {userInfo?.rating}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaAddressCard className="text-blue-500" />
              <span>Department: {userInfo?.department}</span>
            </div>
          </div>
        </div>

        {/* Leave Application Form Section */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-lg p-6 border-blue-600 border-4 mb-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Apply for Leave</h2>
          <form onSubmit={handleLeaveSubmit} className="space-y-4">
            {formError && <div className="text-red-500">{formError}</div>}
            <div>
              <label htmlFor="leaveDate" className="block text-sm font-medium text-gray-700">Leave Date</label>
              <input
                type="date"
                id="leaveDate"
                name="leaveDate"
                value={leaveForm.leaveDate}
                onChange={handleLeaveChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">Leave Type</label>
              <select
                id="leaveType"
                name="leaveType"
                value={leaveForm.leaveType}
                onChange={handleLeaveChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Leave Type</option>
                <option value="Full Day">Full Day</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                id="reason"
                name="reason"
                value={leaveForm.reason}
                onChange={handleLeaveChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Apply for Leave
            </button>
          </form>
        </div>
      </div>

      {/* Today's Date and Attendance Section */}
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border-blue-600 border-4">
          <div className="flex items-center space-x-4">
            <FaClock className="text-blue-500" />
            <span className="text-lg font-semibold">{new Date().toLocaleString()}</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={markAttendance}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Mark Attendance
            </button>
            <button
              onClick={markDeparture}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Mark Departure
            </button>
          </div>
        </div>
        {attendanceStatus && (
          <div className="mt-4 text-center text-lg font-semibold text-gray-700">
            {attendanceStatus}
          </div>
        )}
      </div>

      {/* Applied Leaves Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Applied Leaves</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedLeaves.length > 0 ? (
            appliedLeaves.map((leave, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 text-center"
              >
                <p className="font-semibold text-gray-800">{leave.leaveType}</p>
                <p className="text-gray-500">From: {new Date(leave.startDate).toLocaleDateString()}</p>
                <p className="text-gray-500">To: {new Date(leave.endDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Status: {leave.status}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No applied leaves yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashBoard;
