import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(true);

  // LOAD
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ADD TASK
  const addTask = () => {
    if (!text.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text,
        date,
        priority,
        completed: false
      }
    ]);

    setText("");
    setDate("");
  };

  // COMPLETE TASK
  const completeTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: true } : t
    ));
  };

  // DELETE
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className={dark ? "app dark" : "app"}>
      <div className="container">

        <h1 className="title">🚀 Task Manager</h1>

        {/* NAV */}
        <div className="nav">
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("analytics")}>Analytics</button>
          <button onClick={() => setDark(prev => !prev)}>
            {dark ? "Light ☀️" : "Dark 🌙"}
          </button>
        </div>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <div className="input-group">
              <input
                value={text}
                placeholder="Enter task..."
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
              />

              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />

              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="low">🟢</option>
                <option value="medium">🟡</option>
                <option value="high">🔴</option>
              </select>

              <button onClick={addTask}>Add</button>
            </div>

            {/* TASK LIST */}
            <ul>
              {tasks.map(task => (
                <li key={task.id} className={task.priority}>
                  <div className="task-info">
                    <span className={task.completed ? "completed" : ""}>
                      {task.text}
                    </span>
                    <small>{task.date || "No date"}</small>
                  </div>

                  <div className="actions">
                    {!task.completed && (
                      <button onClick={() => completeTask(task.id)}>
                        Complete
                      </button>
                    )}
                    <button onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* ANALYTICS */}
        {page === "analytics" && (
          <div className="analytics">
            <h2>📊 Analytics</h2>

            <div className="card">
              <h3>Total Tasks</h3>
              <p>{tasks.length}</p>
            </div>

            <div className="card">
              <h3>Completed</h3>
              <p>{completed}</p>
            </div>

            <div className="card">
              <h3>Pending</h3>
              <p>{pending}</p>
            </div>

            <div className="card">
              <h3>Success Rate</h3>
              <p>
                {tasks.length
                  ? Math.round((completed / tasks.length) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}