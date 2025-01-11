import React, { useState, useEffect } from 'react';
import './feed_procurado.css';
import Navbar from '../navbar/navbar.jsx'; 
import { useLocation, useNavigate } from 'react-router-dom';
import lupa from '../../assets/lupa.png'

export default function FeedProcurado() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state;  

    const [posts, setPosts] = useState([]); 
    const [error, setError] = useState(null); 
    const [users, setUsers] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa

    // Fetch dos dados de todos os usuários
    const fetchUsuarios = async () => {
        const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data.folha1);  
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    // Função para buscar todos os posts
    const fetchPosts = async () => {
        const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha2'; 
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erro ao buscar posts: ${response.status}`);
            
            const data = await response.json();
            setPosts(data.folha2);  
        } catch (error) {
            setError("Erro ao carregar os posts.");
            console.error("Erro ao carregar os posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchUsuarios();
    }, []);

    // Função para obter o nome e a imagem do autor com base no ID
    const getUserDetails = (userId) => {
        if (!userId) {
            console.log("ID do usuário não fornecido.");
            return { nome: 'Desconhecido', imagem: 'default-image-url' };
        }

        const user = users.find(user => user.id === userId);
        if (user) {
            return { nome: user.nome, imagem: user.image };
        } else {
            return { nome: 'Desconhecido', imagem: 'default-image-url' };
        }
    };

    // Função para filtrar os posts com base no nome do pet ou do usuário
    const filteredPosts = posts.filter((post) => {
        const { nome: userName } = getUserDetails(post.iduti);
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
            post.nome.toLowerCase().includes(lowercasedSearchTerm) || 
            userName.toLowerCase().includes(lowercasedSearchTerm)
        );
    });

    return (
        <div className="feed-container">
            <Navbar id={id} />
            <div className="search-container">
                <img className='lupa'src={lupa}></img>
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Pesquisar por nome do pet ou utilizador..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de pesquisa
                />
            </div>
            <div className="posts-container">
                {error && <p className="error">{error}</p>}
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => {
                        const { nome, imagem } = getUserDetails(post.iduti);
                        return (
                            <div key={post.id} className="post">
                                <div className="post-header">
                                    <img src={imagem} alt="Imagem do autor" className="post-author-image" />
                                    <h3 className="post-author-name">{nome}</h3>
                                </div>
                                <div className="post-content">
                                    <img src={post.imagem} alt="Imagem do post" className="post-image" />
                                    <p>Nome: {post.nome}</p>
                                    <p>{post.texto}. De cor:</p>
                                    <div style={{ backgroundColor: post.cor }} className="cor" />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Nenhum post encontrado.</p> 
                )}
            </div>
        </div>
    );
}
