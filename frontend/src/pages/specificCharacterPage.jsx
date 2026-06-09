import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const [character, setCharacter] = useState(null);

    const { name } = useParams();

    console.log("THE NAME: ", name)

    useEffect(() => {
        fetch(`/api/characters/${name}`)
            .then(res => res.json())
            .then(data => setCharacter(data));
    }, [name]);

    return (
        <>
            <h1>{name}</h1>

            {character && (
                <img style={{ maxWidth="800px", maxHeight="70vh"}} src={character.img}></img>
            )}
        </>
    )
}

export default SpecificCharacter