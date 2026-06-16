import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from "./assets/vite.svg"
import './App.css'
import CreateWorld from './components/createWorldBox.jsx'
import logo from "./img/B&B_big_logo.png"

function App() {
  const [worldBoxOpen, setWorldBoxOpen] = useState(false);

  const [worlds, setWorlds] = useState([]);

  
  const fetchWorlds = () => {
    fetch("/api/worlds", {credentials: 'include'})
    .then(res => res.json())
    .then(data => setWorlds(Array.isArray(data) ? data : []))
  };

  useEffect(() => {
    fetchWorlds();
  }, []);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: "100vh", }}>
        <title>B&B</title>
        <img src="./img/B&B_big_logo.png"></img>
        <h1>Welcome to World Building!</h1>
        <p>This is a platform for creating and sharing your own worlds.</p>
        <button onClick={() => setWorldBoxOpen(true)}>
            Create a new world
        </button>

        <div id="worlds-container">
          {worlds.map(Worlds => (
              <div className="world-card" key={Worlds.id}>
                <Link style={{ all: 'unset' }} to={`/world/${Worlds.id}`}>
                  <h2>World Name:</h2>
                  <h3>{Worlds.worldname}</h3>

                  <h2>Description:</h2>
                  <h3>{Worlds.description}</h3>
                </Link>
              </div>
          ))}
        </div>

        {worldBoxOpen && (
          <>
            <div
              className={`overlay ${worldBoxOpen ? "show" : "hide"}`} 
              onClick={() => setWorldBoxOpen(false)}
            />

            <CreateWorld
              onClose={() => setWorldBoxOpen(false)}
              onWorldCreated={fetchWorlds}
            />
          </>
        )}
    </div>
  )
}

export default App