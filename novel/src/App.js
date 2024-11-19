import React, { useState, useEffect } from "react";
import api from "./api_access";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get('todos');
      setData(response.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      {data.map(function(item) {
        return <p key={item.id}>{item.title}</p>;
      })}
    </div>
  );
}

export default App;
