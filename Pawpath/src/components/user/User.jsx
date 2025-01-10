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

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');

        if (confirmDelete) {
            try {
                // Enviar requisição DELETE para a API
                const response = await fetch(`https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`Erro ao deletar a conta: ${response.status}`);
                }

                alert('Conta deletada com sucesso!');
                navigate('/login'); // Redireciona para a página de login ou página inicial após deletar a conta
            } catch (error) {
                console.error('Erro ao deletar a conta:', error);
                alert('Erro ao deletar a conta. Tente novamente.');
            }
        }
    };

    const handleVoltarClick = () => {
        navigate('/FeedProcurado', { state: { id } });
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

    // Função para lidar com o upload da imagem e validação do tamanho
    const handleImageChange = async (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            // Limite de 50KB para a imagem
            const MAX_SIZE = 50 * 1024; // 50KB

            if (selectedImage.size > MAX_SIZE) {
                alert('A imagem é muito grande. Por favor, escolha uma imagem de até 50KB.');
                return;
            }

            try {
                const base64Image = await convertToBase64(selectedImage);
                setUserImage(base64Image); // Atualiza para a imagem em Base64

                // Atualiza a imagem na API
                const response = await fetch(`https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        folha1: { image: base64Image },
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Erro ao atualizar a imagem: ${response.status}`);
                }

                alert("Imagem atualizada com sucesso!");
            } catch (error) {
                console.error('Erro ao processar a imagem ou atualizar a API:', error);
                alert('Erro ao processar a imagem ou atualizar a API.');
            }
        } else {
            alert('Por favor, selecione uma imagem válida.');
        }
    };

    return (
        <div className="user-container">
            <img 
                src={voltar} 
                onClick={handleVoltarClick} 
                alt="Voltar" 
                className="voltar" 
            />
            <div className="top">
                <img 
                    src={userImage || logo} 
                    alt={userNome || 'Usuário'} 
                    className="image" 
                />
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
                <label className='imagem-input'>
                    Escolher imagem
                    <input
                        className="inputs"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
                <p onClick={handleDeleteClick}>Deletar conta</p>
            </div>
        </div>
    );
}
