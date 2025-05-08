import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/project-details.css';
import { authFetch } from '../utils/authFetch';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [members, setMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const response = await authFetch(`/api/projects/${id}/`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setDocuments(data.documents || []);
        setMembers(data.members || []);
        setComments(data.comments || []);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    const comment = {
      user: { username: "Текущий пользователь" },
      text: newComment,
      created_at: new Date().toISOString(),
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
  };

  const handleDownload = async (docId, docName) => {
    try {
      const response = await authFetch(`/api/documents/${docId}/download/`);
      if (!response.ok) throw new Error("Ошибка при скачивании");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = docName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Не удалось скачать файл");
      console.error(error);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Удалить документ?")) return;

    try {
      const response = await authFetch(`/api/documents/${docId}/`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
      } else {
        throw new Error("Ошибка при удалении");
      }
    } catch (error) {
      alert("Не удалось удалить файл");
      console.error(error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">{project.project_name}</h1>

      <div className="documents">
        {documents.length > 0 ? (
          documents.map(doc => (
            <div className="document-card" key={doc.id}>
              <div className="document-card__info">
                <div className="document-card__name">{doc.name}</div>
                <div className="document-card__path">{doc.file}</div>
              </div>
              <div className="document-card__actions">
                <button
                  onClick={() => handleDownload(doc.id, doc.name)}
                  className="document-card__download"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="document-card__delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : <p>No documents.</p>}
        <div className="dashboard__add">
          <Link to={`/projects/${id}/upload`} className="add-button">+</Link>
        </div>
      </div>

      <div className="members">
        <Link to={`/projects/${id}/members`} className="members__title">Members</Link>
        {members.map(m => (
          <div className="member" key={m.id}>{m.username}</div>
        ))}
      </div>

      <div className="comments">
        <h2 className="section-title">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div className="comment" key={index}>
              <div className="comment__content" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div>
                  <div className="comment__user" style={{ fontWeight: 'bold' }}>{comment.user.username}</div>
                  <div className="comment__time" style={{ fontSize: '12px', color: 'gray' }}>
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="comment__text">{comment.text}</div>
              </div>
            </div>
          ))
        ) : <p>No comments yet.</p>}
      </div>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          className="comment-form__input"
        />
        <button type="submit" className="comment-form__button">➤</button>
      </form>
    </div>
  );
}

export default ProjectDetails;
