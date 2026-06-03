import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import supabase from "../supabase.js";

function CreateCharacter({ onClose, onCharacterCreated }) {
    const [characterName, setCharacterName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const { id } = useParams();    

    const createCharacter = async () => {
        if (!characterName || !id) return;

        const file = imageFile;

        const fileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("character_portraits")
            .upload(fileName, file);

        const { data } = supabase.storage
            .from("character_portraits")
            .getPublicUrl(fileName);

        const publicUrl = data.publicUrl;

        console.log(publicUrl);

        await fetch("/api/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ 
                id,
                imageUrl:publicUrl,
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
                    value={imageFile ? undefined : ''}
                    onChange={(e) => setImageFile(e.target.files[0])}
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