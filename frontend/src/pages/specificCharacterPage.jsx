import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const [character, setCharacter] = useState(null);

    const { characterID } = useParams();

    console.log("THE NAME: ", name)

    useEffect(() => {
        fetch(`/api/characters/${characterID}`)
            .then(res => res.json())
            .then(data => setCharacter(data));
    }, [name]);

    return (
        <>
            <h1>{character.name}</h1>

            {character && (
                <img style={{ maxWidth="800px", maxHeight="70vh"}} src={character.img}></img>
            )}
        </>
    )
}

export default SpecificCharacter