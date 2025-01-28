import React from "react";
import { FiMenu } from "react-icons/fi"; // For Menu icon
import { FaUserCircle } from "react-icons/fa"; // For User Circle icon
import { MdSpaceDashboard } from "react-icons/md"; // For Dashboard icon
import { FaUserTie } from "react-icons/fa"; // For Employee icon
import { MdBeachAccess } from "react-icons/md"; // For Holidays icon
import { BiDollar } from "react-icons/bi"; // For Dollar icon
import { FiLogOut } from "react-icons/fi"; // For Log Out icon

const UserDataModal = ({ userInfo, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[40%] max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold"
          >
            ✖
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src={userInfo.imageUrl}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h3 className="text-lg font-semibold">{userInfo.username}</h3>
          <p className="text-gray-500">{userInfo.email}</p>
        </div>
        <div className="mt-4">
          <p>
            <strong>Role:</strong> {userInfo.role}
          </p>
          <p>
            <strong>Department:</strong> {userInfo.department}
          </p>
          <p>
            <strong>Phone:</strong> {userInfo.phone}
          </p>
          <p>
            <strong>Date of Joining:</strong> {userInfo.dateOfJoining}
          </p>
          <p>
            <strong>Salary:</strong> ${userInfo.salary}
          </p>
          <p>
            <strong>Status:</strong> {userInfo.status}
          </p>
          <p>
            <strong>Rating:</strong> {userInfo.rating}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDataModal;
