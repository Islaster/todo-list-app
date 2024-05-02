import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onEdit, onDelete, onToggleCompletion }) => (
  <ul>
    {tasks.map((task) => (
      <TaskItem
        key={task._id}
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleCompletion={onToggleCompletion}
      />
    ))}
  </ul>
);

export default TaskList;
