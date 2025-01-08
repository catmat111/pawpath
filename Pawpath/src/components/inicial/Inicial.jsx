import React from 'react'
import logo from '../../assets/LOGO.png';
import './Inicial.css'
import { Link } from "react-router-dom";

export default function Inicial() {
    return (
        <div>
            <div classname="logo">
                <img src={logo} />
            </div>
            <div className="bloco_login">
                <form>
                    <Link to="/Login">
                    <button type="submit" className="botao" id='login'>Login</button>
                    </Link>
                    <Link to="/sign_in">
                    <button type="submit" className="botao" id='sign_in'>Criar conta</button>
                    </Link>
                </form>
            </div>
        </div>
    );
}