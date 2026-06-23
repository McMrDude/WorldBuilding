import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'

function AreaBox({ onClose, pinID, }) {
    const { id } = useParams();

    const [area, setArea] = useState(null);

    const [name, setName] = useState(null);
    const [lore, setLore] = useState(null);

    const [haveCharacters, setHaveCharacters] = useState(false);

    const [characters, setCharacters] = useState([]);
    const [chosenCharacters, setChosenCharacters] = useState([]);
    const [temporaryChosen, setTemporaryChosen] = useState([]);

    const [edit, setEdit] = useState(false);
    const [prevArea, setPrevArea] = useState(null);

    const loadArea = () => {
        console.log("Loading area:", pinID);

        fetch(`/api/area/${pinID}`)
        .then(res => res.json())
        .then(data => {
            console.log("AREA DATA:", data);

            setArea(data)
            setName(data.name)
            setLore(data.lore)
        });
    };

    const loadCharacters = () => {
        fetch(`/api/area/characters/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log("CHARACTERS DATA:", data);
            setCharacters(data);
        });
        setTemporaryChosen([]);
    };

    useEffect(() => {
        loadArea();
        loadCharacters();
    }, []);

    const updateArea = async () => {
        console.log("UPDATE BUTTON CLICKED")
        const res = await fetch(`/api/area/${pinID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                lore,
                haveCharacters,
            })
        })
        temporaryChosen.map((chosen) => {
            setChosenCharacters(prev => [...prev, chosen]);
        })
        setEdit(false)
        loadArea();
        loadCharacters();
        console.log("ABOUT TO LOAD AREA")
    };

    const prevName = useRef(null);
    const prevLore = useRef(null);

    return(
        <div style={{
            position: "fixed",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%",
            display: "flex",
            width: "250px",
            minHeight: "300px",
            flexDirection: "column",
            boxShadow: "0 0 15px 5px rgba(0, 0, 0, 0.2)",
            padding: "10px",
            border: "1px solid #555",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",}}
        >
            <button className="closeBtn" style={{ position: "absolute", top: "5px", left: "5px"}} onClick={onClose}>
                ✕
            </button>
            { edit ?
                <button
                    style={{ 
                        position: "absolute", 
                        top: "5px", 
                        right: "5px" 
                    }} 
                    onClick={() => {
                        setEdit(false);
                        setArea({
                            ...area,
                            name: prevName.current,
                            lore: prevLore.current
                        });
                        setName(prevName.current);
                        setLore(prevLore.current);
                        setChosenCharacters([]);
                        /* console.log(prevArea) */
                    }}
                >
                    Cancel
                </button> :

                <button 
                    style={{ 
                        position: "absolute", 
                        top: "5px", 
                        right: "5px" 
                    }} 
                    onClick={() => {
                        setEdit(true);
                        prevName.current = area.name;
                        prevLore.current = area.lore;
                        setArea({
                            ...area,
                            name: null,
                            lore: null
                        })
                        setChosenCharacters([]);
                    }}
                >
                    Edit
                </button>
            }

            { area && (
                <div>
                    
                    { area.name ? 
                        <h1>{area.name}</h1> : 
                        <textarea 
                            placeholder='The name of the place, stupid...'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    }
                    <p>| {area.type} |</p>
                    { area.lore ? 
                        <h3>{area.lore}</h3> : 
                        <textarea 
                            placeholder='The epic lore and description of the place...'
                            value={lore}
                            onChange={(e) => setLore(e.target.value)}
                        />
                    }

                    <lable>Add characters?</lable>
                    <input type="checkbox" switch onChange={(e) => {setHaveCharacters(e.target.value), console.log(haveCharacters)}}/>

                    { haveCharacters ?
                        (<>
                            { chosenCharacters.length > 0 ? 
                                (
                                    <div style={{ display: "flex", flexDirection: "column"}}>
                                        { chosenCharacters.map((character) => (
                                            <div style={{ display: "flex", flexDirection: "row"}}>
                                                <img src={character.img} style={{ width: "30px", height: "30px" }}/>
                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                    <h4 style={{ margin: 0}}>{character.name}:</h4>
                                                    <p style={{ margin: 0}}>{character.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column"}}>
                                        { characters.map((character) => (
                                            <div style={{ display: "flex", flexDirection: "row", cursor: "pointer"}} key={character.id} onClick={() => setTemporaryChosen(prev => [...prev, character])}>
                                                <img src={character.img} style={{ width: "30px", height: "30px" }}/>
                                                <p>{character.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </>) : (
                            null
                        )
                    }

                    { edit || !area.name || !area.lore || chosenCharacters.length <= 0 ? <button onClick={updateArea}>Update Place</button> : null}
                </div>
            )}
        </div>
    );
};

export default AreaBox;