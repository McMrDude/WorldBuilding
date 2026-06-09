import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const [character, setCharacter] = useState(null);

    const { id } = useParams();
    const { name } = useParams();

    console.log("THE NAME: ", name)

    useEffect(() => {
        fetch(`/api/characters/${id}`)
            .then(res => res.json())
            .then(data => setCharacter(data));
    }, [id]);

    return (
        <>
            <h1>{name}</h1>

            <img src={character.img}></img>
        </>
    )
}

export default SpecificCharacter