"use client";
import axios from "axios";
import React, { useEffect } from "react";

function AdminDashboard() {
  const handleGetData = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      console.log("data1111", data);
    } catch (error) {
      console.log("first", error);
    }
  };
  useEffect(() => {
    handleGetData();
  }, []);
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200"></div>
  );
}

export default AdminDashboard;
