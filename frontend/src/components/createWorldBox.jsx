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
        alert("World created!");
    }
    return (
        <>
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
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