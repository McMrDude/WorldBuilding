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

    const [pos, setPos] = useState({ x: 100, y: 100});
    const dragging = useRef(false)
    const offset = useRef({ x: 0, y: 0});

    const onPointerDown = (e) => {
        dragging.current = true;

        offset.current = {
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (e) => {
        if (!dragging.current) return;

        setPos({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y
        });
    };

    const onPointerUp = () => {
        dragging.current = false

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
    };

    return (
        <div>
            <div className='draggable-box' onPointerDown={onPointerDown} style={{
                left: pos.x,
                top: pos.y,
            }}>RUB-A-DUB-DUB!!</div>
            <div className='draggable-box' onPointerDown={onPointerDown} style={{
                left: pos.x,
                top: pos.y,
            }}>YEAH YEAH!!</div>
            <div className='draggable-box' onPointerDown={onPointerDown} style={{
                left: pos.x,
                top: pos.y,
            }}>TOO LATE, MY BABY!!</div>
            <div className='draggable-box' onPointerDown={onPointerDown} style={{
                left: pos.x,
                top: pos.y,
            }}>OH HALLELUJA!!</div>

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