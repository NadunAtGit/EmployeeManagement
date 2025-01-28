import React, { useState } from "react";

const LeaveCardAdmin = ({ leave, id, handleApprove }) => {
  const [status, setStatus] = useState(leave.status);

  const onApprove = (newStatus) => {
    handleApprove(id, newStatus); // Call the handleApprove function from parent
    setStatus(newStatus); // Update status locally
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-300 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{leave.username}</h3>
      <div className="space-y-2">
        <p className="text-gray-600"><strong>Date:</strong> {new Date(leave.leaveDate).toLocaleDateString()}</p>
        <p className="text-gray-600"><strong>Type:</strong> {leave.leaveType}</p>
        <p className="text-gray-600"><strong>Reason:</strong> {leave.reason}</p>
        <p className="text-gray-600"><strong>Status:</strong> 
          <span className={`font-semibold ${status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>{status}</span>
        </p>
      </div>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => onApprove("Approved")}
          className={`py-2 px-4 rounded-lg border text-white transition-colors duration-200 ${status === 'Approved' ? 'bg-green-500' : 'bg-green-400 hover:bg-green-600'}`}
        >
          Approve
        </button>
        <button
          onClick={() => onApprove("Not Approved")}
          className={`py-2 px-4 rounded-lg border text-white transition-colors duration-200 ${status === 'Not Approved' ? 'bg-red-500' : 'bg-red-400 hover:bg-red-600'}`}
        >
          Not Approve
        </button>
      </div>
    </div>
  );
};

export default LeaveCardAdmin;
