import React, { useState, useEffect } from 'react';
import './navbar.css';
import logo from '../../assets/LOGO.png'; // Supondo que o logo esteja no mesmo diretório

const Navbar = (id) => {
    const [userImage, setUserImage] = useState(null); // Estado para armazenar a imagem do usuário
    const [loading, setLoading] = useState(true);  // Estado de carregamento
    const [error, setError] = useState(null); // Estado para capturar erros

    useEffect(() => {
        const fetchData = async () => {
            const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';

            try {
                const response = await fetch(url);

                // Verifica se a requisição foi bem-sucedida
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status}`);
                }

                const json = await response.json();
                console.log('Resposta da API:', json); // Log da resposta
                console.log(id)
                // Verifica se a chave 'folha1S' existe e é um array
                if (json.folha1S && Array.isArray(json.folha1S)) {
                    console.log('Usuários:', json.folha1S);

                    // Encontra o usuário com base no id
                    const user = json.folha1S.find(user => user.id === id);


                    setUserImage(user.image); // Armazena a imagem do usuário

                } else {
                    setError('Dados não encontrados ou a chave "folha1S" não é um array');
                }

                setLoading(false); // Desativa o estado de carregamento
            } catch (err) {
                console.error('Erro ao buscar dados da API:', err);
                setError(err.message); // Define o erro no estado
                setLoading(false); // Desativa o estado de carregamento
            }
        };

        fetchData(); // Chama a função para realizar o fetch
    }, [id]); // Dependência do id, refaz a requisição se o id mudar


    return (
        <nav className='navbar'>
            <div className="navbar-left">
                <img src={logo} alt='logo' className="logo" />
            </div>
            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <a href="/FeedProcurado">Procura-se</a>
                    </li>
                    <li>
                        <a href="/Encontrei um animal">Encontrou-se</a>
                    </li>
                </ul>
            </div>
            <div className="navbar-right">
                {/* Exibe a imagem do usuário, se disponível */}
                <img src={userImage} alt="User" className="user-image" />
            </div>
        </nav>
    );
};

export default Navbar;
