import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import supabase from "../supabase.js";
import CreateCharacterPortrait from './createCharacterPortrait.jsx';

function CreateCharacter({ onClose, onCharacterCreated }) {
    const [characterName, setCharacterName] = useState('');
    const [race, setRace] = useState('');
    const [age, setAge] = useState('');
    const [description, setDescription] = useState('');
    const [imgBoxOpen, setImgBoxOpen] = useState(false);    

    const [raceAge, setRaceAge] = useState('');

    const createCharacter = async () => {
        if (!characterName) {
            alert("Please enter a character name.");
            return;
        } 
        setImgBoxOpen(true);
    }
    return (
        <>
            <div style={{
                position: "fixed",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 15px 5px rgba(0, 0, 0, 0.2)",
                padding: "10px",
                border: "1px solid #555",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
            }}>
                <button className="closeBtn" onClick={onClose}>
                    ✕
                </button>
                <h2>Create a New Character</h2>

                <label htmlFor="character-name">Character Name:</label>
                <input 
                    type="text" 
                    id="character-name" 
                    name="character-name" 
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    required 
                />

                <label>Race (optional)</label>
                <select
                    value={race}
                    onChange={(e) => setCharacterName(e.target.value)}
                >
                    <option>Human</option>
                    <option>Assmuncher</option>
                    <option>Ratfolk</option>
                    <option>Avesian</option>
                    <option>Sludge</option>
                    <option>German</option>
                    <option>Router</option>
                    <option>Cirrius</option>
                </select>

                <label>Age (optional)</label>
                {race ? <label>{raceAge}</label> : null}
                <input
                    type='text'
                    value={age}
                    onChange={(e) => setCharacterName(e.target.value)}
                />

                <label htmlFor="character-description">Description (optional):</label>
                <textarea 
                    id="character-description" 
                    name="character-description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                {/* Knapp for å starte funksjonen som åpner "CreateCharacterPortrait" */}
                <button onClick={createCharacter}>Create Character</button>

                {/* Her henter vi og renderer "CreateCharacterPortrait" komponenten men bare hvis imgBoxOpen er ekte */}
                {imgBoxOpen && (
                    <CreateCharacterPortrait
                        name={characterName}
                        race={race}
                        age={age}
                        description={description}
                        onClose={() => setImgBoxOpen(false), onClose}
                        onCharacterCreated={onCharacterCreated}
                    />
                )}
            </div>
        </>
    )
}

export default CreateCharacter;