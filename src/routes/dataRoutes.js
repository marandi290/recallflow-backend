const express = require("express");
const router = express.Router();

const dataController = require("../controllers/dataController");

router.get("/export", dataController.exportData);
router.post("/import", dataController.importData);

module.exports = router;
