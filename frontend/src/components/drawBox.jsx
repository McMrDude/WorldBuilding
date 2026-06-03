import {useRef, useEffect, useState } from 'react';

function Draw({ onClose, onDrawn }) {    
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = 400;
        canvas.height = 400;

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
                <h2>Draw</h2>

                <canvas 
                    ref={canvasRef} 
                    style={{ 
                        border: '1px solid #000;',
                        cursor: 'crosshair' 
                    }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                ></canvas>
            </div>
        </>
    )
}

export default Draw;