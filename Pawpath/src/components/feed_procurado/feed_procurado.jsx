import React from 'react';
import './feed_procurado.css';
import Navbar from '../navbar/navbar.jsx'; 
import { useLocation } from 'react-router-dom';

export default function FeedProcurado() {
    const location = useLocation();
    const { id } = location.state ;  
    
    return (
        <div>
            <Navbar id={id} />
        </div>
        
    );
}
