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
            <div className="bloco">
                <form>
                    <Link to="/Login" className='route'>
                    <button type="submit" className="botao" >Login</button>
                    </Link>
                    <Link to="/sign_in" className='route'>
                    <button type="submit" className="botao" >Criar conta</button>
                    </Link>
                </form>
            </div>
        </div>
    );
}