import React from 'react';
import './feed_procurado.css';
import Navbar from '../navbar/navbar.jsx'; // Importando Navbar com a primeira letra maiúscula
import { useLocation } from 'react-router-dom';

export default function FeedProcurado() {
    const location = useLocation(); // Obtém o estado da navegação
    const { id } = location.state ;  // Desestrutura a imagem
    
    return (
        <div>
            {/* Passa a imagem como uma prop para a Navbar */}
            <Navbar id={id} />
        </div>
    );
}
