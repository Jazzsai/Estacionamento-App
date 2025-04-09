// src/components/VehicleHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import './VehicleHistory.css';

function VehicleHistory() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/vehicle_history");
        console.log("Dados recebidos:", response.data); // Para ver o retorno da API

        // Verifica se a resposta contém um array de histórico
        if (response.data.history && Array.isArray(response.data.history)) {
          const formattedData = response.data.history.map((item) => ({
            id: item[0],                  // ID do veículo
            plate: item[1],               // Placa
            owner: item[2],               // Proprietário
            model: item[3],               // Modelo
            color: item[4],               // Cor
            entry_time: item[5],          // Hora de entrada
            exit_time: item[6],           // Hora de saída
            paid: item[7],                // Pagamento
          }));
          setVehicles(formattedData);
        } else {
          console.warn("Estrutura de dados inesperada:", response.data);
          setVehicles([]);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico de veículos:", error);
        setVehicles([]);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Histórico de Veículos</h2>
      <table>
        <thead>
          <tr>
            <th>Placa</th>
            <th>Proprietário</th>
            <th>Modelo</th>
            <th>Cor</th>
            <th>Entrada</th>
            <th>Saída</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.plate}</td>
                <td>{vehicle.owner}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.color}</td>
                <td>{vehicle.entry_time}</td>
                <td>{vehicle.exit_time || "N/A"}</td>
                <td>{vehicle.paid ? "Sim" : "Não"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nenhum veículo encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleHistory;
