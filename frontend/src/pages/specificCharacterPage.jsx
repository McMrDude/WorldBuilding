import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

function SpecificCharacter() {
    const [character, setCharacter] = useState('');

    const { name } = useParams();

    console.log("THE NAME: ", name)

    const fetchCharacters = () => {
        fetch("/api/characters", {credentials: 'include'})
        .then(res => res.json())
        .then(data => setCharacter(Array.isArray(data) ? data : []))
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    return (
        <>
            <h1>{name}</h1>
        </>
    )
}

export default SpecificCharacter