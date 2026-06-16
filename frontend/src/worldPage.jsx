import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'

function WorldPage() {
    const { id } = useParams();
    const [ world, setWorld ] = useState(null);

    useEffect(() => {
        fetch(`/api/worlds/${id}`)
            .then(res => res.json())
            .then(data => setWorld(data));
    }, [id]);

    if (!world) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: "100vh", }}>
            <div>
                <Link to={`/world/${id}/characters`}>
                    <button>Character</button>
                </Link>
                <Link to={`/world/${id}/map`}>
                    <button>Map</button>
                </Link>
            </div>
            <h1>World {id}</h1>
            {world && (
                <div>
                    <title>World: {world.worldname}</title>
                    <h2>{world.worldname}</h2>
                    <p>{world.description}</p>
                </div>
            )}
        </div>
    )
}

export default WorldPage;