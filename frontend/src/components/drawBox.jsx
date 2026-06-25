import {useRef, useEffect, useState } from 'react';
import transparent from "../img/transparent_background.png"

function Draw({ onClose, onDrawn, onSaveDrawing }) {    
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const isDrawing = useRef(false);

    const [fill, setFill] = useState(false)
    const [fillColor, setFillColor] = useState({
        r: 0, g: 0, b: 255, a: 255
    });

    const [transparentBackground, setTransparentBackground] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = 400;
        canvas.height = 400;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;

        ctxRef.current = ctx;
    }, []);

    const startDraw = (e) => {
        const ctx = ctxRef.current;
        const rect = canvasRef.current.getBoundingClientRect();

        isDrawing.current = true;

        ctx.beginPath();
        ctx.moveTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
    };

    const draw = (e) => {
        if (!isDrawing.current) return;

        const ctx = ctxRef.current;
        const rect = canvasRef.current.getBoundingClientRect();

        ctx.lineTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );

        ctx.stroke();
    };

    const stopDraw = () => {
        isDrawing.current = false;
    };


    const floodFill = (canvas, startX, startY, fillColor) => {
        const ctx = canvas.getContext("2d");
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const getPixelColor = (x, y) => {
            const offset = (y * canvas.width + x) * 4;
            return {
                r: data[offset],
                g: data[offset + 1],
                b: data[offset + 2],
                a: data[offset + 3]
            };
        }

        const targetColor = getPixelColor(startX, startY);

        if (
            targetColor.r == fillColor.r &&
            targetColor.g == fillColor.g &&
            targetColor.b == fillColor.b &&
            targetColor.a == fillColor.a 
        ) {
            return
        }

        const queue = [[startX, startY]];

        while (queue.length > 0) {
            const [cx, cy] = queue.shift();

            const offset = (cy * canvas.width + cx) * 4;

            if (
                data[offset] === targetColor.r &&
                data[offset + 1] === targetColor.g &&
                data[offset + 2] === targetColor.b &&
                data[offset + 3] === targetColor.a 
            ) {
                data[offset] = fillColor.r;
                data[offset + 1] = fillColor.g;
                data[offset + 2] = fillColor.b;
                data[offset + 3] = fillColor.a;

                if (cx > 0) queue.push([cx - 1, cy]);
                if (cx < canvas.width - 1) queue.push([cx + 1, cy]);
                if (cy > 0) queue.push([cx, cy - 1]);
                if (cy < canvas.height - 1) queue.push([cx, cy + 1]);
            }
        }

        ctx.putImageData(imageData, 0, 0);
    };


    const finish = async () => {
        const canvas = canvasRef.current

        canvas.toBlob((blob) => {
            const file = new File(
                [blob],
                `drawing-${Date.now()}.jpeg`,
                { type: "image/jpeg" }
            );

            onSaveDrawing(file)
        })
    }

    const changeBackground = async (targetR, targetG, targetB, targetA, replacementR, replacementG, replacementB, replacementA) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (r === targetR && g === targetG && b === targetB && a == targetA) {
                data[i] = replacementR;
                data[i + 1] = replacementG;
                data[i + 2] = replacementB;
                data[i + 3] = replacementA;
            };
        };
        
        console.log("we got past the thick of it, everybody knew")
        ctx.putImageData(imgData, 0, 0);
    };

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
                <button className="closeBtn" onClick={onClose}>
                    ✕
                </button>
                { transparentBackground ?
                    <button onClick={() => {
                        changeBackground(0, 0, 0, 0, 255, 255, 255, 255);
                        setTransparentBackground(false);
                    }}>Background: Transparent</button> :
                    <button onClick={() => {
                        changeBackground(255, 255, 255, 255, 0, 0, 0, 0);
                    setTransparentBackground(true)}}>Background: Filled</button>
                }
                <div>
                    <button onClick={() => setFill(false)}>Draw Mode</button>
                    <button onClick={() => setFill(true)}>Fill Mode</button>
                </div>
                <h2>Draw</h2>

                <div style={{ display: "flex", flexDirection: "row"}}>
                    <canvas 
                        ref={canvasRef} 
                        id={"canvasID"}
                        style={{ 
                            border: '1px solid #000;',
                            cursor: 'crosshair',
                            backgroundImage: {transparent},
                        }}
                        onMouseDown={(e) => {
                            if (!fill) {startDraw(e)}
                            else {
                                const canvas = canvasRef.current;
                                const rect = canvas.getBoundingClientRect();
                                const x = Math.floor(e.clientX - rect.left);
                                const y = Math.floor(e.clientY - rect.top);

                                floodFill(canvas, x, y, fillColor)
                            }
                        }}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                    ></canvas>

                    <div style={{ display: "flex", flexDirection: "column"}}>
                        <button style={{ backgroundColor: "red", width: "50px", height: "50px" }} onClick={() => setFillColor({
                            r: 255,
                            g: 0,
                            b: 0,
                            a: 255
                        })}/>
                        <button style={{ backgroundColor: "green", width: "50px", height: "50px" }} onClick={() => setFillColor({
                            r: 0,
                            g: 255,
                            b: 0,
                            a: 255
                        })}/>
                        <button style={{ backgroundColor: "blue", width: "50px", height: "50px" }} onClick={() => setFillColor({
                            r: 0,
                            g: 0,
                            b: 255,
                            a: 255
                        })}/>
                        <button style={{ backgroundColor: "yellow", width: "50px", height: "50px" }} onClick={() => setFillColor({
                            r: 255,
                            g: 255,
                            b: 0,
                            a: 255
                        })}/>
                        <button style={{ backgroundColor: "purple", width: "50px", height: "50px" }} onClick={() => setFillColor({
                            r: 128,
                            g: 0,
                            b: 128,
                            a: 255
                        })}/>
                        <button style={{ backgroundColor: "white", width: "50px", height: "50px" }} onClick={() => setFillColor({
                            r: 255,
                            g: 255,
                            b: 254,
                            a: 255
                        })}/>
                        <button style={{ backgroundColor: "black", width: "50px", height: "50px" }} onClick={() => setFillColor({
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 255
                        })}/>
                    </div>
                </div>

                <button onClick={ finish }>Finish Drawing</button>
            </div>
        </>
    )
}

export default Draw;