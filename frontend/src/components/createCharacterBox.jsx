import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import supabase from "../supabase.js";
import CreateCharacterPortrait from './createCharacterPortrait.jsx';

function CreateCharacter({ onClose, onCharacterCreated }) {
    const [characterName, setCharacterName] = useState('');
    const [description, setDescription] = useState('');
    const [imgBoxOpen, setImgBoxOpen] = useState(false);    

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
                        description={description}
                        onClose={() => setImgBoxOpen(false), (onCharacterCreated, onClose)}
                    />
                )}
            </div>
        </>
    )
}

export default CreateCharacter;