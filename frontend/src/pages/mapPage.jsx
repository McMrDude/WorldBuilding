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

        setBoxes((prev) =>
            prev.map((box) =>
                box.id === draggingId.current
                    ? {
                        ...box,
                        x: e.clientX - offset.current.x,
                        y: e.clientY - offset.current.y
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
        <div>
            <h1>MAP</h1>

            {boxes.map((box) => (
                <div
                    key={box.id}
                    className='draggable-box'
                    onPointerDown={(e) => onPointerDown(e, box)}
                    style={{
                        left: box.x,
                        top: box.y
                    }}
                >
                    {box.text}
                </div>
            ))}
        </div>
    );
};

export default MapPage;