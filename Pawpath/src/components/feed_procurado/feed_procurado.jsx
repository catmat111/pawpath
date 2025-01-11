import React, { useState, useEffect } from 'react';
import './feed_procurado.css';
import Navbar from '../navbar/navbar.jsx'; 
import { useLocation, useNavigate } from 'react-router-dom';

export default function FeedProcurado() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state;  

    const [posts, setPosts] = useState([]); 
    const [error, setError] = useState(null); 
    const [users, setUsers] = useState([]); 

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
        const url = `https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha2`; 
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
    useEffect(() => {
        console.log(posts)
        for(let i = 0;i<posts.length;i++){
            console.log(posts[i]);
        }
    }, [posts])

    // Função para obter o nome e a imagem do autor com base no ID
    const getUserDetails = (userId) => {
        
        
        if (!userId) {
            console.log("ID do usuário não fornecido.");
            return { nome: 'Desconhecido', imagem: 'default-image-url' };
        }

        const user = users.find(user => user.id === userId);
        if (user) {
            //console.log("Usuário encontrado:", user);  // Log para mostrar o usuário encontrado
            return { nome: user.nome, imagem: user.image };
        } else {
            //console.log("Usuário não encontrado para o ID:", userId);  // Log para depuração
            return { nome: 'Desconhecido', imagem: 'default-image-url' };
        }
    };

    return (
        <div className="feed-container">
            <Navbar id={id} /> {/* Navbar permanece, se necessário */}
            <div className="posts-container">
                {error && <p className="error">{error}</p>} {/* Exibe erro, se houver */}
                
                {posts.length > 0 ? (
                    posts.map((post, index) => {
                        //console.log("Post:", post);  // Log para verificar a estrutura do post
                        const { nome, imagem } = getUserDetails(posts[index].iduti);  // Obtém dados do autor do post
                        return (  // Adicionando o return para renderizar o JSX corretamente
                            <div key={post.id} className="post">
                                {/* Exibe a imagem e nome do usuário que fez o post */}
                                <div className="post-header">
                                    <img src={imagem} alt="Imagem do autor" className="post-author-image" />
                                    <h3 className="post-author-name">{nome}</h3>
                                </div>
                                
                                {/* Exibe o conteúdo do post */}
                                <div className="post-content">
                                    <img src={post.imagem} alt="Imagem do post" className="post-image" />
                                    <p >Nome: {post.nome}</p>
                                    <p >{post.texto}. De cor:</p>
                                    <div style={{ backgroundColor: post.cor}} className='cor'/>
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
