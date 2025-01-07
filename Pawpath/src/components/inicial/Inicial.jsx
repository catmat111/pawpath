import React from 'react'
import logo from '../../assets/LOGO.png';
import './Inicial.css'
export default function Inicial() {
    return (
        <div>
            <div classname="logo">
                <img src={logo} />
            </div>
            <div className="bloco_login">
                <form>
                    <button type="submit" className="botao" id='login'>Login</button>
                    <button type="submit" className="botao" id='sign_in'>Criar conta</button>
                </form>
            </div>
        </div>
    );
}