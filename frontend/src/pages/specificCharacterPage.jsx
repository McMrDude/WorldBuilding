import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const [character, setCharacter] = useState(null);

    const { characterID } = useParams();

    useEffect(() => {
        fetch(`/api/characters/${characterID}`)
            .then(res => res.json())
            .then(data => setCharacter(data));
    }, [characterID]);

    return (
        <>
            {character && (
                <div>
                    <h1>{character.name}</h1>
                    <img style={{ maxWidth: "800px", maxHeight: "70vh"}} src={character.img}></img>
                </div>
            )}
        </>
    )
}

export default SpecificCharacter