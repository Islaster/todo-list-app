import React from "react";

const TaskForm = ({
  taskInput,
  setTaskInput,
  priorityInput,
  setPriorityInput,
  dateInput,
  setDateInput,
  onSubmit,
  editingId,
}) => (
  <div>
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
    <button onClick={onSubmit}>{editingId ? "Update Task" : "Add Task"}</button>
  </div>
);

export default TaskForm;
