import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const loreArea = useRef('');

    const [character, setCharacter] = useState(null);
    const [lore, setLore] = useState(null);

    const [editState, setEditState] = useState(true);

    const { characterID } = useParams();

    const fetchCharacter = () => {
        fetch(`/api/characters/${characterID}`)
            .then(res => res.json())
            .then(data => {
                setCharacter(data)
                setLore(data.lore || "")
            });
    };

    useEffect(() => {
        fetchCharacter();
    }, [characterID])

    const changeLore = async () => {
        console.log("Got to change lore")
        await updateLore();
        setEditState(true);
    }

    const updateLore = async () => {
        console.log("got to updateLore")
        await fetch(`/api/characters/${characterID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lore,
            })
        })
        fetchCharacter();
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: "100vh", }}>
            {character && (
                <div>
                    <h1>{character.name}</h1>
                    <img style={{ maxWidth: "800px", maxHeight: "70vh"}} src={character.img}></img>

                    <div style={{ display: 'flex', justifyContent: "center"}}>
                        { editState ? <p style={{minWidth: "500px", minHeight: "100px"}}>{character.lore}</p> : <textarea style={{minWidth: "500px", minHeight: "100px", resize: "none"}} name='loreField' value={lore} onChange={(e) => setLore(e.target.value)} placeholder='Write your awsome pogchamp sigma lore you dweeb'></textarea>}
                    </div>
                    <div>
                        { editState ? <button onClick={() => setEditState(false)}>Edit</button> : (<> <button onClick={changeLore}>Save</button> <button onClick={() => setEditState(true)}>Cancel</button> </>)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SpecificCharacter