import { useState } from 'react';

function Draw({ onClose, onDrawn }) {    

    const draw = async () => {

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
                <button className="closeBtn" onClick={onClose}>
                    ✕
                </button>
                <h2>Draw</h2>

                <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={400} 
                    style={{ border: '1px solid #000; cursor: crosshair' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                ></canvas>
            </div>
        </>
    )
}

export default Draw;