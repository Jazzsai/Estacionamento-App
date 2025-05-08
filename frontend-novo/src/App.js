// src/App.js
import React from "react";
import RegisterVehicle from "./components/RegisterVehicle";
import VehicleHistory from "./components/VehicleHistory";
import VehicleStatus from "./components/VehicleStatus";
import './index.css';

function App() {
  return (
    <div className="container">
      <h1>ESTACIONAMENTO</h1>
      <div className="forms-container">
        <RegisterVehicle />
        <VehicleStatus />
      </div>
      <VehicleHistory />
    </div>
  );
}

export default App;
