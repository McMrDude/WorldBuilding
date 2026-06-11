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

        const mapRect = mapRef.current.getBoundingClientRect();

        offset.current = {
            x: e.clientX - mapRect.left - box.x,
            y: e.clientY - mapRect.top - box.y
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (e) => {
        if (!draggingId.current) return;

        const mapRect = mapRef.current.getBoundingClientRect();

        const newX = e.clientX - mapRect.left - offset.current.x;
        const newY = e.clientY - mapRect.top - offset.current.y;

        const clampedX = Math.max(
            0,
            Math.min(newX, mapRect.width)
        );
        const clampedY = Math.max(
            0,
            Math.min(newY, mapRect.height)
        );

        setBoxes((prev) =>
            prev.map((box) =>
                box.id === draggingId.current
                    ? {
                        ...box,
                        x: clampedX,
                        y: clampedY
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

            <div ref={mapRef} style={{ position: 'relative', border: "1px solid black", width: MAP_WIDTH, height: MAP_HEIGHT}}> 
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
        </div>
    );
};

export default MapPage;