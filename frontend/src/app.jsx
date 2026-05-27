import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from "./assets/vite.svg"
import './App.css'
import createWorld from './components/createWorldBox.jsx'

function App() {
  const [worldBoxOpen, setWorldBoxOpen] = useState(false);

  return (
    <>
        <h1>Welcome to World Building!</h1>
        <p>This is a platform for creating and sharing your own worlds.</p>
        <button onClick={() => setWorldBoxOpen(true)}>
            Create a new world
        </button>

        {worldBoxOpen && (
            <div
              className={`overlay ${worldBoxOpen ? "show" : "hide"}`} 
              onClick={() => setWorldBoxOpen(false)}
            />
        )}

        <createWorld style={{ display: worldBoxOpen ? "block" : "none" }} />
    </>
  )
}

export default App