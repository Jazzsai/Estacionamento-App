// src/App.js
import React from "react";
import RegisterVehicle from "./components/RegisterVehicle";
import VehicleHistory from "./components/VehicleHistory";
import ExitVehicle from "./components/ExitVehicle";
import VehicleStatus from "./components/VehicleStatus";

function App() {
  return (
    <div className="container">
      <h1><center>Estacionamento</center></h1>
      <RegisterVehicle />
      <ExitVehicle />
      <VehicleStatus />
      <VehicleHistory />
    </div>
  );
}

export default App;
