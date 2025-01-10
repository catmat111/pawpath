import React, { useState } from 'react';
import logo from '../../assets/LOGO.png'; // Supondo que o logo esteja no mesmo diretório
import './Login.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    // Função para fazer o fetch na API e obter os usuários
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
            setUsuarios(data.folha1 || []);   //colocar Usuarios como um array de elemnros da bd
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    // Função para validar o login
    const validarLogin = (e) => {
        e.preventDefault();

        // Verifica se existe o usuário na base de dados, com o nome e password inseridos
        const usuario = usuarios.find(user => user.nome === nome && user.password === senha);

        if (usuario) {
            alert('Login bem-sucedido'); 
            navigate('/FeedProcurado', { state: { id: usuario.id } }); // Envia o id via estado de navegação
        } else {
            setErro('Nome de usuário ou senha inválidos.');
        }
    };

    // Carrega os dados dos usuários ao montar o componente
    React.useEffect(() => {
        fetchUsuarios();
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
                        placeholder="Nome do usuário"
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
