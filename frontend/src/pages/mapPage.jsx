import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'

function MapPage() {
    const [boxes, setBoxes] = useState([
        { id: 1, x: 100, y: 100, text: "RUB-A-DUB-DUB!!" },
        { id: 2, x: 200, y: 150, text: "YEAH YEAH!!" },
        { id: 3, x: 300, y: 200, text: "TOO LATE, MY BABY!!" },
        { id: 4, x: 400, y: 250, text: "OH HALLELUJA!!" },
    ]);
    const draggingId = useRef(null)
    const offset = useRef({ x: 0, y: 0});

    const mapRef = useRef(null);

    const MAP_WIDTH = 1000;
    const MAP_HEIGHT = 600;

    const onPointerDown = (e, box) => {
        draggingId.current = box.id;

        offset.current = {
            x: e.clientX - box.x,
            y: e.clientY - box.y
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (e) => {
        if (!draggingId.current) return;

        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;

        const mapRect = mapRef.current.getBoundingClientRect();
        const centeredX = mapRect.width / 2;
        const centeredY = mapRect.height / 2;

        const clampedX = Math.max(
            0,
            Math.min(newX, mapRect.width - 120)
        );
        const clampedY = Math.max(
            0,
            Math.min(newY, mapRect.height - 120)
        );

        setBoxes((prev) =>
            prev.map((box) =>
                box.id === draggingId.current
                    ? {
                        ...box,
                        x: centeredX,
                        y: centeredY
                    }
                    : box
            )
        );
    };

    const onPointerUp = () => {
        draggingId.current = null;

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
    };

    return(
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1>MAP</h1>

            <div ref={mapRef} style={{ border: "1px solid black", width: MAP_WIDTH, height: MAP_HEIGHT}}/>

            {boxes.map((box) => (
                <div
                    key={box.id}
                    className='draggable-box'
                    onPointerDown={(e) => onPointerDown(e, box)}
                    style={{
                        left: box.x,
                        top: box.y,
                        transform: "translate(-50%, -50%)"
                    }}
                >
                    {box.text}
                </div>
            ))}
        </div>
    );
};

export default MapPage;