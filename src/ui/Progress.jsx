import React from "react";

export default ({data: {phase, progress, fileName}}) => {
    return (
        <>
            <h3>Fase {phase}</h3>
            <div>Camainho do arquivo: {fileName}</div>
            <label htmlFor="progress">Progresso:</label>
            <progress id="progress" value={progress} max="100">{progress}</progress>
        </>
    );
}