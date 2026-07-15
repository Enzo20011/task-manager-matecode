import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { logout } from '../services/authService';
import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';

type FilterType = 'all' | 'pending' | 'completed';

export const TasksPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error, addTask, editTask, removeTask, toggle, reorder } = useTasks();
  const [filter, setFilter] = useState<FilterType>('all');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      console.error('Error al cerrar sesión');
    }
  };

  const handleSendSummary = async () => {
    setEmailStatus('loading');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user?.email,
          tasks: tasks,
        }),
      });
      if (res.ok) {
        setEmailStatus('success');
        setTimeout(() => setEmailStatus('idle'), 3000);
      } else {
        setEmailStatus('error');
        setTimeout(() => setEmailStatus('idle'), 3000);
      }
    } catch {
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 3000);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <div className="tasks-header__left">
          <h1 className="tasks-title">Mis tareas</h1>
          <span className="tasks-user">{user?.email}</span>
        </div>
        <div className="tasks-header__actions">
          <button
            className={`btn btn-secondary ${emailStatus === 'loading' ? 'btn--loading' : ''}`}
            onClick={handleSendSummary}
            disabled={emailStatus === 'loading'}
          >
            {emailStatus === 'loading' ? '⏳ Enviando...' :
             emailStatus === 'success' ? '✅ Enviado' :
             emailStatus === 'error' ? '❌ Error al enviar el email' :
             '📧 Enviar resumen'}
          </button>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="tasks-main">
        {error && <div className="alert alert--error">{error}</div>}

        {/* Stats */}
        <div className="tasks-stats">
          <span className="stat">📋 Total: {tasks.length}</span>
          <span className="stat stat--pending">⏳ Pendientes: {pendingCount}</span>
          <span className="stat stat--done">✅ Completadas: {completedCount}</span>
        </div>

        {/* Filters */}
        <div className="filters" role="group" aria-label="Filtrar tareas">
          {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'filter-btn--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Completadas'}
            </button>
          ))}
        </div>

        {/* New task form */}
        <section className="new-task-section">
          <h2 className="section-title">NUEVA TAREA</h2>
          <TodoForm onSubmit={addTask} />
        </section>

        {/* Task list */}
        <section className="task-list-section">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Cargando tareas...</p>
            </div>
          ) : (
            <TodoList
              tasks={filteredTasks}
              onToggle={toggle}
              onEdit={editTask}
              onDelete={removeTask}
              onReorder={reorder}
            />
          )}
        </section>
      </main>
    </div>
  );
};
