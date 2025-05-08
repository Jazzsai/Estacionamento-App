import React, { useState } from "react";
import axios from "axios";
import './RegisterVehicle.css'; // Importando o CSS

function RegisterVehicle() {
  const [plate, setPlate] = useState("");
  const [owner, setOwner] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const clearFields = () => {
    setPlate("");
    setOwner("");
    setModel("");
    setColor("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const plateRegex = /^[A-Z]{3}-[0-9][A-Z][0-9]{2}$/;
    if (!plateRegex.test(plate)) {
      setMessage("O formato da placa deve ser AAA-0A00.");
      setMessageType("error");
      return;
    }

    if (!owner || !model || !color) {
      setMessage("Todos os campos são obrigatórios.");
      setMessageType("error");
      return;
    }

    try {
      // Verificar se o veículo já está registrado
      const checkResponse = await axios.get(`http://127.0.0.1:5001/api/check_vehicle/${plate}`);
      
      // A resposta deve conter um booleano 'exists'
      if (checkResponse.data && checkResponse.data.exists) {
        setMessage("Esse veículo já está registrado no estacionamento.");
        setMessageType("error");
        return;
      }
      
      // Registrar o novo veículo
      const response = await axios.post("http://127.0.0.1:5001/api/register_vehicle", {
        plate,
        owner,
        model,
        color,
        entry_time: new Date().toLocaleString(),
      });

      setMessage(response.data.message);
      setMessageType("success");
      clearFields(); // Limpa os campos após o registro bem-sucedido
    } catch (error) {
      // Diferenciar o erro de verificação de veículo do erro de registro
      if (error.response && error.response.status === 404) {
        setMessage("Erro ao verificar a existência do veículo.");
      } else {
        console.error("Erro ao registrar veículo:", error);
        setMessage("Erro ao registrar veículo.");
      }
      setMessageType("error");
    }
  };

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
    <div className="register-vehicle">
      <h2>REGISTRAR VEÍCULO</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Placa (AAA-0A00)" 
          value={plate} 
          onChange={handlePlateChange} 
          required 
        />
        <input 
          type="text" 
          placeholder="Proprietário" 
          value={owner} 
          onChange={(e) => setOwner(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Modelo" 
          value={model} 
          onChange={(e) => setModel(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Cor" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
          required 
        />
        <button type="submit">Registrar</button>
      </form>
      {message && <p className={`message ${messageType}`}>{message}</p>}
    </div>
  );
}

export default RegisterVehicle;
