import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './Password.css'
import voltar_img from '../../assets/voltar.png'

export default function Password() {
    const [userPass, setUserPass] = useState(null);
    const [novaSenha, setNovaSenha] = useState('');
    const location = useLocation();
    const { id } = location.state || {};
    const [hidden, setHidden] = useState(true);
    const navigate = useNavigate();

    const fetchUsuarios = async () => {
        const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
        try {
            const response = await fetch(url);
            console.log("Resposta da API:", response);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            const data = await response.json();
            //encontrar o user do utilisador
            const encontrado = data.folha1.find(user => user.id === id);
            if (encontrado) {
                setUserPass(encontrado.password); //password atual
            } else {
                console.error("Utilizador não encontrado.");  //nao tem um utilizador válido
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [id, navigate]);


    const MudarVisibilidade = () => setHidden(!hidden);

    const Submeter = async (event) => {
        event.preventDefault();
        const confirmSubmit = window.confirm('Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.');
        if (confirmSubmit) {
            try {
                const response = await fetch(`https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ folha1: { password: novaSenha } }),
                });

                if (!response.ok) {
                    throw new Error(`Erro ao atualizar senha: ${response.status}`);
                }

                // Atualiza o estado com a nova senha
                setUserPass(novaSenha);

                alert("Senha atualizada com sucesso!");
            } catch (error) {
                console.error(error);
                alert("Erro ao atualizar a senha.");
            }
        }else{
            alert("Senha não alterada");
        }
    };

    const voltar_botao = () => {
        navigate('/User', { state: { id } });
    };

    return (
        <div className="user-container">
            <img
                src={voltar_img}
                onClick={voltar_botao}
                alt="Voltar"
                className="voltar"
            />
            <div className="password-atual">
                <p className="password">
                    Palavra pass: {hidden ? '•'.repeat(userPass?.length || 0) : userPass}
                </p>
                <button onClick={MudarVisibilidade} className="mostrar">
                    {hidden ? 'Mostrar' : 'Esconder'}
                </button>
            </div>
            <form className="password-mudar" onSubmit={Submeter}>
                <label htmlFor="nova-senha">Nova Senha:</label>
                <input
                    id="nova-senha"
                    type="password"
                    className='input'
                    placeholder="Digite sua nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                />
                <button type="submit">Atualizar Senha</button>
            </form>
        </div>
    );
}
