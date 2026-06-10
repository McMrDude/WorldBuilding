import { useState, useEffect, useRef } from 'react';
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

    const boxRef = useRef(null);

    useEffect(() => {
        const box = boxRef

        box.addEventListener("pointerDown", (event) => {
            box.setPointerCapture(event.pointerId);

            box.addEventListener("pointerMove", onPointerMove);
            box.addEventListener("pointerUp", onPointerUp);
        });

        function onPointerMove(event) {
            const currentLeft = parseInt(box.style.left) || box.offsetLeft;
            const currentTop = parseInt(box.style.top) || box.offsetTop;

            box.style.left = `${currentLeft + event.movementX}px`;
            box.style.top = `${currentTop + event.movementY}px`;
        };

        function onPointerUp(event) {
            box.releasePointerCapture(event.pointerId);
            box.removeEventListener("pointerMove", onPointerMove);
            box.removeEventListener("pointerUp", onPointerUp);
        };
    }, []);

    return (
        <div>
            <div className='draggable-box' ref={boxRef}>RUB-A-DUB-DUB!!</div>

            <button onClick={() => setCharacterBoxOpen(true)}>Create Character</button>

            <div className="characters-container">
                {characters.map(character => (
                    character.world_id === id && (
                        <Link style={{ all: 'unset' }} to={`/world/${id}/characters/${character.id}`}>
                            <div key={character.id} className="character-card">
                                <img src={character.img} alt={character.name} style={{ width: '200px', height: '200px' }} />
                                <h2>Name: {character.name}</h2>
                                {character.race ? <p>Race: {character.race}</p> : null }
                                {character.age ? <p>Age: {character.age}</p> : null }
                                {character.description ? <p>Description: {character.description}</p> : null}
                            </div>
                        </Link>
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