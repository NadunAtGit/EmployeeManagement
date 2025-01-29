import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { MdBeachAccess } from "react-icons/md";
import { BiDollar } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { useNavigate, Outlet, Link } from "react-router-dom";
import Modal from "react-modal"; // Ensure you have `react-modal` installed
import UserData from "../components/UserData";
import axiosInstance from "../utils/axiosInstance";
import UserDataModal from "../components/UserDataModal";
import { FaPaperPlane } from 'react-icons/fa';

// Set App Element for Accessibility (required by react-modal)
Modal.setAppElement("#root");

const Home = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { title: "Dashboard", icon: <MdSpaceDashboard size={30} className="text-white font-bold" />, path: "/home/dashboard" },
    { title: "Employees", icon: <FaUserTie size={30} className="text-white font-bold" />, path: "/home/employee" },
    { title: "Attendances", icon: <MdBeachAccess size={30} className="text-white font-bold" />, path: "/home/holidays" },
  
  ];

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");

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
        setError("Failed to retrieve user information.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError("An error occurred while fetching user data.");
      }
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div
          className={`${
            isOpen ? "w-72" : "w-20"
          } bg-gradient-to-b from-[#5b7ad2] via-[#1e40af] to-[#1e429f]
 min-h-screen h-full p-5 pt-8 relative  flex flex-col justify-between text-white duration-300 relative `}
        >
          {/* Menu Icon */}
          <FiMenu
            size={25}
            className={`absolute text-white top-6 cursor-pointer ${
              isOpen ? "right-5" : "right-[35%]"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          />

          {/* User Profile Section */}
          <div
            className={`flex flex-col items-center justify-center mt-2 ${
              !isOpen ? "hidden" : ""
            }`}
            onClick={() => setOpenUserModal(true)}
          >
            <UserData username={userInfo?.username} email={userInfo?.email} imgUrl={userInfo?.imageUrl} />
            
             <Link to="/employee-dashboard" className="text-decoration-none">
      <button className="bg-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md transition-transform transform hover:scale-95 focus:outline-none">
        <FaPaperPlane className="text-xl" />
        Your Dashboard
      </button>
    </Link>

          </div>

          {!isOpen && (
            <div className="flex items-center justify-center mt-10">
              <FaUserCircle size={40} className="text-gray-300" />
            </div>
          )}

          {isOpen ? (
            <div className="flex flex-col ites-center justify-center px-2 py-4 ">
              {menuItems.map((item, index) => (
                <Link key={index} to={item.path}>
                  <div className="flex items-center border-4 border-white-100 py-2 px-3 gap-5 rounded-xl cursor-pointer my-3 bg-[#041954] hover:scale-105 hover:bg-black">
                    {item.icon}
                    <p className="text-white font-bold">{item.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col ites-center justify-center px-1 py-4 mt-10">
              {menuItems.map((item, index) => (
                <Link key={index} to={item.path}>
                  <div className="flex items-center hover:scale-125 my-5">{item.icon}</div>
                </Link>
              ))}
            </div>
          )}

          {/* Logout Button */}
          <div
            className={`flex items-center gap-16 justify-center p-3 rounded-lg flex-end
              
                ${isOpen ? "bg-blue-500 bg-opacity-40 backdrop-blur-sm" : "bg-transparent"}
                text-white`}
            onClick={() => onLogout()}
          >
            {isOpen ? (
              <>
                <FiLogOut size={30} />
                <h2 className="font-bold">Logout</h2>
              </>
            ) : (
              <FiLogOut size={50} />
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 h-screen p-8">
          <Outlet />
        </div>
      </div>

      {/* User Modal */}
      <Modal
        isOpen={openUserModal}
        onRequestClose={() => setOpenUserModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          },
          
        }}
        className="w-1/2"
      >
        <UserDataModal userInfo={userInfo} onClose={() => setOpenUserModal(false)} />
      </Modal>
    </>
  );
};

export default Home;
