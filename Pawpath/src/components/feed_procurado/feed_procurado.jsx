import React, { useState, useEffect } from 'react';
import './feed_procurado.css';
import Navbar from '../navbar/navbar.jsx';
import { useLocation } from 'react-router-dom';
import lupa from '../../assets/lupa.png';

export default function FeedProcurado() {
    const location = useLocation();
    const { id } = location.state; // Remova o 'w' indesejado aqui
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null); // Estado para o post selecionado

    const apiUsuarios = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
    const apiPosts = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha2';

    // Fetch dos dados de usuários
    const fetchUsuarios = async () => {
        try {
            const response = await fetch(apiUsuarios);
            if (!response.ok) throw new Error(`Erro ao buscar usuários: ${response.status}`);
            const data = await response.json();
            setUsers(data.folha1 || []);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    };

    // Fetch dos posts
    const fetchPosts = async () => {
        try {
            const response = await fetch(apiPosts);
            if (!response.ok) throw new Error(`Erro ao buscar posts: ${response.status}`);
            const data = await response.json();
            setPosts(data.folha2 || []);
        } catch (error) {
            setError('Erro ao carregar os posts.');
            console.error('Erro ao carregar os posts:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchPosts();
    }, []);

    // Obter detalhes do usuário com base no ID
    const getUserDetails = (userId) => {
        const user = users.find((user) => user.id === userId);
        return {
            nome: user?.nome || 'Desconhecido',
            imagem: user?.image || 'path/to/default-image.png',
        };
    };

    // Atualizar o atributo "encontrado" na API
    const updateEncontrado = async (postId, currentValue) => {
        try {
            console.log('Atualizando post:', postId, 'Valor atual encontrado:', currentValue);

            const response = await fetch(`${apiPosts}/${postId}`, {
                method: 'PUT', // PATCH ou PUT, dependendo do suporte da API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folha2: { encontrado: currentValue + 1 }, // Incrementa o valor atual
                }),
            });

            if (!response.ok) throw new Error(`Erro ao atualizar post: ${response.status}`);

            const responseData = await response.json();
            console.log('Resposta da API:', responseData);

            // Atualiza o estado local após sucesso
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, encontrado: currentValue + 1 } : post
                )
            );
        } catch (error) {
            console.error('Erro ao atualizar o atributo "encontrado":', error);
        }
    };

    // Atualizar o post selecionado
    const handlePostClick = (postId) => {
        setSelectedPostId(postId === selectedPostId ? null : postId);
    };

    // Filtrar posts com base no termo de pesquisa
    const filteredPosts = posts.filter((post) => {
        const { nome: userName } = getUserDetails(post.iduti);
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
            post?.nome?.toLowerCase().includes(lowercasedSearchTerm) ||
            userName?.toLowerCase().includes(lowercasedSearchTerm)
        );
    });

    return (
        <div className="feed-container">
            <Navbar id={id} />
            <div className="search-container">
                <img className="lupa" src={lupa} alt="Ícone de pesquisa" />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Pesquisar por nome do pet ou utilizador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="posts-container">
                {error && <p className="error">{error}</p>}
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => {
                        const { nome, imagem } = getUserDetails(post.iduti);
                        return (
                            <div
                                key={post.id}
                                className="post"
                                onClick={() => handlePostClick(post.id)} // Atualiza o post selecionado
                            >
                                <div className="post-header">
                                    <img
                                        src={imagem}
                                        alt={`Imagem de ${nome}`}
                                        className="post-author-image"
                                    />
                                    <h3 className="post-author-name">{nome}</h3>
                                </div>
                                <div className="post-content">
                                    <img
                                        src={post.imagem || 'path/to/default-post-image.png'}
                                        alt={`Imagem do post de ${post.nome}`}
                                        className="post-image"
                                    />
                                    <p>Nome: {post.nome}</p>
                                    <p>{post.texto || 'Descrição não fornecida.'} </p>
                                    <p>Cor:</p>
                                    <div
                                        style={{ backgroundColor: post.cor }}
                                        className="cor"
                                    />
                                    <p>Encontrado: {post.encontrado || 0} vezes</p>
                                </div>
                                {/* Mostrar o botão apenas para o post selecionado */}
                                {selectedPostId === post.id && (
                                    <button
                                        id="botao"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evitar conflito com clique no post
                                            updateEncontrado(post.id, post.encontrado || 0);
                                        }}
                                    >
                                        Encontrei
                                    </button>
                                )}
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
