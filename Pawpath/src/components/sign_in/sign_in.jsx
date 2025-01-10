import React, { useState, useEffect } from 'react';
import logo from '../../assets/LOGO.png';
import anonimo from '../../assets/anonimo.png';
import './sign_in.css';
import { useNavigate } from "react-router-dom";

export default function Sign_in() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(anonimo); // Inicializando com a imagem 'anonimo'
  const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
  const navigate = useNavigate();
  

  // Função para buscar todos os usuários e calcular o próximo ID
  const getNextId = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const data = await response.json();
      const users = data.folha1; // Supondo que os dados retornados sejam uma lista de usuários

      // Se não houver usuários, o ID começa do 1
      if (users.length === 0) {
        return 1;
      }

      // Encontrar o maior ID e adicionar 1 para o próximo ID
      const maxId = Math.max(...users.map(user => user.id));
      return maxId + 1;
    } catch (error) {
      console.error('Erro ao calcular próximo ID:', error);
      return 1; // Se ocorrer erro, o ID será 1
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

  // Função para verificar se o nome de usuário já existe na base de dados
  const checkIfUserExists = async (name) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao verificar usuário');
      }
      
      const data = await response.json();
      const users = data.folha1; // Supondo que os dados retornados sejam uma lista de usuários

      // Verificar se algum usuário tem o mesmo nome
      const userExists = users.some((user) => user.nome.toLowerCase() === name.toLowerCase());

      return userExists;
    } catch (error) {
      console.error('Erro ao verificar o usuário:', error);
      alert('Erro ao verificar se o nome de usuário já existe.');
      return false; // Retorna falso em caso de erro na requisição
    }
  };

  // Função para fazer o upload da imagem
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Verificar se o nome e senha não estão vazios
    if (!name || !password) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Verificar se o nome de usuário já existe
    const userExists = await checkIfUserExists(name);

    if (userExists) {
      alert('Este nome de usuário já está em uso. Por favor, escolha outro.');
      return;
    }

    // Usando a função getNextId para garantir o incremento sequencial
    const userId = await getNextId();

    const body = {
      folha1: {
        id: userId,
        nome: name,
        password: password,
        image: image // A imagem estará em Base64 ou 'anonimo'
      }
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
      console.log('Usuário criado com sucesso:', json.folha1);
      alert('Conta criada com sucesso!');
      navigate('/Login');
    } catch (error) {
      console.log('Dados enviados:', JSON.stringify(body)); // Verifique o que está sendo enviado
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar conta.');
    }
  };

  // Função para lidar com o upload da imagem e validação do tamanho
  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      // Limite de 1MB para a imagem
      const MAX_SIZE = 50 * 1024; // 1MB

      if (selectedImage.size > MAX_SIZE) {
        alert('A imagem é muito grande. Por favor, escolha uma imagem de até 1MB.');
        return;
      }

      try {
        const base64Image = await convertToBase64(selectedImage);
        setImage(base64Image); // Atualiza para a imagem em Base64
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
      <div >
        <img src={logo} alt="Logo" className="logo"/>
      </div>
      <h2>Crie sua Conta</h2>

      <form onSubmit={handleSubmit}>
        <div className="div-esquerda">
          <img id='anonimo' src={image} alt="Imagem do usuário" />
          {/* Upload da imagem */}
          <label className='imagem-input'>
            Escolher imagem
            <input
              className="inputs"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="div-direita">
          {/* Nome */}
          <input
            className="inputs"
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {/* Senha */}
          <input
            className="inputs"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Botão de enviar */}
          <button type="submit" className="inputs" id="botao">Criar conta</button>
        </div>
      </form>
    </div>
  );
}
