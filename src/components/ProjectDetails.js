import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/project-details.css';
import { authFetch } from '../utils/authFetch'; // Импортируем authFetch

function ProjectDetails() {
  const { id } = useParams(); // project ID из URL
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [members, setMembers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Используем authFetch для получения данных
    const fetchProjectDetails = async () => {
      // Исправлена строка, теперь id правильно вставляется в URL
      const response = await authFetch(`/api/projects/${id}/`);  // Используем шаблонные строки
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

    // Отправка комментария
    const comment = {
      user: { username: "Текущий пользователь" },
      text: newComment,
      created_at: new Date().toISOString(),
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
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
                <a href={doc.file} className="document-card__download">⬇️</a>
                <button className="document-card__delete">🗑️</button>
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

