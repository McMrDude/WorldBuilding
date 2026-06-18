import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'

function areaBox({ onClose, pinID }) {
    const { id } = useParams()

    const [area, setArea] = useState(null)

    const loadArea = () => {
        fetch(`/api/areas/${pinID}`, { credentials: 'include' })
        .then(res => res.json())
        .then( data => setArea(data) );
    };

    useEffect(() => {
        loadArea();
    }, [pinID]);

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
                    {console.log(area)}
                    <h1>{area.type}</h1>
                </div>
            )}
            <h1>shit</h1>
        </div>
    );
};

export default areaBox;