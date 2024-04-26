import React, { useState, useEffect } from "react";
import axios from "axios";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("low");
  const [dateInput, setDateInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const result = await axios.get("http://localhost:3001/");
    setTasks(result.data);
  };

  const addOrUpdateTask = async () => {
    const taskData = {
      description: taskInput,
      priority: priorityInput,
      date: new Date(dateInput),
      completed: false, // Default when adding a new task
    };

    if (editingId) {
      await axios.put(`http://localhost:3001/${editingId}`, taskData);
      setEditingId(null); // Clear editingId after update
    } else {
      await axios.post("http://localhost:3001/", taskData);
    }

    setTaskInput("");
    setPriorityInput("low");
    setDateInput("");
    fetchTasks();
  };

  const editTask = (task) => {
    setEditingId(task._id);
    setTaskInput(task.description);
    setPriorityInput(task.priority);
    setDateInput(task.date.split("T")[0]); // Formatting the date input to YYYY-MM-DD
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3001/${id}`);
    fetchTasks();
  };

  const toggleCompletion = async (task) => {
    await axios.put(`http://localhost:3001/${task._id}`, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Enter a task description"
      />
      <select
        value={priorityInput}
        onChange={(e) => setPriorityInput(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        type="date"
        value={dateInput}
        onChange={(e) => setDateInput(e.target.value)}
      />
      <button onClick={addOrUpdateTask}>
        {editingId ? "Update Task" : "Add Task"}
      </button>
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{ textDecoration: task.completed ? "line-through" : "none" }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task)}
            />
            {task.description} - {task.priority} -{" "}
            {new Date(task.date).toDateString()}
            <button
              onClick={() => {
                editTask(task);
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
