import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import axios from "axios";

const Tasks = () => {
  const { tasks, addOrUpdateTask, deleteTask } = useTasks();
  const [taskInput, setTaskInput] = useState("");
  const [priorityInput, setPriorityInput] = useState("low");
  const [dateInput, setDateInput] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleTranscript = (transcript) => setTaskInput(transcript);
  const { isListening, toggleListening } =
    useSpeechRecognition(handleTranscript);

  const addToCalendar = async (task) => {
    try {
      await axios.post("http://localhost:3001/google/events", {
        description: task.description,
        priority: task.priority,
        date: task.date,
      });
      alert("Task added to Google Calendar!");
    } catch (error) {
      console.error("Error adding to calendar:", error);
      alert("Failed to add task to Google Calendar.");
    }
  };

  const handleAddOrUpdateTask = () => {
    const taskData = {
      description: taskInput,
      priority: priorityInput,
      date: new Date(dateInput),
      completed: false,
    };
    addOrUpdateTask(taskData, editingId);
    setTaskInput("");
    setPriorityInput("low");
    setDateInput("");
    setEditingId(null);
  };

  const editTask = (task) => {
    setEditingId(task._id);
    setTaskInput(task.description);
    setPriorityInput(task.priority);
    setDateInput(task.date.split("T")[0]); // Format date for input field
  };

  const toggleCompletion = async (task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
    };
    await addOrUpdateTask(updatedTask, task._id);
  };

  const handleLogin = async () => {
    // Redirect to the backend route for Google authentication
    window.location.href = "http://localhost:3001/google/auth/google";
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
      <button onClick={toggleListening}>
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
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
      <button onClick={handleAddOrUpdateTask}>
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
            <button onClick={() => addToCalendar(task)}>Add to Calendar</button>
            <button onClick={() => editTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default Tasks;
