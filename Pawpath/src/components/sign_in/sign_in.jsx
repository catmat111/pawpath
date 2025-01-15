import React, { useState } from 'react';
import logo from '../../assets/LOGO.png';
import anonimo from '../../assets/anonimo.png';
import './sign_in.css';
import { useNavigate } from "react-router-dom";

export default function Sign_in() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(anonimo); // Imagem padrão
  const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
  const navigate = useNavigate();

  // Função para buscar todos os utilizadores e calcular o próximo ID
  const getNextId = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const data = await response.json();
      const users = data.folha1;

      if (users.length === 0) {
        return 1; // ID inicial
      }

      const maxId = Math.max(...users.map(user => user.id));
      return maxId + 1;
    } catch (error) {
      console.error('Erro ao calcular próximo ID:', error);
      return 1;
    }
  };

  // Função para converter imagem em Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Função para verificar se o nome de utilisador já existe na base de dados
  const validar_utilizador = async (name) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao verificar utilisador');
      }

      const data = await response.json();
      const users = data.folha1;

      return users.some((user) => user.nome.toLowerCase() === name.toLowerCase());
    } catch (error) {
      console.error('Erro ao verificar o utilisador:', error);
      alert('Erro ao verificar se o nome de utilisador já existe.');
      return false;
    }
  };

  // Submeter os dados do formulário
  const Submeter = async (e) => {
    e.preventDefault();

    if (!name || !password) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const userExists = await validar_utilizador(name);

    if (userExists) {
      alert('Este nome já está a ser utilizado. Por favor, escolha outro.');
      return;
    }

    const userId = await getNextId();
    const body = {
      folha1: {
        id: userId,
        nome: name,
        password: password,
        image: image, // Certifique-se de que a API aceita imagens em Base64
      },
    };

    

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const json = await response.json();
      console.log('Utilisador criado com sucesso:', json.folha1);
      alert('Conta criada com sucesso!');
      navigate('/Login');
    } catch (error) {
      console.error('Erro ao criar utilisador:', error);
      alert('Erro ao criar conta.');
    }
  };

  // Mudar a imagem padrão
  const Mudar_imagem = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const MAX_SIZE = 40 * 1024; // Limite de 40Kb

      if (selectedImage.size > MAX_SIZE) {
        alert('A imagem é muito grande. Por favor, escolha uma imagem de até 40Kb');
        return;
      }

      try {
        const base64Image = await convertToBase64(selectedImage);
        setImage(base64Image); // Atualiza a imagem em Base64
      } catch (error) {
        console.error('Erro ao processar a imagem:', error);
        alert('Erro ao processar a imagem.');
      }
    } else {
      alert('Por favor, selecione uma imagem válida.');
    }
  };

  return (
    <div>
      <div>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2>Crie sua Conta</h2>

      <form className="form_signin" onSubmit={Submeter}>
        <div className="div-esquerda">
          <label className="imagem-input">
            <img id="anonimo" src={image} alt="Imagem do utilisador" />
            Escolha uma imagem
            <input
              className="inputs"
              type="file"
              accept="image/*"
              onChange={Mudar_imagem}
            />
          </label>
        </div>
        <div className="div-direita">
          <input
            className="inputs"
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="inputs"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="inputs" id="botao">Criar conta</button>
        </div>
      </form>
    </div>
  );
}
