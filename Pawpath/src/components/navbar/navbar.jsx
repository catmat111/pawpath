import React, { useState, useEffect } from 'react';
import './navbar.css';
import logo from '../../assets/LOGO.png'; 
import { useNavigate } from "react-router-dom";


const Navbar = ({ id }) => {
    const [userImage, setUserImage] = useState(null); 
    const [usuario, setUsuario] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUsuarios = async () => {
            const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
            try {
                const response = await fetch(url);
                console.log("Resposta da API:", response);

                if (!response.ok) 
                    throw new Error(`Erro na requisição: ${response.status}`);
                
                const data = await response.json();
                // Procurar o utilisador
                const encontrado = data.folha1.find(user => user.id === id);
                

                // Atualizar o estado do usuário e a imagem
                if (encontrado) {
                    setUsuario(encontrado);
                    setUserImage(encontrado.image);
                } else {
                    console.error("Usuário não encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        fetchUsuarios();
    }, [id]); // Dependência do id
    
    const post_clicar = () =>{
        navigate('/Post', { state: { id: usuario.id } }); // Envia o ID do usuário para a nova página
    }
    const imagem_clicar = () => {
        if (usuario) {
            navigate('/User', { state: { id: usuario.id } }); // Envia o ID do usuário para a nova página
        } else {
            console.error("Usuário não definido.");
        }
    };

    return (
        <nav className='navbar'>
            <div className="navbar-left">
                
                <img src={logo} alt='logo' className="logo" />
                
            </div>
            <div className="navbar-center">
                <ul className="nav-links">
                    
                    <li>
                        <a className='link' onClick={post_clicar}>Fazer Post</a>
                    </li>
                </ul>
            </div>
            <div className="navbar-right">
                {/* Exibe a imagem do usuário, se disponível */}
                
                    <img 
                        src={userImage} 
                        onClick={imagem_clicar} 
                        alt="User" 
                        className="user-image" 
                        style={{ cursor: "pointer" }} 
                    />
                
            </div>
        </nav>
    );
};

export default Navbar;
