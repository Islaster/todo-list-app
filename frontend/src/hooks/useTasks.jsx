import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const result = await axios.get("http://localhost:3001/");
      setTasks(result.data);
    };

    fetchTasks();
    socket.on("taskUpdated", fetchTasks);
    socket.on("taskAdded", fetchTasks);

    return () => {
      socket.off("taskUpdated");
      socket.off("taskAdded");
    };
  }, []);

  const addOrUpdateTask = async (taskData, editingId) => {
    if (editingId) {
      await axios.put(`http://localhost:3001/${editingId}`, taskData);
    } else {
      await axios.post("http://localhost:3001/", taskData);
    }
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3001/${id}`);
  };

  return { tasks, addOrUpdateTask, deleteTask };
};
