import React, { useState } from 'react';
import logo from '../../assets/LOGO.png'; // Supondo que o logo esteja no mesmo diretório

const Login = () => {
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [erro, setErro] = useState('');

    // Função para fazer o fetch na API
    const fetchUsuarios = async () => {
        const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
        try {
            const response = await fetch(url);
            const data = await response.json();
            setUsuarios(data.folha1S);  // Supondo que "folha1S" é o nome da chave onde os usuários estão armazenados
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    // Função para validar o login
    const validarLogin = (e) => {
        e.preventDefault();

        // Verifica se existe o usuário na base de dados
        const usuario = usuarios.find(user => user.nome === nome && user.password === senha);

        if (usuario) {
            alert('Login bem-sucedido');
            // Redirecionar ou fazer algo após o login bem-sucedido
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
                <form onSubmit={validarLogin}>
                    <div className="bloco_nickName">
                        <input
                            type="text"
                            className="inputs"
                            id="nickName"
                            placeholder="Nome do usuário"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>
                    <div className="bloco_password">
                        <input
                            type="password"
                            className="inputs"
                            id="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="entrar">Entrar</button>
                </form>
                {erro && <div className="erro">{erro}</div>}
            </div>
        </div>
    );
};

export default Login;
