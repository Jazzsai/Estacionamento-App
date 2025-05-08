// src/components/VehicleHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import './VehicleHistory.css';

function VehicleHistory() {
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");
  const [qrData, setQrData] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5001/api/vehicle_history");
      console.log("Dados recebidos:", response.data);

      if (response.data.history && Array.isArray(response.data.history)) {
        const formattedData = response.data.history.map((item) => ({
          id: item[0],
          plate: item[1],
          owner: item[2],
          model: item[3],
          color: item[4],
          entry_time: item[5],
          exit_time: item[6],
          paid: item[7],
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

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleExit = async (plate) => {
    try {
      const response = await axios.post("http://127.0.0.1:5001/api/exit_vehicle", {
        plate: plate,
        exit_time: new Date().toLocaleString(),
        paid: true,
      });
      setMessage(response.data.message);

      const receiptData = {
        plate,
        status: "PAGO",
        exitTime: new Date().toLocaleString(),
      };
      setQrData(receiptData);
      generatePdf(receiptData);
      
      fetchHistory();
    } catch (error) {
      setMessage("Erro ao registrar saída.");
      console.error("Erro:", error);
    }
  };

  const generatePdf = (data) => {
    const doc = new jsPDF();
    doc.text(`Placa: ${data.plate}`, 10, 10);
    doc.text(`Status: ${data.status}`, 10, 20);
    doc.text(`Data e Hora da Saída: ${data.exitTime}`, 10, 30);
    doc.save(`comprovante_${data.plate}.pdf`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="vehicle-history">
      <h2>HISTÓRICO DE VEÍCULOS</h2>
      <table>
        <thead>
          <tr>
            <th>Proprietário</th>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Entrada</th>
            <th>Saída</th>
            <th>Status</th>
            <th>Registrar Saída</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.owner}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.plate}</td>
                <td className="datetime-cell">{formatDate(vehicle.entry_time)}</td>
                <td className="datetime-cell">
                  {vehicle.exit_time ? formatDate(vehicle.exit_time) : "-"}
                </td>
                <td>
                  {vehicle.exit_time ? (
                    <span className="status-badge status-paid">PAGO</span>
                  ) : (
                    "Em aberto"
                  )}
                </td>
                <td>
                  {!vehicle.exit_time && (
                    <button 
                      className="exit-button" 
                      onClick={() => handleExit(vehicle.plate)}
                      title="Registrar saída"
                    >
                      🚗💨
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Nenhum veículo encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
      {message && <p className="message">{message}</p>}
      
      {qrData && (
        <div className="qrcode-container">
          <h3>Comprovante de Saída</h3>
          <QRCodeSVG value={JSON.stringify(qrData)} size={128} />
          <p>Escaneie o QR Code para visualizar o comprovante</p>
        </div>
      )}
    </div>
  );
}

export default VehicleHistory;
