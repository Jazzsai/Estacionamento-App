import React, { useState } from "react";
import axios from "axios";
import './VehicleStatus.css';

function VehicleStatus() {
  const [plate, setPlate] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://127.0.0.1:5001/api/vehicle_status/${plate}`);
      setStatusMessage(response.data.message);
    } catch (error) {
      setStatusMessage("Erro ao consultar status do veículo.");
      console.error("Erro:", error);
    }
  };

  // Função para formatar a placa no padrão AAA-0A00
  const handlePlateChange = (e) => {
    const inputValue = e.target.value.toUpperCase(); // Converter para maiúsculas
    let formattedValue = inputValue.replace(/[^A-Z0-9]/g, ""); // Remover caracteres inválidos

    // Inserir o hífen no quarto caractere se o comprimento for maior que 3
    if (formattedValue.length > 3) {
      formattedValue = formattedValue.slice(0, 3) + "-" + formattedValue.slice(3);
    }

    // Limitar o comprimento total a 7 (incluindo o hífen)
    if (formattedValue.length <= 8) {
      setPlate(formattedValue);
    }
  };

  return (
    <div className="vehicle-status-container">
      <h2>Consultar Histórico de Veículos</h2>
      <form onSubmit={handleCheckStatus}>
        <input 
          type="text"
          placeholder="Digite a placa do veículo (AAA-0A00)"
          value={plate}
          onChange={handlePlateChange} // Aplicar a formatação aqui
          required
        />
        <button type="submit">Consultar</button>
      </form>
      <p>{statusMessage}</p>
    </div>
  );
}

export default VehicleStatus;
