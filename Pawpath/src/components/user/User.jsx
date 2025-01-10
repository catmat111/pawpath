import React, { useState, useEffect } from 'react';
import logo from '../../assets/LOGO.png';
import './User.css';
import { useLocation, useNavigate } from "react-router-dom";
import voltar from '../../assets/voltar.png';

export default function User() {
    const [userImage, setUserImage] = useState(null);
    const [userNome, setUserNome] = useState(null);
    const [userPass, setUserPass] = useState(null);
    const [hidden, setHidden] = useState(true);
    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            console.error("ID não fornecido!");
            navigate('/error'); // Redireciona se o ID não for fornecido
            return;
        }

        const fetchUsuarios = async () => {
            const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }

                const data = await response.json();
                const encontrado = data.folha1.find(user => user.id === id);
                if (encontrado) {
                    setUserImage(encontrado.image);
                    setUserNome(encontrado.nome);
                    setUserPass(encontrado.password);
                } else {
                    console.error("Usuário não encontrado.");
                    navigate('/not-found'); // Redireciona se o usuário não for encontrado
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchUsuarios();
    }, [id, navigate]);

    const toggleVisibility = () => setHidden(!hidden);

    const handleImageClick = () => {
        navigate('/Password', { state: { id } });
    };
    const handleVoltarClick = () => {
        navigate('/FeedProcurado', { state: { id } });
};

    return (

        <div className="user-container">
            <img 
                        src={voltar} 
                        onClick={handleVoltarClick} 
                        alt="User" 
                        className="voltar" 
                        
           />
            <div className="top">
                <img src={userImage || logo} alt={userNome || 'Usuário'} className="image" />
                <p className="nome">Bem-vindo, {userNome || 'Usuário'}!</p>
            </div>
            <div className="password-container">
                <p className="password">
                    Palavra pass: {hidden ? '•'.repeat(userPass?.length || 8) : userPass || 'Senha não definida'}
                </p>
                <button onClick={toggleVisibility} className="mostrar">
                    {hidden ? 'Mostrar' : 'Esconder'}
                </button>
            </div>
            <div className="actions">
                <p onClick={handleImageClick}>Alterar a palavra-passe</p>
                <p>Alterar imagem</p>
                <p>Deletar conta</p>
            </div>
        </div>
    );
}
