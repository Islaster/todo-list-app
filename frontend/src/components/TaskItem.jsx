import React from "react";

const TaskItem = ({ task, onEdit, onDelete, onToggleCompletion }) => (
  <li style={{ textDecoration: task.completed ? "line-through" : "none" }}>
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => onToggleCompletion(task)}
    />
    {task.description} - {task.priority} - {new Date(task.date).toDateString()}
    <button onClick={() => onEdit(task)}>Edit</button>
    <button onClick={() => onDelete(task._id)}>Delete</button>
  </li>
);

export default TaskItem;
