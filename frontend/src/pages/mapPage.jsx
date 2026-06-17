import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'
import './mapPage.css'
import areaBox from "../components/areaBox.jsx"
import map from "../img/map.png"
import border from "../img/wood_border.png"
import background from "../img/mapBackground.jpg"
import paper from "../img/paper.jpg"

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

    const draggingId = useRef(null)
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
        if (text = "Forest") {
            image = forestPin;
        }
        if (text = "Dungeon") {
            image = dungeonPin;
        }
        if (text = "Town") {
            image = townPin;
        }
        if (text = "River") {
            image = riverPin;
        }
        if (text = "Mountain") {
            image = mountainPin;
        }

        if (boxes) {
            setBoxes(prev => [
                ...prev,
                {
                    id: null,
                    dragId: boxes.length + 1,
                    image: image,
                    x: MAP_WIDTH / 2,
                    y: MAP_HEIGHT / 2,
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

    return(
        <div className='bigAssDiv' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: "100vh", }}>
            <title>Map Maker</title>

            <h1 style={{ fontFamily: "myFont", fontSize: "76px", color: "red", WebkitTextStroke: "1px darkRed", margin: 0 }}>MAP</h1>

            <div style={{ display: 'flex', border: "10px solid transparent", borderImage: `url(${border}) 30 round` }}>
                <div ref={mapRef} style={{ position: 'relative', border: "1px solid black", width: MAP_WIDTH, height: MAP_HEIGHT }}> 
                    <img src={map} alt='map' style={{ width: "100%", height: "100%"}}></img>
                    {boxes.map((box) => (
                        <image
                            src={box.image}
                            key={box.dragId}
                            className='draggable-box'
                            onClick={() => {
                                setAreaBoxOpen(true);
                                console.log(box.image);
                            }}
                            onPointerDown={(e) => onPointerDown(e, box)}
                            style={{
                                width: PIN_SIZE,
                                height: PIN_SIZE,
                                left: box.x,
                                top: box.y,
                                transform: "translate(-50%, -50%)"
                            }}
                        />
                    ))}
                </div>
                <div className='pinDiv' style={{ display: 'flex', flexDirection: 'column', flexBasis: "7%", border: "10px solid transparent", borderImage: `url(${border}) 30 round` }}>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>Forest</button>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>River</button>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>Town</button>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>Dungeon</button>
                    <button className='pin_button' onClick={(e) => addBox(e.target.innerHTML)}>Mountain</button>
                </div>
            </div>
            <button onClick={updateMap}>Save map</button>

            { areaBoxOpen && (
                <>
                    <areaBox
                        onClose={() => setAreaBoxOpen(false)}
                    />
                </>
            )}
        </div>
    );
};

export default MapPage;