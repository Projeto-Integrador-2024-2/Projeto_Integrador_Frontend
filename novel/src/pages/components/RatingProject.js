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
            // Tenta criar a avaliação
            const createResponse = await api.post(
                `/create/grade`,  // URL da API para criação
                payload,  // Corpo da requisição com os dados
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("accessToken")}`,  // Token de autenticação
                        "Content-Type": "application/json",  // Tipo de conteúdo JSON
                    },
                }
            );
        
            // Verifica se a criação foi bem-sucedida (status 201)
            if (createResponse.status === 201) {
                setMessage("Avaliação enviada com sucesso! Obrigado!");
            }
        
        } catch (createError) {
            console.error("Erro ao enviar avaliação:", createError);
        
            // Se o erro for 409 (Conflito), tenta atualizar a avaliação existente
            if (createError.response && createError.response.status === 409) {
                try {
                    const project_id = payload.project;  // Obtém o project_id do payload
                    const updateResponse = await api.patch(
                        `/update/grade/${project_id}/`,  // URL da API para atualização
                        payload,  // Corpo da requisição com os dados
                        {
                            headers: {
                                Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
        
                    // Verifica se a atualização foi bem-sucedida (status 200)
                    if (updateResponse.status === 200) {
                        setMessage("Avaliação atualizada com sucesso! Obrigado!");
                    }
        
                } catch (updateError) {
                    console.error("Erro ao atualizar avaliação:", updateError);
        
                    // Verifica o status do erro e define a mensagem correspondente
                    if (updateError.response) {
                        switch (updateError.response.status) {
                            case 400:
                                setMessage("Requisição inválida. Verifique os dados enviados.");
                                break;
                            case 403:
                                setMessage("Você não pode atualizar a avaliação de outro usuário.");
                                break;
                            case 404:
                                setMessage("Projeto não encontrado.");
                                break;
                            default:
                                setMessage("Erro ao atualizar a avaliação. Tente novamente.");
                                break;
                        }
                    } else {
                        // Erro de rede ou outro erro não relacionado à resposta da API
                        setMessage("Erro ao conectar com o servidor. Tente novamente.");
                    }
                }
            } else {
                // Outros erros durante a criação
                if (createError.response) {
                    switch (createError.response.status) {
                        case 400:
                            setMessage("Requisição inválida. Verifique os dados enviados.");
                            break;
                        case 403:
                            setMessage("Você não pode avaliar em nome de outro usuário.");
                            break;
                        case 404:
                            setMessage("Projeto não encontrado.");
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
