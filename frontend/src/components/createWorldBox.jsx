import { useState } from 'react';

function CreateWorld({ open, onClose }) {
    const [worldName, setWorldName] = useState('');
    const [description, setDescription] = useState('');

    const createWorld = async () => {
        if (!worldName || !description) return;

        await fetch("/api/worlds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
            <div className={`box ${open ? "open" : ""}`}>
                <button className="closeBtn" onClick={onClose}>
                    ✕
                </button>
                <h2>Create a New World</h2>

                <label htmlFor="world-name">World Name:</label>
                <input type="text" id="world-name" name="world-name" required />

                <label htmlFor="world-description">Description (optional):</label>
                <textarea id="world-description" name="world-description"></textarea>

                <button onclick={createWorld}>Create World</button>
            </div>
        </>
    )
}

export default CreateWorld;