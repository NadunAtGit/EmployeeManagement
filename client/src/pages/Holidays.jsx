import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import LeaveCardAdmin from "../components/Cards/LeaveCardAdmin";

const Holidays = () => {
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });

  const [allAttendances, setAllAttendances] = useState([]);
  const [appliedLeaves, setAppliedLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leavesLoading, setLeavesLoading] = useState(true);

  // Fetch attendance data
  const fetchAttendances = async () => {
    try {
      const response = await axiosInstance.get("/get-all-attendance");
      setAllAttendances(response.data.attendances);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch not approved leaves
  const fetchLeaves = async () => {
    try {
      const response = await axiosInstance.get("/get-not-approved-leaves");
      setAppliedLeaves(response.data.leaves);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLeavesLoading(false);
    }
  };

  // Handle approving/rejecting leave
  const handleApprove = async (id, newStatus) => {
    try {
      const response = await axiosInstance.put(
        `/approve-leave/${id}`,
        { status: newStatus },
        
      );
      if (!response.data.error) {
        fetchLeaves(); // Trigger the leaves update after approval
      } else {
        console.error("Failed to update leave status:", response.data.message);
      }
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentDateTime({ date, time });
    };

    updateDateTime(); // Update immediately
    const interval = setInterval(updateDateTime, 1000); // Update every second
    fetchAttendances(); // Fetch attendance data on mount
    fetchLeaves(); // Fetch leaves data on mount
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="container mx-auto py-4 relative">
      <div className="flex items-center justify-between mb-15">
        <div>
          <h1 className="md:text-4xl font-bold border-b-2 border-gray-400 inline">
            Attendance
          </h1>
          <h1 className="text-gray-600 mt-2">
            You can see today all attendance details here
          </h1>
        </div>

        <div className="md:flex justify-between gap-5">
          <h1 className="text-xl font-semi-bold">{currentDateTime.date}</h1>
          <h2 className="text-xl font-semi-bold">{currentDateTime.time}</h2>
        </div>
      </div>

      {/* Applied Leaves Section */}
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Applied Leaves
        </h2>
        {leavesLoading ? (
          <p className="text-center text-gray-600">Loading leaves...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedLeaves.length > 0 ? (
              appliedLeaves.map((leave, index) => (
                <LeaveCardAdmin
                  key={index}
                  leave={leave}
                  id={leave._id}
                  handleApprove={handleApprove} // Pass handleApprove function to LeaveCardAdmin
                />
              ))
            ) : (
              <p className="text-gray-500">No applied leaves yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Attendance Section */}
      <div className="overflow-x-scroll md:overflow-x-auto mt-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading attendance...</p>
        ) : allAttendances.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-[#5b7ad2] text-white">
                <th className="py-3 px-4 text-left">Employee ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Arrival Time</th>
                <th className="py-3 px-4 text-left">Departure Time</th>
              </tr>
            </thead>
            <tbody>
              {allAttendances.map((attendance) => (
                <tr key={attendance._id} className="border-b">
                  <td className="py-3 px-4">{attendance.employeeId}</td>
                  <td className="py-3 px-4">
                    {new Date(attendance.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{attendance.status}</td>
                  <td className="py-3 px-4">{attendance.arrivalTime}</td>
                  <td className="py-3 px-4">
                    {attendance.departureTime === "undefined"
                      ? "N/A"
                      : attendance.departureTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No attendances found.</p>
        )}
      </div>
    </div>
  );
};

export default Holidays;
