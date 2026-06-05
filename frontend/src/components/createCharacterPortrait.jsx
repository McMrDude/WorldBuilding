import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom'
import supabase from "../supabase.js";
import Draw from './drawBox.jsx';
import "./character_portrait.css";

function CreatePortrait({ name, description, onClose }) {
    const [imageFile, setImageFile] = useState(null);
    const [drawBoxOpen, setDrawBoxOpen] = useState(false);
    const [IconUrls, setIconUrls] = useState([]);
    const [publicUrl, setPublicUrl] = useState("");
    const { id } = useParams();

    const createCharacter = async () => {
        /* den endelige bilde URLen som blir postet til databasen */
        let finalUrl = publicUrl;

        /* Changes the finalUrl if user uploads own image from pc */
        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;

            /* Her henter vi en storage fra supabase som heter "character_portraits" og laster vi opp bilde fra pcen in i den storagen */
            const { error } = await supabase.storage
            .from("character_portraits")
            .upload(fileName, imageFile);

            if (error) {
                console.error(error);
                return;
            }

            const { data } = supabase.storage
            .from("character_portraits")
            .getPublicUrl(fileName);

            finalUrl = data.publicUrl;

            console.log("New public URL set to:", finalUrl, "by uploading image");

            if (!imageFile) return;   
        }

        if (!name || !id) return;

        await fetch("/api/characters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ 
                id,
                name, 
                imageUrl:finalUrl,
                description 
            })
        });

        onClose();

        alert("Character created!");
    }

    const getIcons = async () => {
        const { data: files, error } = await supabase
        .storage
        .from("characterIcons")
        .list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc"}
        });

        if (error) {
            console.error("Error fetching icons:", error);
            return [];
        }

        const imageUrls = files
        .filter(file => file.id !== null)
        .map(file => {
            const { data } = supabase
            .storage
            .from("characterIcons")
            .getPublicUrl(file.name);

            return data.publicUrl;
        });

        setIconUrls(imageUrls);

        return imageUrls;
    }

    useEffect(() => {
        getIcons()
    } , []);

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
                <label htmlFor="icon">Choose a pre made icon</label>
                <div id="iconContainer">
                    {IconUrls.map((url, index) => (
                        <img 
                            key={index}
                            src={url}
                            alt={`Icon ${index}`}
                            style={{ width: "75px", height: "75px", margin: "5px" }}
                            onClick={() => {
                                setPublicUrl(url);
                                setImageFile(null);
                                console.log("New public URL set to:", publicUrl, "by clicking on icon");
                            }}
                        />
                    ))}
                </div>

                <label htmlFor="or">Or:</label>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <input
                        style={{ width: "150px" }} 
                        type="file" 
                        id="character-image" 
                        className="image-picker"
                        name="character-image" 
                        accept="image/*"
                        value={imageFile ? undefined : ''}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setImageFile(file);
                            const previewUrl = URL.createObjectURL(file);
                            setPublicUrl(previewUrl);
                        }}
                    />

                    <button onClick={() => setDrawBoxOpen(true)}>Draw Character</button>
                </div>

                <label>Or just don't select anything if you don't want an image</label>

                <button onClick={ createCharacter }>Create Character</button>

                <img src={publicUrl} alt="Character Portrait" style={{ width: "150px", height: "150px", marginTop: "10px" }} />

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

export default CreatePortrait;