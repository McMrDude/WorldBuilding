import { useState, useEffect } from 'react';

function SpecificCharacter() {
    const [character, setCharacter] = useState('');

    const { name } = useParams();

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