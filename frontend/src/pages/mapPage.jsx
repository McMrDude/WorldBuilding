import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'
import './mapPage.css'
import AreaBox from "../components/areaBox.jsx"
import map from "../img/elden_map.png"
import border from "../img/wood_border.png"
import background from "../img/mapBackground.jpg"
import paper from "../img/paper.jpg"
import hangingSign from "../img/hanging_sign.png"
import sideSign from "../img/side_sign.png"

import forestPin from "../img/forest_pin.png"
import mountainPin from "../img/mountain_pin.png"
import riverPin from "../img/river_pin.png"
import townPin from "../img/city_pin.png"
import dungeonPin from "../img/dungeon_pin.png"

function MapPage() {
    const { id } = useParams();
    const [boxes, setBoxes] = useState([
        /* { id: 1, x: 100, y: 100, text: "RUB-A-DUB-DUB!!" },
        { id: 2, x: 200, y: 150, text: "YEAH YEAH!!" },
        { id: 3, x: 300, y: 200, text: "TOO LATE, MY BABY!!" },
        { id: 4, x: 400, y: 250, text: "OH HALLELUJA!!" }, */
    ]);
    const [pins, setPins] = useState([]);
    const [currentPin, setCurrentPin] = useState(null);

    const draggingId = useRef(null);
    const wasDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0});

    const mapRef = useRef(null);
    
    const [areaBoxOpen, setAreaBoxOpen] = useState(false)

    const MAP_WIDTH = 1000;
    const MAP_HEIGHT = 600;

    const PIN_SIZE = 60;


    const fetchBoxes = () => {
        fetch(`/api/pins/${id}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            setPins(Array.isArray(data) ? data : []),
            setBoxes(
                data.map( pin => ({
                    id: pin.id,
                    dragId: pin.dragging_id,
                    image: pin.image,
                    x: pin.position_x,
                    y: pin.position_y,
                    text: pin.text
                }))
            );
        });
    };

    const fetchPins = () => {
        fetch(`/api/pins/${id}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setPins(Array.isArray(data) ? data : []),
        );
    };

    useEffect(() => {
        fetchBoxes();
    }, [id]);


    const onPointerDown = (e, box) => {
        draggingId.current = box.dragId;
        wasDragging.current = false;

        const mapRect = mapRef.current.getBoundingClientRect();

        offset.current = {
            x: (e.clientX - mapRect.left - pan.x) / zoom - box.x,
            y: (e.clientY - mapRect.top - pan.y) / zoom - box.y
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    };

    const onPointerMove = (e) => {
        if (!draggingId.current) return;
        wasDragging.current = true;

        const mapRect = mapRef.current.getBoundingClientRect();

        const newX = (e.clientX - mapRect.left - pan.x) / zoom - offset.current.x;
        const newY = (e.clientY - mapRect.top - pan.y) / zoom - offset.current.y;

        const clampedX = Math.max(
            PIN_SIZE / 2,
            Math.min(newX, (mapRect.width - PIN_SIZE / 2))
        );
        const clampedY = Math.max(
            PIN_SIZE / 2,
            Math.min(newY, (mapRect.height - PIN_SIZE / 2))
        );

        setBoxes((prev) =>
            prev.map((box) =>
                box.dragId === draggingId.current
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

    /* const nextId = useRef(1) */

    const addBox = (text) => {
        console.log("This is what text is when the button is made: ", text)
        let image = null;
        if (text === "Forest") {
            image = forestPin;
        }
        else if (text === "Dungeon") {
            image = dungeonPin;
        }
        else if (text === "Town") {
            image = townPin;
        }
        else if (text === "River") {
            image = riverPin;
        }
        else if (text === "Mountain") {
            image = mountainPin;
        }

        if (boxes) {
            setBoxes(prev => [
                ...prev,
                {
                    id: null,
                    dragId: boxes.length + 1,
                    image: image,
                    x: (MAP_WIDTH / 2) + Math.floor(Math.random() * 21) - 10,
                    y: (MAP_HEIGHT / 2) + Math.floor(Math.random() * 21) - 10,
                    text: text
                }
            ]);
        } else {
            setBoxes(prev => [
                ...prev,
                {
                    id: null,
                    dragId: null,
                    image: image,
                    x: MAP_WIDTH / 2,
                    y: MAP_HEIGHT / 2,
                    text: text
                }
            ]);
        }
    };

    const updateMap = async () => {
        await fetch("/api/pins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ 
                pins: boxes,
                world_id: id,
            })
        });

        fetchBoxes();
    }

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({
        x: 0,
        y: 0
    });

    const handleWheel = (e) => {
        e.preventDefault();

        const rect =
            mapRef.current.getBoundingClientRect();

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor =
                e.deltaY < 0 ? 1.1 : 0.9;

            const newZoom =
                Math.max(
                    1,
                    Math.min(4, zoom * zoomFactor)
                );

            const newPanX =
                mouseX -
                ((mouseX - pan.x) * newZoom) / zoom;

            const newPanY =
                mouseY -
                ((mouseY - pan.y) * newZoom) / zoom;

            if (newZoom === 1) {
                setPan({
                    x: 0,
                    y: 0
                });
            };

            const clampPan = (panX, panY, zoomLevel) => {
                const scaleWidth = MAP_WIDTH * zoomLevel;
                const scaleHeight = MAP_HEIGHT * zoomLevel;

                const minX = Math.min(0, MAP_WIDTH - scaleWidth);
                const minY = Math.min(0, MAP_HEIGHT - scaleHeight);

                return {
                    x: Math.max(minX, Math.min(0, panX)),
                    y: Math.max(minY, Math.min(0, panY))
                };
            };

            const clamped =
                clampPan(newPanX, newPanY, newZoom);

            setPan(clamped);

            setZoom(newZoom);
    };

    const [isPanning, setIsPanning] =
        useState(false);

    const panStart = useRef({
        x: 0,
        y: 0
    });

    const startPan = (e) => {
        setIsPanning(true);

        panStart.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,

            panX: pan.x,
            panY: pan.y
        };
    };

    const movePan = (e) => {
        if (!isPanning) return;

        const scaledWidth = MAP_WIDTH * zoom;
        const scaledHeight = MAP_HEIGHT * zoom;

        const maxX = 0;
        const maxY = 0;

        const minX = MAP_WIDTH - scaledWidth;
        const minY = MAP_HEIGHT - scaledHeight;


        const newX =
            panStart.current.panX +
            (e.clientX - panStart.current.mouseX);

        const newY =
            panStart.current.panY +
            (e.clientY - panStart.current.mouseY);

        setPan({
            x: Math.max(minX, Math.min(maxX, newX)),
            y: Math.max(minY, Math.min(maxY, newY))
        });
    };

    return(
        <div className='bigAssDiv' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: "100vh", }}>
            <title>Map Maker</title>

            <h1 style={{ fontFamily: "myFont", fontSize: "76px", color: "red", WebkitTextStroke: "1px darkRed", margin: 0, position: "absolute", top: 0, right: "20px", zIndex: "1" }}>MAP</h1>
            <img src={sideSign} style={{ width: "100px", heigt: "100px", position: "absolute", top: 0, left: 0, cursor: "pointer" }}/>

            <div style={{ display: 'flex', border: "10px solid transparent", borderImage: `url(${border}) 30 round` }}>
                <div 
                    ref={mapRef} 
                    onWheel={handleWheel}
                    style={{ 
                        position: 'relative', 
                        border: "1px solid black", 
                        overflow: "hidden",
                        width: MAP_WIDTH, 
                        height: MAP_HEIGHT 
                    }} 
                    onPointerDown={startPan}
                    onPointerMove={movePan}
                    onPointerUp={() => setIsPanning(false)}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: MAP_WIDTH,
                            height: MAP_HEIGHT,

                            transform:
                                `translate(${pan.x}px, ${pan.y}px)
                                scale(${zoom})`,

                            transformOrigin: "top left"
                        }}
                    >
                        <img src={map} alt='map' draggable="false" style={{ width: MAP_WIDTH, height: MAP_HEIGHT, display: "block", }}></img>
                        {boxes.map((box) => (
                            <img
                                src={box.image}
                                key={box.dragId}
                                draggable="false"
                                className='draggable-box'
                                onClick={() => {
                                    if (wasDragging.current) {
                                        wasDragging.current = false;
                                        return
                                    };

                                    setCurrentPin(box.id);
                                    setAreaBoxOpen(true);
                                    console.log(box.image);
                                }}
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    onPointerDown(e, box)
                                }}
                                style={{
                                    width: PIN_SIZE,
                                    height: PIN_SIZE,
                                    left: box.x,
                                    top: box.y,
                                    transform: 
                                        `translate(-50%, -100%) scale(${1 / zoom})`,
                                    transformOrigin: "bottom center",
                                }}
                            >
                                <button style={{ width: "10px", height: "10px", border: "1px solid red", borderRadius: "50px" }}>X</button>
                            </img>
                        ))}
                    </div>
                </div>
                <div className='pinDiv' style={{ display: 'flex', flexDirection: 'column', flexBasis: "7%", border: "10px solid transparent", borderImage: `url(${border}) 30 round` }}>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>Forest</button>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>River</button>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>Town</button>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>Dungeon</button>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>Mountain</button>
                </div>
            </div>
            <img src={hangingSign} onClick={updateMap} style={{ height: "100px", width: "100px", cursor: "pointer" }}/>

            { areaBoxOpen && (
                <>
                    <AreaBox
                        onClose={() => setAreaBoxOpen(false)}
                        key={currentPin}
                        pinID={currentPin}
                    />
                </>
            )}
        </div>
    );
};

export default MapPage;