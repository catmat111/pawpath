import React, { useState, useEffect } from 'react';
import logo from '../../assets/LOGO.png';
import './User.css';
import { useLocation } from "react-router-dom";

export default function User() {
    const [userImage, setUserImage] = useState(null); // Estado para armazenar a imagem do usuário
    const [userNome, setUserNome] = useState(null);
    const [userPass, setUserPass] = useState(null);
    const location = useLocation(); // Recupera o estado da navegação
    const { id } = location.state || {}; // Extrai o `id` do estado da navegação
    const [hidden, setHidden] = useState(true); // Controle de visibilidade da senha

    useEffect(() => {
        if (!id) {
            console.error("ID não fornecido!");
            return;
        }

        const fetchUsuarios = async () => {
            const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
            try {
                const response = await fetch(url);
                console.log("Resposta da API:", response);

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }

                const data = await response.json();
                console.log("Dados recebidos:", data);

                // Procurar o usuário diretamente nos dados retornados
                const encontrado = data.folha1.find(user => user.id === id);
                console.log("Usuário encontrado:", encontrado);

                // Atualizar o estado do usuário e a imagem
                if (encontrado) {
                    setUserImage(encontrado.image);
                    setUserNome(encontrado.nome);
                    setUserPass(encontrado.password);
                } else {
                    console.error("Usuário não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchUsuarios();
    }, [id]); // Dependência do id

    // Função para alternar visibilidade da senha
    const toggleVisibility = () => {
        setHidden(!hidden);
    };

    return (
        <div className="user-container">
            <div className="top">
                <img src={userImage} alt={userNome} className="image" />
                <p className="nome">Bem-vindo, {userNome}!</p>
            </div>
            <div className="password-container">
                <p className="password">
                    Palavra pass: {hidden ? '•'.repeat(userPass?.length || 0) : userPass}
                </p>
                <button onClick={toggleVisibility} className="mostrar">
                    {hidden ? 'Mostrar' : 'Esconder'}
                </button>
            </div>
            <div className="actions">
                <p>Alterar a palavra-passe</p>
                <p>Alterar imagem</p>
                <p>Deletar conta</p>
            </div>
        </div>
    );
}
