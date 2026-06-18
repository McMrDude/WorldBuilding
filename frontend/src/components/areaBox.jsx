import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'

function areaBox({ onClose, pinID }) {
    const { id } = useParams();

    const [area, setArea] = useState(null);

    const [name, setName] = useState(null);
    const [lore, setLore] = useState(null);

    const loadArea = () => {
        fetch(`/api/area/${pinID}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setArea(data));
    };

    useEffect(() => {
        loadArea();
    }, [pinID]);

    const updateArea = async () => {
        await fetch(`/api/area/${pinID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                lore,
            })
        })
    }

    return(
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
            backgroundColor: "#fff",}}
        >
            <button className="closeBtn" onClick={onClose}>
                    ✕
            </button>

            { area && (
                <div>
                    { area.name ? 
                        <p>{area.name}</p> : 
                        <textarea 
                            placeholder='The name of the place, stupid...'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    }
                    <h1>{area.type}</h1>
                    { area.lore ? 
                        <p>{area.lore}</p> : 
                        <textarea 
                            placeholder='The epic lore and description of the place...'
                            value={lore}
                            onChange={(e) => setLore(e.target.value)}
                        />
                    }
                    <button onClick={updateArea}>Update Place</button>
                </div>
            )}
            <h1>shit</h1>
        </div>
    );
};

export default areaBox;