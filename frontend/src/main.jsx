import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app.jsx'
import WorldPage from './worldPage.jsx'
import CreateWorld from './components/createWorldBox.jsx'
import CreateCharacter from './components/createCharacterBox.jsx'
import CharacterPage from './pages/characterPage.jsx'
import SpecificCharacter from './pages/specificCharacterPage.jsx'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<CreateWorld />} />
        <Route path="/create-character" element={<CreateCharacter />} />
        <Route path="/world/:id" element={<WorldPage />} />
        <Route path="/world/:id/characters" element={<CharacterPage />} />
        <Route path="/world/:id/characters/:name" element={<SpecificCharacter />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
) 