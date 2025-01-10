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


    //Fetch 
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

    useEffect(() => {
        if (!id) {
            console.error("ID não fornecido!");
            navigate('/error'); // Redireciona se o ID não for fornecido
            return;
        }
        fetchUsuarios();
    }, [id, navigate]);

    const Mudar_visibilidade = () => setHidden(!hidden);

    const Mudar_password = () => {
        navigate('/Password', { state: { id } });
    };

    //Deletar conta
    const Deletar = async () => {
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

    const voltar_clicar = () => {
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

    // mudar a imagem, só dá para 50Kb
    const Mudar_imagem = async (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            // Limite de 50KB para a imagem
            const MAX_SIZE = 50 * 1024; // 50Kb

            if (selectedImage.size > MAX_SIZE) {
                alert('A imagem é muito grande. Por favor, escolha uma imagem de até 50Kb');
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
                onClick={voltar_clicar} 
                alt="Voltar" 
                className="voltar" 
            />
            <div className="top">
                <img 
                    src={userImage}
                    alt={userNome} 
                    className="image" 
                />
                <p className="nome">Bem-vindo, {userNome}!</p>
            </div>
            <div className="password-container">
                <p className="password">
                    Palavra pass: {hidden ? '•'.repeat(userPass?.length || 8) : userPass}
                </p>
                <button onClick={Mudar_visibilidade} className="mostrar">
                    {hidden ? 'Mostrar' : 'Esconder'}
                </button>
            </div>
            <div className="actions">
                <p onClick={Mudar_password}>Alterar a palavra-passe</p>
                <label className='imagem-input'>
                    Escolher imagem
                    <input
                        className="inputs"
                        type="file"
                        accept="image/*"
                        onChange={Mudar_imagem}
                    />
                </label>
                <p onClick={Deletar}>Deletar conta</p>
            </div>
        </div>
    );
}
