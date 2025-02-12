import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie"; // Importa cookies para obter o token
import api from "../../api_access";
import "../styles/RatingProject.css";

const ProjectRating = () => {
    const { projectId } = useParams();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);  // Estado para armazenar o ID do usuário

    // Função que converte a avaliação de 1-5 para 0-100
    const convertRating = (stars) => ((stars / 5) * 100).toFixed(2);

    useEffect(() => {
        const fetchUserData = async () => {
            const accessToken = Cookies.get("accessToken"); // Obtém o token do cookie
            if (!accessToken) {
                setMessage("Você precisa estar autenticado para avaliar!");
                return;
            }

            try {
                // Faz a requisição para obter os dados do usuário autenticado
                const userResponse = await api.get('/list/user/current', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Passando o token de autenticação
                    },
                });

                // Pega o ID do usuário a partir da resposta
                setUserId(userResponse.data.id);
            } catch (error) {
                console.error("Erro ao obter dados do usuário:", error);
                setMessage("Erro ao obter dados do usuário. Tente novamente.");
            }
        };

        fetchUserData();
    }, []);  // O useEffect só é executado uma vez após a montagem do componente

    const handleRating = async () => {
        if (rating === 0) {
            setMessage("Por favor, selecione uma nota antes de enviar!");
            return;
        }

        if (!userId) {
            setMessage("Não foi possível obter o ID do usuário.");
            return;
        }

        const finalRating = parseFloat(convertRating(rating));  // Converte a nota para 0-100

        const payload = {
            grade_value: finalRating,  // A nota final
            user: userId,  // ID do usuário
            project: Number(projectId),  // ID do projeto
        };
        //console.log(payload)
        try {
            const response = await api.post(
                `/create/grade`,  // URL da API
                payload,  // Corpo da requisição com os dados
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,  // Token de autenticação
                        "Content-Type": "application/json",  // Tipo de conteúdo JSON
                    },
                }
            );
        
            // Verifica se a requisição foi bem-sucedida (status 201)
            if (response.status === 201) {
                setMessage("Avaliação enviada com sucesso! Obrigado!");
            }
        
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
        
            // Verifica o status do erro e define a mensagem correspondente
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setMessage("Requisição inválida. Verifique os dados enviados.");
                        break;
                    case 403:
                        setMessage("Você não pode avaliar em nome de outro usuário.");
                        break;
                    case 404:
                        setMessage("Projeto não encontrado.");
                        break;
                    case 409:
                        setMessage("Você já avaliou este projeto.");
                        break;
                    default:
                        setMessage("Erro ao enviar a avaliação. Tente novamente.");
                        break;
                }
            } else {
                // Erro de rede ou outro erro não relacionado à resposta da API
                setMessage("Erro ao conectar com o servidor. Tente novamente.");
            }
        }
    };

    return (
        <div className="rating-container">
            <h2>Avalie este projeto</h2>
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= (hover || rating) ? "filled" : ""}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </span>
                ))}
            </div>
            <button className="submit-button-rating" onClick={handleRating}>
                Confirmar Avaliação
            </button>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ProjectRating;
