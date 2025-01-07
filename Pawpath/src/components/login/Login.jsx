import React from 'react'
import logo from '../../assets/LOGO.png';
import './Login.css'

export default function Login() {
    return (
        <div>
            <div classname="logo">
                <img src={logo} />
            </div>
            <div className="bloco_login">
                <form>
                    <div className="bloco_nickName">

                        <input
                            type="text"
                            className="inputs"
                            id="nickName"
                            placeholder="Nome do usuário" />
                    </div>
                    <div className="bloco_password">

                        <input
                            type="password"
                            className="inputs"
                            id="password"
                            placeholder="Senha" />
                    </div>
                    <button type="submit" className="entrar">Entrar</button>
                </form>
            </div>
        </div>

    );
}