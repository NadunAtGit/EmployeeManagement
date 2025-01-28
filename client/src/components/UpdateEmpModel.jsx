import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const UpdateEmpModal = ({ onClose, employeeData, getAllEmployees }) => {
  // Initialize state with existing employee data
  const [username, setUsername] = useState(employeeData?.username || "");
  const [phone, setPhone] = useState(employeeData?.phone || "");
  const [salary, setSalary] = useState(employeeData?.salary || "");
  const [department, setDepartment] = useState(employeeData?.department || "");
  const [status, setStatus] = useState(employeeData?.status || "Active");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async () => {
    if (!username || !phone || salary === "") {
      setError("Please fill all required fields");
      return;
    }

    setError(""); // Clear previous errors

    try {
      // Send the updated data to the API
      const response = await axiosInstance.put(
        `/update-employee/${employeeData._id}`,
        {
          username,
          phone,
          salary,
          department,
          status,
        }
      );

      if (response.data && response.data.employee) {
        toast.success("Employee updated successfully");
        getAllEmployees(); // Refresh employee list
        onClose(); // Close the modal
      }
    } catch (error) {
      setError("Error updating employee, please try again.");
      console.error("Error details:", error);
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
        onClick={onClose}
      >
        <MdClose size={24} />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Update Employee</h1>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
      )}

      {/* Form Inputs */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="text"
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="number"
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        {/* Department Dropdown */}
        <select
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="" disabled>
            Select Department
          </option>
          <option value="Mechanical">Mechanical</option>
          <option value="Service">Service</option>
        </select>

        {/* Status Radio Buttons */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="Active"
              checked={status === "Active"}
              onChange={(e) => setStatus(e.target.value)}
              className="w-4 h-4"
            />
            Active
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="Inactive"
              checked={status === "Inactive"}
              onChange={(e) => setStatus(e.target.value)}
              className="w-4 h-4"
            />
            Inactive
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Update Employee
        </button>
      </div>
    </div>
  );
};

export default UpdateEmpModal;
