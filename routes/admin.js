const express = require("express");
const { getCount } = require("../controllers/admin");
const router = express.Router();

router.get("/getCount", getCount);
//router.put('/updatePlayer')
module.exports = router;
