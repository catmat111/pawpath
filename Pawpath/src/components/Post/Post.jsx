import React, { useState } from 'react';
import voltar_img from '../../assets/voltar.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Post.css';

export default function Post() {
    const location = useLocation();
    const { id } = location.state || {};
    const navigate = useNavigate();

    // variáveis para colocar na BD
    const [image, setImage] = useState(null);
    const [nome, setNome] = useState('');
    const [cor, setCor] = useState('#000000');
    const [text, setText] = useState(''); // Estado para o texto do input

    // Função para gerar um id_post único de 3 caracteres (letras e números)
    const generateUniqueId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    // Função para converter a imagem para Base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // resolve o base64
            reader.onerror = (error) => reject(error); // rejeita caso haja erro
        });
    };

    // Função para mudar a imagem
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

    // Função para voltar
    const voltar_botao = () => {
        navigate('/FeedProcurado', { state: { id } });
    };

    // Função para submeter o formulário
    const Submeter = async () => {
        if (!text || !nome || !cor) {
            alert('Por favor, preencha pelo menos o nome, a descrição e a cor');
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

        // Gerando um id_post único de 3 caracteres
        const id_post = generateUniqueId(); // Gerar ID único
        console.log('ID do post gerado:', id_post); // Depuração para verificar o id gerado

        const url = 'https://api.sheety.co/13ac488bcfe201a0f16f2046b162a2e3/api/folha2';
        const payload = {
            folha2: {
                iduti: id,
                idpost: id_post, // Incluindo o id_post gerado
                nome: nome,
                cor: cor,
                texto: text,
                imagem: image,
                encontrado: 0, // Inicializa o atributo 'encontrado' como 0
            },
        };

        console.log('Payload a ser enviado:', payload); // Depuração para verificar o conteúdo do payload

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

    return (
        <div className="user-container_post">
            <img
                src={voltar_img}
                onClick={voltar_botao}
                alt="Voltar"
                className="voltar_post"
            />
            <div className="div-esquerda_post">
                <label className="imagem-input_post">
                    <img id="img" src={image || ''} alt="Imagem do animal" />
                    <input
                        className="inputs_post_post"
                        type="file"
                        accept="image/*"
                        onChange={Mudar_imagem}
                    />
                </label>
            </div>
            <div className="div-direita_post">
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="text-input_post"
                    placeholder='Nome do animal'
                />
                <label>Descrição do animal:</label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Digite um texto"
                    className="text-input_post"
                />

                <input
                    type="color"
                    value={cor}
                    onChange={(e) => setCor(e.target.value)}
                />

                <button
                    className="submit_post"
                    onClick={Submeter}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}
