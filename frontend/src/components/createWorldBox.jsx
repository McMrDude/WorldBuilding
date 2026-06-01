import { useState } from 'react';

function CreateWorld({ onClose }) {
    const [worldName, setWorldName] = useState('');
    const [description, setDescription] = useState('');

    const createWorld = async () => {
        if (!worldName || !description) return;

        await fetch("/api/worlds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ 
                worldName, 
                description 
            })
        });

        setWorldName('');
        setDescription('');
        onWorldCreated();
        onClose();
        alert("World created!");
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
                alignItems: "center"
            }}>
                <button className="closeBtn" onClick={onClose}>
                    ✕
                </button>
                <h2>Create a New World</h2>

                <label htmlFor="world-name">World Name:</label>
                <input 
                    type="text" 
                    id="world-name" 
                    name="world-name" 
                    value={worldName}
                    onChange={(e) => setWorldName(e.target.value)}
                    required 
                />

                <label htmlFor="world-description">Description (optional):</label>
                <textarea 
                    id="world-description" 
                    name="world-description" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <button onClick={createWorld}>Create World</button>
            </div>
        </>
    )
}

export default CreateWorld;