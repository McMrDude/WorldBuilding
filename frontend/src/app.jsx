import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from "./assets/vite.svg"
import './App.css'
import CreateWorld from './components/createWorldBox.jsx'

function App() {
  const [worldBoxOpen, setWorldBoxOpen] = useState(false);

  const [worlds, setWorlds] = useState([]);

  useEffect(() => {
    fetch("/api/worlds", {credentials: 'include'})
    .then(res => res.json())
    .then(data => {
      if(Array.isArray(data)) {
        setWorlds(data)
      } else {
        setWorlds()
      }
    })
  });

  const allWorlds = [...worlds]
  
  console.log(allWorlds)
  return (
    <>
        <h1>Welcome to World Building!</h1>
        <p>This is a platform for creating and sharing your own worlds.</p>
        <button onClick={() => setWorldBoxOpen(true)}>
            Create a new world
        </button>

        {allWorlds.length > 0 && (
          {allWorlds.map(Worlds => (
            <div>
              <h2>World Name:</h2>
              <h3>{Worlds.worldname}</h3>

              <h2>Description:</h2>
              <h3>{.description}</h3>
            </div>
          ))}
        )}

        {worldBoxOpen && (
          <>
            <div
              className={`overlay ${worldBoxOpen ? "show" : "hide"}`} 
              onClick={() => setWorldBoxOpen(false)}
            />

            <CreateWorld
              onClose={() => setWorldBoxOpen(false)}
            />
          </>
        )}
    </>
  )
}

export default App