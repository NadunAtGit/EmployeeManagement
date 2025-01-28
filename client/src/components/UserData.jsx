import React from "react";
import user from "../assets/user.jpg";

const UserData = ({ username,email,imgUrl }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      {/* User Avatar */}
      <div className="w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden my-4">
        <img
          src={imgUrl || user}
          className="w-full h-full object-cover"
          alt="User Avatar"
        />
      </div>

      {/* User Details */}
      <div className="flex flex-col items-center py-2">
        <h2 className="text-white font-semibold">{username}</h2>
        <p className="text-gray-400">{email}</p>
      </div>
    </div>
  );
};

export default UserData;
