import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex] = {
        ...updated[editIndex],
        text: input,
        priority,
        dueDate,
      };
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([
        ...tasks,
        { text: input, done: false, priority, dueDate },
      ]);
    }

    setInput("");
    setPriority("low");
    setDueDate("");
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleTask = (index) => {
    const updated = [...tasks];
    updated[index].done = !updated[index].done;
    setTasks(updated);
  };

  const editTask = (index) => {
    setInput(tasks[index].text);
    setPriority(tasks[index].priority);
    setDueDate(tasks[index].dueDate);
    setEditIndex(index);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.done;
      if (filter === "pending") return !task.done;
      return true;
    })
    .filter((task) =>
      task.text.toLowerCase().includes(search.toLowerCase())
    );

  const completedCount = tasks.filter((t) => t.done).length;

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">

        <h1 className="title">
          Smart Task Manager 🚀
        </h1>

        <button className="mode-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>

        <p className="subtitle">Manage your tasks like a pro 🎯</p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search tasks..."
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* INPUT */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter task"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">🟢</option>
            <option value="medium">🟡</option>
            <option value="high">🔴</option>
          </select>

          <button onClick={addTask}>
            {editIndex !== null ? "Update ✏️" : "Add ➕"}
          </button>
        </div>

        {/* FILTER */}
        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        {/* STATS */}
        <p className="counter">
          Total: {tasks.length} | Completed: {completedCount}
        </p>

        {/* LIST */}
        <ul>
          {filteredTasks.length === 0 && <p>No tasks found</p>}

          {filteredTasks.map((task, index) => (
            <li key={index} className={task.priority}>
              <div className="task-info">
                <span
                  onClick={() => toggleTask(index)}
                  className={task.done ? "completed" : ""}
                >
                  {task.text}
                </span>

                {task.dueDate && (
                  <small>📅 {task.dueDate}</small>
                )}
              </div>

              <div className="actions">
                <button onClick={() => editTask(index)}>✏️</button>
                <button onClick={() => deleteTask(index)}>❌</button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;