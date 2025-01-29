import React, { useState } from "react";
import { MdClose, MdAdd } from "react-icons/md";
import DateSelector from "./inputs/DateSelector";
import ImageSelector from "./inputs/ImageSelector";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import uploadImage from "../utils/UploadImage";
import moment from "moment";
import {validateEmail,validateSriLankanPhone} from "../utils/validations";

const AddEmpModal = ({ onClose, getAllEmployees }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin"); // Default to Admin
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(""); // Department as a dropdown
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("Active"); // Default to Active
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !username || !email || !phone || !salary) {
      setError("Please fill all required fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid Sri Lankan email");
      return;
    }
  
    // Validate phone number
    if (!validateSriLankanPhone(phone)) {
      setError("Please enter a valid Sri Lankan phone number");
      return;
    }
    setError(""); // Clear previous errors

    try {
      // Upload image if it's provided
      let uploadedImageUrl = "";
      if (imageUrl) {
        const imageUploadRes = await uploadImage(imageUrl);
        uploadedImageUrl = imageUploadRes.imageUrl || "";
      }

      console.log("Sending data:", {
        name,
        username,
        email,
        password,
        phone,
        salary,
        role,
        department,
        status,
        dateOfJoining,
        imageUrl: uploadedImageUrl,
      });
      

      // Send the form data to the API
      const response = await axiosInstance.post("/create-employee", {
        name,
        username,
        email,
        password,
        phone,
        salary,
        role,
        department,
        status,
        dateOfJoining: dateOfJoining ? moment(dateOfJoining).valueOf() : null,
        imageUrl: uploadedImageUrl,
      });

      if (response.data && response.data.employee) {
        toast.success("Employee created successfully");
        getAllEmployees(); // Refresh employee list
        onClose(); // Close the modal
      }
    } catch (error) {
      setError("Error creating employee, please try again.");
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
      <div className="flex items-center flex-col gap-8 mb-6">
        <h1 className="text-xl font-bold">Create Employee</h1>
        <ImageSelector setImage={setImageUrl} image={imageUrl} />
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
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        {/* Role Dropdown */}
        <select
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Technician">Technician</option>
          <option value="Receptionist">Receptionist</option>
        </select>

        {/* Department Dropdown */}
        <select
          className="text-md text-slate-950 border-2 p-2 rounded-xl border-blue-500 w-full"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="" disabled>Select Department</option>
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

        {/* Date Picker */}
        <DateSelector date={dateOfJoining} setDate={setDateOfJoining} />
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Create Employee
        </button>
      </div>
    </div>
  );
};

export default AddEmpModal;
