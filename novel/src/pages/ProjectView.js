import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../api_access";
import { useParams } from "react-router-dom";
import Scene from "./SceneView";
import ProjectRating from "./components/RatingProject";
import './styles/ProjectView.css';


const ProjectView = () => {
  const { projectId } = useParams();
  const [scenes, setScenes] = useState([]);
  const [choices, setChoices] = useState([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScenes = async () => {
      const accessToken = Cookies.get("accessToken");

      try {
        const sceneResponse = await api.get(`/list/scene/${projectId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const choiceResponse = await api.get(`/list/choice/${projectId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(sceneResponse.data);
        setScenes(sceneResponse.data);

        if (choiceResponse.status === 204) {
          console.log([]);
          setChoices([]);
        } else {
          console.log(choiceResponse.data);
          setChoices(choiceResponse.data);
        }
      } catch (err) {
        console.error("Erro ao buscar cenas:", err?.response?.data || err.message);
        setError("Não foi possível carregar as cenas.");
      } finally {
        setLoading(false);
      }
    };

    fetchScenes();
  }, [projectId]);

  const handleChoice = (toSceneId) => {
    const nextSceneIndex = scenes.findIndex((scene) => scene.id === toSceneId);
    if (nextSceneIndex !== -1) {
      setCurrentSceneIndex(nextSceneIndex);
    }
  };

  const restartStory = () => {
    setCurrentSceneIndex(0); // Volta para a primeira cena
  };

  const handleEvaluateProject = () => {
    window.location.href = `/project/evaluate/${projectId}`; // Redireciona para a página de avaliação
  };

  if (loading) {
    return <p>Carregando cenas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const currentScene = scenes[currentSceneIndex];
  const currentChoices = choices.filter((choice) => choice.from_scene === currentScene.id);

  return (
    <div>
      {currentScene ? (
        <div>
          <Scene
            name={currentScene.name}
            urlBackground={currentScene.url_background}
            urlTextBox={currentScene.url_text_box}
            urlCharacterLeft={currentScene.url_character_left}
            urlCharacterMiddle={currentScene.url_character_middle}
            urlCharacterRight={currentScene.url_character_right}
            text={currentScene.text}
          />
          <div className="button-container">
            {currentChoices.length > 0 ? (
              currentChoices.map((choice) => (
                <button className="button" key={choice.id} onClick={() => handleChoice(choice.to_scene)}>
                  {choice.text}
                </button>
              ))
            ) : (
              <>
                <button className="button" onClick={restartStory}>
                  Reiniciar História
                </button>
                <ProjectRating />
              </>
            )}
          </div>
        </div>
      ) : (
        <p>Não há mais cenas disponíveis.</p>
      )}
    </div>
  );
};



export default ProjectView;
