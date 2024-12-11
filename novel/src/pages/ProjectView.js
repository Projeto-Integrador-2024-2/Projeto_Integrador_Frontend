import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "../api_access";
import { useParams } from "react-router-dom";
import Scene from "./SceneView";

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
        console.log(sceneResponse.data)
        console.log(choiceResponse.data)
        setScenes(sceneResponse.data);
        setChoices(choiceResponse.data);
      } catch (err) {
        console.error("Erro ao buscar cenas:", err?.sceneResponse?.data || err.message);
        setError("Não foi possível carregar as cenas.");
      } finally {
        setLoading(false);
      }
    };

    fetchScenes();
  }, [projectId]);

  const handleChoice = (toSceneId) => {
    const nextSceneIndex = scenes.findIndex(scene => scene.id === toSceneId);
    if (nextSceneIndex !== -1) {
      setCurrentSceneIndex(nextSceneIndex);
    }
  };


  if (loading) {
    return <p>Carregando cenas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const currentScene = scenes[currentSceneIndex];
  const currentChoices = choices.filter(choice => choice.from_scene === currentScene.id);

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
          <div>
            {currentChoices.map(choice => (
              <button key={choice.id} onClick={() => handleChoice(choice.to_scene)}>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>Não há mais cenas disponíveis.</p>
      )}
    </div>
  );

}
export default ProjectView;
