import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/project-members.css';
import { authFetch } from '../utils/authFetch'; // Импортируем authFetch

function ProjectMembers() {
  const { id } = useParams(); // project id
  const [members, setMembers] = useState([]);
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);       // loading state
  const [error, setError] = useState(null);           // error state

  useEffect(() => {
    // Используем authFetch для получения данных о членах проекта
    const fetchMembers = async () => {
      try {
        const response = await authFetch(`/api/projects/${id}/members/`);

        if (response.status === 401) {
          // Unauthorized - redirect to login
          window.location.href = '/login';
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }

        const data = await response.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false); // заканчиваем загрузку
      }
    };

    fetchMembers();
  }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true); // начинаем загрузку
    setError(null); // очищаем ошибку

    try {
      const response = await authFetch(`/api/projects/${id}/members/invite/`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessages([{ text: `Invite sent to ${email}`, type: 'success' }]);
        setEmail("");
      } else {
        setMessages([{ text: `Failed to send invite`, type: 'error' }]);
      }
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false); // заканчиваем загрузку
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Project Members</h1>

      {loading && <p>Loading...</p>} {/* показываем индикатор загрузки */}
      {error && <p className="dashboard__error">{error}</p>} {/* отображаем ошибку */}

      {messages.length > 0 && (
        <ul className="messages">
          {messages.map((msg, index) => (
            <li key={index} className={`message ${msg.type}`}>{msg.text}</li>
          ))}
        </ul>
      )}

      <div className="member-list">
        {members.length > 0 ? (
          members.map(m => (
            <div className="member" key={m.id}>
              <span className="member__name">{m.username}</span>
              <button className="member__remove">🗑️</button>
            </div>
          ))
        ) : <p>No members yet.</p>}
      </div>

      <form onSubmit={handleInvite} className="invite-form">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="invite-form__input"
          placeholder="Enter email to invite"
          required
        />
        <button type="submit" className="invite-form__button">Invite</button>
      </form>
    </div>
  );
}

export default ProjectMembers;


