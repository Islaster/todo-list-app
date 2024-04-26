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

async function getTask(req, res) {
  const id = req.params.id;
  const task = await Task.findById(id);
  res.json(task);
}

function addTask(req, res) {
  try {
    const task = req.body;
    Task.create(task);
  } catch (err) {
    console.log(err);
  }
}

async function updateTask(req, res) {
  const id = req.params.id;
  const task = req.body;
  try {
    await Task.findByIdAndUpdate(id, task);
  } catch (err) {
    console.log(err);
  }
}

async function deleteTask(req, res) {
  const id = req.params.id;
  try {
    await Task.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
}
