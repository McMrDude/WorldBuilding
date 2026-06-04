import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import supabase from "../supabase.js";
import Draw from './drawBox.jsx';

function CreateCharacter({ onClose, onCharacterCreated }) {
    const [imageFile, setImageFile] = useState(null);
    const [drawBoxOpen, setDrawBoxOpen] = useState(false);

    const addImage = async () => {
        const file = imageFile;

        const fileName = `${Date.now()}-${file.name}`;

        const { data: uploadData, error } = await supabase.storage
            .from("character_portraits")
            .upload(fileName, file);

        if (error) {
            console.error("UPLOAD ERROR:", error);
            return;
        }

        const { data: publicUrlData, error: urlError } = await supabase.storage
            .from("character_portraits")
            .getPublicUrl(fileName);

/*         const publicUrl = publicUrlData.publicUrl;

        console.log(publicUrl); */

        if (!imageFile) return;
    }

    return (
        <>
            <div style={{
                position: "fixed",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 0 15px 5px rgba(0, 0, 0, 0.2)",
                padding: "10px",
                border: "1px solid #555",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
            }}>
                <label htmlFor="character-image">Character Image (optional):</label>
                <input 
                    type="file" 
                    id="character-image" 
                    name="character-image" 
                    accept="image/*"
                    value={imageFile ? undefined : ''}
                    onChange={(e) => setImageFile(e.target.files[0])}
                />

                <button onClick={() => setDrawBoxOpen(true)}>Draw Character</button>

                {drawBoxOpen && (
                <>
                    <Draw
                        onClose={() => setDrawBoxOpen(false)}
                    />
                </>
                )}
            </div>
        </>
    )
}

export default CreateCharacter;