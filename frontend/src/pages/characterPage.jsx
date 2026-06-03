import { useState, useEffect } from 'react';
import CreateCharacter from '../components/createCharacterBox.jsx';
import { Link, useParams } from 'react-router-dom'
import './characterPage.css';

function CharacterPage() {
    const [characterBoxOpen, setCharacterBoxOpen] = useState(false);
    const [characters, setCharacters] = useState([]);
    const { id } = useParams();
    

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

            <div className="characters-container">
                {characters.map(character => (
                    character.world_id === id && (
                        <div key={character.id}>
                            <img src={character.img} alt={character.name} style={{ width: '200px', height: '200px' }} />
                            <h2>Name: {character.name}</h2>
                            <p>Description: {character.description}</p>
                        </div>
                    )
                ))}
            </div>

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