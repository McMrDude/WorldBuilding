import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const [character, setCharacter] = useState('');

    const { name } = useParams();

    console.log("THE NAME: ", name)

    useEffect(() => {
        fetch(`/api/characters/${name}`)
            .then(res => res.json())
            .then(data => setCharacter(data));
    }, [name]);

    return (
        <>
            <h1>{character.name}</h1>
        </>
    )
}

export default SpecificCharacter