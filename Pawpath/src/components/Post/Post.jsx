import React, { useState, useEffect } from 'react';
import voltar_img from '../../assets/voltar.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Post.css';

export default function Post() {
    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [nome, setNome] = useState('');
    const [cor, setCor] = useState('#000000');
    const [text, setText] = useState(''); // Estado para o texto do input

    const fetchUsuarios = async () => {
        const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha1';
        try {
            const response = await fetch(url);

            if (!response.ok)
                throw new Error(`Erro na requisição: ${response.status}`);

            const data = await response.json();

            const encontrado = data.folha1.find(user => user.id === id);

            if (encontrado) {
                setUsuario(encontrado);
            } else {
                console.error("Usuário não encontrado.");
                setError("Usuário não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setError("Erro ao buscar dados.");
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const Mudar_imagem = async (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            const MAX_SIZE = 48 * 1024; // 48 KB
            if (selectedImage.size > MAX_SIZE) {
                alert('A imagem é muito grande. Por favor, escolha uma imagem de até 50 KB.');
                return;
            }

            try {
                const base64Image = await convertToBase64(selectedImage);
                setImage(base64Image);
            } catch (error) {
                console.error('Erro ao processar a imagem:', error);
                alert('Erro ao processar a imagem.');
            }
        } else {
            alert('Por favor, selecione uma imagem válida.');
        }
    };

    const voltar_botao = () => {
        navigate('/FeedProcurado', { state: { id } });
    };

    const handleSubmit = async () => {
        if (!image || !text || !nome || !cor) {
            alert('Por favor, preencha todos os campos antes de enviar.');
            return;
        }

        // Limitar o tamanho do texto
        const maxTextLength = 50000;
        if (text.length > maxTextLength) {
            alert(`O texto ultrapassou o limite de ${maxTextLength} caracteres. Por favor, reduza o tamanho.`);
            return;
        }

        // Verificar se o total de caracteres não excede 50.000
        const totalPayloadLength = text.length + (image ? image.length : 0);
        if (totalPayloadLength > 50000) {
            alert('O total de caracteres ultrapassou o limite de 50.000. Por favor, reduza o texto ou a imagem.');
            return;
        }

        const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha2';
        const payload = {
            folha2: {
                id: id,
                nome: nome,
                cor: cor,
                texto: text,
                imagem: image,
            },
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro ao salvar os dados: ${response.status} - ${errorMessage}`);
            }

            alert('Dados enviados com sucesso!');
            setImage('');
            setText('');
            setNome('');
            setCor('#000000');
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            alert('Erro ao enviar os dados. Tente novamente. Detalhes: ' + error.message);
        }
    };

    useEffect(() => {
        if (id)
            fetchUsuarios();
    }, [id]);

    return (
        <div className="user-container">
            <img
                src={voltar_img}
                onClick={voltar_botao}
                alt="Voltar"
                className="voltar"
            />
            <div className="div-esquerda">
                <img id="img" src={image || ''}  />
                <label className="imagem-input">
                    Escolher imagem
                    <input
                        className="inputs"
                        type="file"
                        accept="image/*"
                        onChange={Mudar_imagem}
                    />
                </label>
            </div>
            <div className="div-direita">

                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="text-input"
                    placeholder='Nome do animal'
                />
                <label>Digite algo:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Digite um texto"
                    className="text-input"
                />

                <input
                    type="color"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                />

                <button
                    className="submit"
                    onClick={handleSubmit}
                >
                    Enviar
                </button>
            </div>
            {error && <p>{error}</p>}
        </div>
    );
}
