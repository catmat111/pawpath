import logo from '../../assets/LOGO.png';
import './sign_in.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
export default function Sign_in() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);
  const SHEETY_API = "https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1"
  
  /*useEffect(() => {
    const fetchSheetData = async () => {
      const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setData(data.folha1); // Adjust key based on actual response
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSheetData();
  }, []);

  useEffect(() => {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].password)      
    }
  }, [data])*/

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Carregar a imagem e obter URL (implemente uploadImage separadamente)
    const imageUrl = await uploadImage(image);

    try {
      await signUp(name, password, imageUrl);
      alert('Conta criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar conta!');
    }
  };
    return (
        <div >
            <div className="logo">
                <img src={logo} />
            </div>
            <h2>Crie sua Conta</h2>
            <form >
                {/* Escolher a imagem */}
                <label  className="custom-file-upload">
                    Escolher imagem
                </label>
                <input
                    className='botao'
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    required
                    
                    />
                {/* Nome do Usuário */}
                <input
                    className='inputs'
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                {/* PassWord */}
                <input
                    className='inputs'
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                {/* Submeter tudo e criar conta */}
                <button type="submit"
                    className="Sign_in" id="botao">Criar conta</button>
            </form>
            

        </div>

    );
}
