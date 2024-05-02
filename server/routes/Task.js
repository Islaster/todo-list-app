const taskCtrl = require("../controllers/Task");
const express = require("express");
const router = express.Router();

// Wrap the controller call to pass the socket object
router.get("/", (req, res) => taskCtrl.all(req, res));
router.post("/", (req, res) => {
  const io = req.app.get("io");
  taskCtrl.add(req, res, io);
});
router.put("/:id", (req, res) => {
  const io = req.app.get("io");
  taskCtrl.update(req, res, io);
});
router.delete("/:id", (req, res) => {
  const io = req.app.get("io");
  taskCtrl.delete(req, res, io);
});

module.exports = router;
