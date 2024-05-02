const Task = require("../models/Task");

module.exports = {
  all: getTasks,
  add: addTask,
  update: updateTask,
  delete: deleteTask,
};

async function getTasks(req, res) {
  const tasks = await Task.find();
  res.json(tasks);
}

async function addTask(req, res, io) {
  try {
    const task = req.body;
    const newTask = await Task.create(task);
    io.emit("taskAdded", newTask); // Emit event after a task is added
    console.log(io.emit("taskAdded", newTask)); // Emit event after a task is added
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500);
    console.log(err);
  }
}

async function updateTask(req, res, io) {
  const id = req.params.id;
  const task = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, task, { new: true });
    io.emit("taskUpdated", updatedTask); // Emit event after a task is updated
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).send(err);
  }
}

async function deleteTask(req, res, io) {
  const id = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    io.emit("taskDeleted", { id }); // Emit event after a task is deleted
    res.status(200).json({ id });
  } catch (err) {
    res.status(500).send(err);
  }
}
