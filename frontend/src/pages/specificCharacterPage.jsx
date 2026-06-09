import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const loreArea = useRef(null);

    const [character, setCharacter] = useState(null);
    const [lore, setLore] = useState('');

    const [editState, setEditState] = useState(true);

    const { characterID } = useParams();

    useEffect(() => {
        fetch(`/api/characters/${characterID}`)
            .then(res => res.json())
            .then(data => setCharacter(data));
    }, [characterID]);

    const changeLore = () => {
        if (loreArea.current) {
            setEditState(false);
            setLore(loreArea.current.value);
            updateLore();
        }
    }

    const updateLore = async () => {
        await fetch(`/api/characters/${characterID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lore
            })
        })
    }


    return (
        <>
            {character && (
                <div>
                    <h1>{character.name}</h1>
                    <img style={{ maxWidth: "800px", maxHeight: "70vh"}} src={character.img}></img>

                    <div>
                        { editState ? <p>{character.lore}</p> : <textarea value={lore} ref={loreArea} placeholder='Write your awsome pogchamp sigma lore you dweeb'></textarea>}
                    </div>
                    <div>
                        { editState ? <button onClick={() => setEditState(false)}>Edit</button> : (<> <button onClick={changeLore}>Save</button> <button onClick={() => setEditState(false)}>Cancel</button> </>)}
                    </div>
                </div>
            )}
        </>
    )
}

export default SpecificCharacter