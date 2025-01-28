import React, { useState, useEffect } from "react";
import { AiOutlineNumber, AiOutlineClockCircle } from "react-icons/ai";
import { MdEventBusy } from "react-icons/md";
import TopEmployeeCard from "../components/TopEmployeeCard";
import axiosInstance from "../utils/axiosInstance";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });
  const [totalEmployees, setTotalEmployees] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveCount, setLeaveCount] = useState(0);

  // Fetch total employees
  const getEmployeeData = async () => {
    try {
      const response = await axiosInstance.get("/get-all-employees");
      if (response.data?.totalEmployees) {
        setTotalEmployees(response.data.totalEmployees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch attendance for the last 5 days
  const fetchAttendanceData = async () => {
    try {
      const response = await axiosInstance.get("/get-count-attendance"); // Correct endpoint
      if (response.data?.attendance) {
        setAttendanceData(response.data.attendance);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const fetchLeaveCount = async () => {
    try {
      const response = await axiosInstance.get("/leave-count"); // API to get today's leave count
      setLeaveCount(response.data.leaveCount); // Set leave count in state
    } catch (error) {
      console.error("Error fetching leave count:", error);
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
    getEmployeeData();
    fetchLeaveCount();
    fetchAttendanceData();
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Prepare data for the bar chart
  const labels = attendanceData.map((item) =>
    new Date(item.date).toLocaleDateString()
  );
  const data = {
    labels,
    datasets: [
      {
        label: "Attendance Count",
        data: attendanceData.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Attendance for the Last 5 Days",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Adjust step size for better readability
        },
      },
    },
  };

  return (
    <div className="container mx-auto py-4 relative">
      <div className="flex items-center justify-between mb-15">
        <div>
          <h1 className="md:text-4xl font-bold border-b-2 border-gray-400 inline">
            Dashboard
          </h1>
          <h1 className="text-gray-600 mt-2">You can see today's summary</h1>
        </div>

        <div className="md:flex justify-between gap-5">
          <h1 className="text-xl font-semi-bold">{currentDateTime.date}</h1>
          <h2 className="text-xl font-semi-bold">{currentDateTime.time}</h2>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 mb-18">
          <div className="flex items-center justify-between gap-4 border-4 border-blue-500 p-3 rounded-xl">
            <div>
              <AiOutlineNumber className="text-blue-500 w-20 h-20" />
            </div>
            <div>
              <h4 className="mb-2 text-gray-600 font-semibold">
                Total Employees:
              </h4>
              <h1 className="text-5xl">{totalEmployees}</h1>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-4 border-blue-500 p-3 rounded-xl">
            <div>
              <AiOutlineClockCircle className="text-blue-500 w-20 h-20" />
            </div>
            <div>
              <h4 className="mb-2 text-gray-600 font-semibold">
                Today Attendance:
              </h4>
              <h1 className="text-5xl">{attendanceData[0]?.count}</h1>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-4 border-blue-500 p-3 rounded-xl">
            <div>
              <MdEventBusy className="text-blue-500 w-20 h-20" />
            </div>
            <div>
              <h4 className="mb-2 text-gray-600 font-semibold">
                Today's Leaves:
              </h4>
              <h1 className="text-5xl">{leaveCount}</h1>
            </div>
          </div>
        </div>

        {/* <div className="my-7 grid grid-cols-1 md:grid-cols-2 gap-14">
          <TopEmployeeCard />
          <TopEmployeeCard />
        </div> */}

        {/* Bottom Graph */}
        <div className="w-full max-w-4xl mx-auto">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
