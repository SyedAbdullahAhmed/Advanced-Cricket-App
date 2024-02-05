const express = require("express");
const router = express.Router();

const { createUmpire } = require("../controllers/umpire");

router.post("/createUmpire", createUmpire);

module.exports = router;
