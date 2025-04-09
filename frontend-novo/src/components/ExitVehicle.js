import React, { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react"; // Alterado para QRCodeSVG
import jsPDF from "jspdf";
import './ExitVehicle.css'; // Importando o CSS

function ExitVehicle() {
  const [plate, setPlate] = useState("");
  const [message, setMessage] = useState("");
  const [qrData, setQrData] = useState(null);

  const handleExit = async (e) => {
    e.preventDefault();

    const plateRegex = /^[A-Z]{3}-[0-9][A-Z][0-9]{2}$/;
    if (!plateRegex.test(plate)) {
      setMessage("O formato da placa deve ser AAA-0A00.");
      return;
    }

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

  const handlePlateChange = (e) => {
    const inputValue = e.target.value.toUpperCase();
    let formattedValue = inputValue.replace(/[^A-Z0-9]/g, "");

    if (formattedValue.length > 3) {
      formattedValue = formattedValue.slice(0, 3) + "-" + formattedValue.slice(3);
    }

    if (formattedValue.length <= 8) {
      setPlate(formattedValue);
    }
  };

  return (
    <div className="exit-vehicle">
      <h2>Registrar Saída de Veículo</h2>
      <form onSubmit={handleExit}>
        <input 
          type="text"
          placeholder="Placa (AAA-0A00)"
          value={plate}
          onChange={handlePlateChange}
          required
        />
        <button type="submit">Registrar Saída</button>
      </form>
      <p className="message">{message}</p>
      
      {qrData && (
        <div>
          <h3>Comprovante de Saída:</h3>
          <QRCodeSVG value={JSON.stringify(qrData)} size={128} /> {/* Usar QRCodeSVG */}
          <p>Escaneie o QR Code para visualizar o comprovante.</p>
        </div>
      )}
    </div>
  );
}

export default ExitVehicle;
