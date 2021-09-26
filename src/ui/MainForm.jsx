import React, { useState } from 'react';

export default ({handleSubmit}) => {
    const [file, setFile] = useState();

    const handleFileSelected = (event) => {
        setFile(event.target.files[0]);
    }

    const handleFormSubmitted = (event) => {
        event.preventDefault();
        handleSubmit(file);
    }

    return (
        <div>
            <form onSubmit={handleFormSubmitted}>
                <label>Selecione o arquivos: <input type="file" onChange={handleFileSelected} /></label>
            {file && <input type="submit"/>}
            </form>
        </div>
    );
}
