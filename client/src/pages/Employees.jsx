import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { AiOutlineInfoCircle, AiOutlineDelete } from "react-icons/ai";
import { FiRefreshCcw, FiPlus } from "react-icons/fi";
import axiosInstance from "../utils/axiosInstance";
import Modal from "react-modal";

import AddEmpModal from "../components/AddEmpModal";
import UpdateEmpModel from "../components/UpdateEmpModel";
import UserDataModal from "../components/UserDataModal";
import { isSession } from "react-router-dom";

const Employees = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [openAddModal, setOpenAddModal] = useState({
    isShown: false,
    data: null,
  });

  const [openUpdateModal, setOpenUpdateModal] = useState({
    isShown: false,
    data: null,
  });
  const [openUserModal, setOpenUserModal] = useState({
    isShown:false,
    data:null
  });

  const onCloseAdd = () => {
    setOpenAddModal({ isShown: false, data: null });
    
  };

  const onCloseUpdate = () => {
    setOpenUpdateModal({ isShown: false, data: null });
  };

  const onCloseUser = () => {
    setOpenUserModal({ isShown: false, data: null });
    
  };

  const openUserModalHandler = (employee) => {
    // Open the modal with employee data
    setOpenUserModal({ isShown: true, data: employee });
  };

  

  const getEmployeeData = async () => {
    try {
      const response = await axiosInstance.get("/get-all-employees");
      if (response.data?.employees) {
        setAllEmployees(response.data.employees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Delete an employee
  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete(`/delete-employee/${id}`);
      if (response.data?.error === false) {
        alert(response.data.message);
        setAllEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee._id !== id)
        );
      } else {
        alert(response.data.message || "Failed to delete the employee.");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee.");
    }
  };

  const searchEmployees = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/search?query=${searchQuery}`);
      if (response.data?.results) {
        setAllEmployees(response.data.results);
      }
    } catch (error) {
      console.error("Error searching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeData();
  }, []);

  return (
    <>
      <div className="container mx-auto py-10 sm:overflow-hidden">
        <div className="w-full flex justify-center flex-col">
          <div className="mb-6">
            <h1 className="text-black font-bold text-3xl border-b-2 inline border-gray-400">
              Employee Data
            </h1>
          </div>

          <div className="w-full flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by username, department, or role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none border-b-2 border-gray-400 py-2 px-4"
            />
            <button
              onClick={searchEmployees}
              disabled={isLoading}
              className={`flex items-center gap-2 border-blue-600 border-3 p-2 rounded-2xl text-white bg-gradient-to-b from-[#5b7ad2] to-[#1e429f] ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiSearch size={22} />
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="overflow-x-scroll md:overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-[#5b7ad2] text-white">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Salary</th>
                  <th className="py-3 px-4 text-left">Operations</th>
                </tr>
              </thead>
              <tbody>
                {allEmployees.map((employee) => (
                  <tr key={employee._id} className="border-b">
                    <td className="py-3 px-4">{employee.name}</td>
                    <td className="py-3 px-4">{employee.email}</td>
                    <td className="py-3 px-4">{employee.role}</td>
                    <td className="py-3 px-4">{employee.department}</td>
                    <td className="py-3 px-4">{employee.phone}</td>
                    <td className="py-3 px-4">
                      ${employee.salary.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 flex gap-3">
                      <AiOutlineInfoCircle
                        className="text-blue-500 cursor-pointer"
                        size={22}
                        onClick={() =>
                          setOpenUserModal({ isShown: true, data: employee })
                        }
                      />
                      <FiRefreshCcw
                        className="text-yellow-500 cursor-pointer"
                        size={22}
                        onClick={
                          () => setOpenUpdateModal({isShown:true,data:employee})
                        }
                      />
                      <AiOutlineDelete
                        className="text-red-500 cursor-pointer"
                        size={22}
                        onClick={() => deleteEmployee(employee._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="fixed bottom-10 right-10 w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-lg 
             border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white transition-all duration-300 cursor-pointer"
            onClick={() => setOpenAddModal({ isShown: true, data: null })}
          >
            <FiPlus size={30} />
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={openAddModal.isShown}
        onRequestClose={onCloseAdd}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        className="model-box"
      >
        <AddEmpModal onClose={onCloseAdd} getAllEmployees={getEmployeeData} />
      </Modal>

      {/* Update Employee Modal */}
      <Modal
        isOpen={openUpdateModal.isShown}
        onRequestClose={onCloseUpdate}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        className="model-box"
      >
        <UpdateEmpModel
          onClose={onCloseUpdate}
          employeeData={openUpdateModal.data}
          getAllEmployees={getEmployeeData}
        />
      </Modal>

      <Modal
            isOpen={openUserModal.isShown}  // Correct the condition here
            onRequestClose={() => setOpenUserModal({ isShown: false, data: null })}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                zIndex: 999,
              },
            }}
            className="w-1/2"
      >
            <UserDataModal
              userInfo={openUserModal.data}
              onClose={onCloseUser}
            />
      </Modal>

    </>
  );
};

export default Employees;
