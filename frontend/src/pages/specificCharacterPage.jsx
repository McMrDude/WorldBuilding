import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const loreArea = useRef(null);

    const [character, setCharacter] = useState(null);
    const [lore, setLore] = useState('');

    const [editState, setEditState] = useState(false);

    const { characterID } = useParams();

    useEffect(() => {
        fetch(`/api/characters/${characterID}`)
            .then(res => res.json())
            .then(data => setCharacter(data));
    }, [characterID]);

    const changeLore = () => {
        if (loreArea.current) {
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
                        { editState ? <textarea value={lore} ref={loreArea} placeholder='Write your awsome pogchamp sigma lore you dweeb'></textarea> : <p>{character.lore}</p>}
                    </div>
                    <div>
                        { editState ? (<button onClick={changeLore()}>Save</button>, <button onClick={setEditState(false)}>Cancel</button>) : <button onClick={setEditState(true)}>Edit</button>}
                    </div>
                </div>
            )}
        </>
    )
}

export default SpecificCharacter