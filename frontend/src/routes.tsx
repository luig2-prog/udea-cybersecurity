import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DeviceManager from "./components/DeviceManager";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/devices" element={<DeviceManager />} />
      <Route path="/" element={<Navigate to="/devices" replace />} />
      <Route path="*" element={<Navigate to="/devices" replace />} />
    </Routes>
  );
};

export default AppRoutes;