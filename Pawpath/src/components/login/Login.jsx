import React, { useState } from 'react';
import logo from '../../assets/LOGO.png'; // Supondo que o logo esteja no mesmo diretório
import './Login.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [utilisadores, setUtilisadores] = useState([]);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    // Função para fazer o fetch na API e obter os utilisadores
    const fetchUtilisadores = async () => {
        const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
        try {
            const response = await fetch(url);
            console.log("Resposta da API:", response);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            const data = await response.json();
            console.log("Dados recebidos:", data);
            setUtilisadores(data.folha1 || []);   //colocar Utilisadores como um array de elemnros da bd
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    // Função para validar o login
    const validarLogin = (e) => {
        e.preventDefault();

        // Verifica se existe o utilisador na base de dados, com o nome e password inseridos
        const utilisador = utilisadores.find(user => user.nome === nome && user.password === senha);

        if (utilisador) {
            alert('Login bem-sucedido'); 
            navigate('/FeedProcurado', { state: { id: utilisador.id } }); // Envia o id via estado de navegação
        } else {
            setErro('Nome de utilisador ou senha inválidos.');
        }
    };

    // Carrega os dados dos utilisadores ao montar o componente
    React.useEffect(() => {
        fetchUtilisadores();
    }, []);

    return (
        <div>
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="bloco_login">
                <form onSubmit={validarLogin} id="login">
                    <input
                        type="text"
                        className="inputs"
                        id="nickName"
                        placeholder="Nome do utilisador"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <input
                        type="password"
                        className="inputs"
                        id="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <button type="submit" className="inputs" id="botao">Entrar</button>
                </form>
                {erro && <div className="erro">{erro}</div>}
            </div>
        </div>
    );
};

export default Login;
