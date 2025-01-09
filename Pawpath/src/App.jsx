import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sign_in from './components/sign_in/sign_in'
import Login from './components/login/Login.jsx'
import Inicial from './components/inicial/Inicial.jsx'
import FeedProcurado from './components/feed_procurado/feed_procurado.jsx';
import User from './components/user/User.jsx';
import Password from './components/password/password.jsx';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
        
            <Routes>
                <Route path="/" element={<Inicial />} /> {/* Página inicial */}
                <Route path="/Login" element={<Login />} /> {/* Página de login */}
                <Route path="/sign_in" element={<Sign_in />} /> {/* Página de registro */}
                <Route path="/FeedProcurado" element={<FeedProcurado />} /> {/* Página do feed procurado */}
                <Route path="/User" element={<User />} /> {/* Página do user */}
                <Route path="/Password" element={<Password />} /> {/* Página para mudar a palavra pass */}
            </Routes>
        </Router>
  )
}

export default App
