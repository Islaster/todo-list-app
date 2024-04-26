const taskCtrl = require("../controllers/Task");
const express = require("express");
const router = express.Router();

router.get("/", taskCtrl.all);
router.post("/", taskCtrl.add);
router.put("/:id", taskCtrl.update);
router.delete("/:id", taskCtrl.delete);

module.exports = router;
