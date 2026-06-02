import { useState, useEffect } from 'react';
import CreateCharacter from '../components/createCharacterBox.jsx';

function CharacterPage() {
    const [characterBoxOpen, setCharacterBoxOpen] = useState(false);
    const [characters, setCharacters] = useState([]);
    

    const fetchCharacters = () => {
        fetch("/api/characters", {credentials: 'include'})
        .then(res => res.json())
        .then(data => setCharacters(Array.isArray(data) ? data : []))
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    return (
        <div>
            <button onClick={() => setCharacterBoxOpen(true)}>Create Character</button>

            <h1>ID: {id}</h1>

            {characterBoxOpen && (
            <>
                <CreateCharacter
                onClose={() => setCharacterBoxOpen(false)}
                onCharacterCreated={fetchCharacters}
                />
            </>
            )}
        </div>
    );
}

export default CharacterPage;