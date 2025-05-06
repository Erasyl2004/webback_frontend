import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { authFetch } from '../utils/authFetch'; // Импортируем authFetch

function DocumentUpload() {
  const { id } = useParams(); // project id
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("project", id); // если нужно

    // Исправляем строку, используя шаблонные строки
    const response = await authFetch(`/api/projects/${id}/upload/`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Document uploaded successfully");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="upload-form">
      <h1>Upload Document</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default DocumentUpload;



