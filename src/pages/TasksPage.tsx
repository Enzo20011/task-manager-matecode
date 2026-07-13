import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { logout } from '../services/authService';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import type { Task } from '../types';

type FilterType = 'all' | 'pending' | 'completed';

export const TasksPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error, addTask, editTask, removeTask, toggle } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  const handleSendEmail = async () => {
    if (!user?.email) return;
    try {
      setEmailSending(true);
      setEmailStatus(null);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          tasks,
        }),
      });
      if (!response.ok) throw new Error('Error al enviar el email');
      setEmailStatus('✅ Email enviado correctamente');
    } catch {
      setEmailStatus('❌ Error al enviar el email');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div className="tasks-header__left">
          <h1>Mis tareas</h1>
          <p className="tasks-header__user">{user?.email}</p>
        </div>
        <div className="tasks-header__right">
          <button
            id="send-email-btn"
            className="btn btn-secondary"
            onClick={handleSendEmail}
            disabled={emailSending || tasks.length === 0}
          >
            {emailSending ? 'Enviando...' : '📧 Enviar resumen'}
          </button>
          <button id="logout-btn" className="btn btn-ghost" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {emailStatus && (
        <div className={`status-banner ${emailStatus.startsWith('✅') ? 'status-banner--success' : 'status-banner--error'}`}>
          {emailStatus}
        </div>
      )}

      <div className="tasks-stats">
        <span className="stat">📋 Total: {tasks.length}</span>
        <span className="stat stat--pending">⏳ Pendientes: {pendingCount}</span>
        <span className="stat stat--done">✅ Completadas: {completedCount}</span>
      </div>

      <section className="tasks-form-section">
        <h2>Nueva tarea</h2>
        <TodoForm onSubmit={addTask} />
      </section>

      <section className="tasks-list-section">
        <div className="tasks-filters">
          {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              id={`filter-${f}`}
              className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
            </button>
          ))}
        </div>

        {error && <div className="error-banner" role="alert">{error}</div>}

        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <TodoList
            tasks={filteredTasks}
            onToggle={toggle}
            onEdit={(id, updates) => editTask(id, updates)}
            onDelete={removeTask}
          />
        )}
      </section>
    </div>
  );
};
