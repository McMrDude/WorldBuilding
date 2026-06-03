import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'

function CreateCharacter({ onClose, onCharacterCreated }) {
    const [characterName, setCharacterName] = useState('');
    const [description, setDescription] = useState('');
    const [characterImage, setCharacterImage] = useState('');
    const { id } = useParams();
    

    const createCharacter = async () => {
        if (!characterName || !id) return;

        console.log(characterImage);

        await fetch("/api/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ 
                id,
                characterImage,
                characterName, 
                description 
            })
        });

        setCharacterName('');
        setDescription('');
        onCharacterCreated();
        onClose();
        alert("Character created!");
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

                <label htmlFor="character-image">Character Image (optional):</label>
                <input 
                    type="file" 
                    id="character-image" 
                    name="character-image" 
                    accept="image/*"
                    value={characterImage}
                    onChange={(e) => setCharacterImage(e.target.value)}
                />

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

                <button onClick={createCharacter}>Create Character</button>
            </div>
        </>
    )
}

export default CreateCharacter;