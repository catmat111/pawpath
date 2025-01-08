import React from 'react';
import './navbar.css';
import logo from '../../assets/LOGO.png';

export default function Navbar() {  // Nome do componente em PascalCase
    return (
        <nav>
            <img src={logo} alt="Logo" />
        </nav>
    )
}
