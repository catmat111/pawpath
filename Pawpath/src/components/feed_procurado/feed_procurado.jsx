import React, { useState, useEffect } from 'react';
import './feed_procurado.css';
import Navbar from '../navbar/navbar.jsx';
import { useLocation } from 'react-router-dom';
import lupa from '../../assets/lupa.png';

export default function FeedProcurado() {
    const location = useLocation();
    const { id } = location.state;

    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [comentarios, setComentarios] = useState({});
    const [allComentarios, setAllComentarios] = useState([]);
    
    const apiUsuarios = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
    const apiPosts = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha2';
    const apiComentarios = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha3';

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

    const fetchComentarios = async () => {
        try {
            const response = await fetch(apiComentarios);
            if (!response.ok) throw new Error(`Erro ao buscar comentários: ${response.status}`);
            const data = await response.json();
            setAllComentarios(data.folha3 || []);
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchPosts();
        fetchComentarios();
    }, []);

    const getUserDetails = (userId) => {
        const user = users.find((user) => user.id === userId);
        return {
            nome: user?.nome || 'Desconhecido',
            imagem: user?.image || 'path/to/default-image.png',
        };
    };

    const updateEncontrado = async (postId, currentValue) => {
        try {
            const response = await fetch(`${apiPosts}/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    folha2: { encontrado: currentValue + 1 },
                }),
            });

            if (!response.ok) throw new Error(`Erro ao atualizar post: ${response.status}`);

            const responseData = await response.json();
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, encontrado: currentValue + 1 } : post
                )
            );
        } catch (error) {
            console.error('Erro ao atualizar o atributo "encontrado":', error);
        }
    };

    const addComentario = async (idPost, idUsuario, comentario) => {
        if (!idUsuario || !idPost || !comentario) {
            console.error("Dados inválidos para adicionar comentário:", { idUsuario, idPost, comentario });
            return;
        }

        try {
            const payload = {
                folha3: {
                    iduti: idUsuario,
                    idpost: idPost,
                    comentario: comentario,
                },
            };

            const response = await fetch(apiComentarios, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`Erro ao adicionar comentário: ${response.status}`);

            const data = await response.json();
            setAllComentarios((prev) => [...prev, data.folha3]);
        } catch (error) {
            console.error('Erro ao adicionar o comentário:', error);
        }
    };

    const handleComentarioChange = (postId, value) => {
        setComentarios((prev) => ({
            ...prev,
            [postId]: value,
        }));
    };

    const handlePostClick = (postId) => {
        setSelectedPostId(postId === selectedPostId ? null : postId);
    };

    const filteredPosts = posts.filter((post) => {
        const { nome: userName } = getUserDetails(post.iduti);
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
            post?.nome?.toLowerCase().includes(lowercasedSearchTerm) ||
            userName?.toLowerCase().includes(lowercasedSearchTerm)
        );
    });

    const renderComentarios = (postId) => {
        const comentariosDoPost = allComentarios.filter((comentario) => comentario.idpost === postId);
        return comentariosDoPost.map((comentario, index) => (
            <div key={index} className="comentario">
                <p><strong>{getUserDetails(comentario.iduti).nome}:</strong> {comentario.comentario}</p>
            </div>
        ));
    };

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
                                className={`post ${selectedPostId === post.id ? 'selected' : ''}`}
                                onClick={() => handlePostClick(post.id)}
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
                                    <p>{post.texto || 'Descrição não fornecida.'}</p>
                                    <p>Cor:</p>
                                    <div
                                        style={{ backgroundColor: post.cor }}
                                        className="cor"
                                    />
                                    <p>Comentado: {post.encontrado || 0} {post.encontrado === 1 ? 'vez' : 'vezes'}</p>
                                </div>
                                {selectedPostId === post.id && (
                                    <div onClick={(e) => e.stopPropagation()} className='encontrou_area'>
                                        <textarea
                                            placeholder="Escreva um comentário..."
                                            value={comentarios[post.id] || ''}
                                            onChange={(e) => handleComentarioChange(post.id, e.target.value)}
                                        />
                                        <button
                                            id='botao'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addComentario(post.id, id, comentarios[post.id] || '');
                                                handleComentarioChange(post.id, '');
                                                updateEncontrado(post.id, post.encontrado || 0);
                                            }}
                                        >
                                            Adicionar Comentário
                                        </button>
                                    </div>
                                )}
                                <div className='comentarios'>
                                    {renderComentarios(post.id)}
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
