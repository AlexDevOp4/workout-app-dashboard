"use client";

import { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";

export default function Dashboard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { logout } = useAuth();
  const { user } = useUserContext();
  const navigate = useNavigate();

  console.log(user, 'user')

  const handleLogout = async () => {
    // Logout logic here
    try {
      const response = await axios.post(`${apiUrl}/signout`);

      if (response.data) {
        console.log("Logged out successfully:", response.data);
        logout(); // Call your logout handler
        navigate("/signin"); // Redirect to signin
      }
    } catch (error) {
      // Improved error handling
      if (error.response) {
        console.error(
          "Server error:",
          error.response.data.message || error.response
        );
      } else if (error.request) {
        console.error("No response from server:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className="container">
        <h1>Dashboard</h1>
      </div>
    </>
  );
}
