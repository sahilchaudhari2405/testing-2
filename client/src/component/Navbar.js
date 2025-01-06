// src/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaTruck, FaBox,FaPersonBooth, FaShoppingCart, FaEye, FaUser, FaFileAlt, FaEnvelope, FaExchangeAlt, FaCog, FaBuilding, FaUsersCog } from 'react-icons/fa';
import Moment from 'react-moment';
import { FaImage } from "react-icons/fa6";
import axiosInstance from '../axiosConfig';


const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const [Name, setFinalName] = useState("");

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate]);
  useEffect(() => {
    const data = localStorage.getItem("invoiceSettings");
    if (data) {
      try {
        const parsedData = JSON.parse(data); // Parse the string into an object
        setFinalName(parsedData.language?.english?.title || ""); // Safely access the nested address
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    } else {
      console.warn("No data found in localStorage");
    }
  }, [Name]);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get("/users/setting");
        const fetchedData = response.data.data;
        if (fetchedData) {
          localStorage.setItem("invoiceSettings", JSON.stringify(fetchedData));
          setFinalName(fetchedData.language?.english?.title || "");
        } else {
          console.error("No settings data found");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
  
    const data = localStorage.getItem("invoiceSettings");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setFinalName(parsedData.language?.english?.title || "");
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    } else {
      console.warn("No data found in localStorage, fetching from API...");
      fetchSettings();
    }
  }, [Name]); 
  return (
    <div className="bg-gray-800 fixed top-0 z-50 w-full p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-6">
        <div className="text-white text-3xl font-bold">{Name}<span className="text-blue-300"></span></div>
        <div className="flex space-x-6">
          <NavItem icon={<FaTachometerAlt className="text-yellow-400" />} label="Dashboard" to="/dashboard" />
          <NavItem icon={<FaTruck className="text-green-400" />} label="Purchase" to="/purchase" />
          <NavItem icon={<FaBox className="text-red-400" />} label="Inventory" to="/inventory" />
          <NavItem icon={<FaUser className="text-purple-400" />} label="OnGoing sales" to="/OngoingSales" />

          <NavItem icon={<FaShoppingCart className="text-orange-400" />} label="Sales" to="/sales" />
          <NavItem icon={<FaEye className="text-teal-400" />} label="View" to="/view" />
           <NavItem icon={<FaUser className="text-purple-400" />} label="Accounts" to="/admin/accounts" />
           <NavItem icon={<FaUser className="text-purple-400" />} label="Client" to="/admin/client" />
          {/*<NavItem icon={<FaFileAlt className="text-pink-400" />} label="Reports" to="/reports" />
          <NavItem icon={<FaEnvelope className="text-blue-400" />} label="Msg" to="/msg" />
          <NavItem icon={<FaExchangeAlt className="text-indigo-400" />} label="Import" to="/import" />
          <NavItem icon={<FaCog className="text-gray-400" />} label="More" to="/more" />
          <NavItem icon={<FaBuilding className="text-yellow-400" />} label="Company" to="/company" /> */}
          <NavItem icon={<FaPersonBooth className="text-blue-400" />} label="admin" to="/admin" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-white text-sm">
          <Moment format="DD-MM-YYYY">{currentTime}</Moment>
        </div>
        <div className="text-white text-sm">
          <Moment format="HH:mm:ss">{currentTime}</Moment>
        </div>
        <NavItem icon={<FaUsersCog className="text-purple-400" />} label="Users" to="/admin/users" />
        <NavItem icon={<FaCog className="text-gray-400" />} label="Settings" to="/settings" />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to }) => {
  return (
    <Link to={to} className="flex flex-col items-center group cursor-pointer transition transform hover:scale-110">
      <div className="mb-1">{icon}</div>
      <span className="text-white text-sm">{label}</span>
    </Link>
  );
};

export default Navbar;
