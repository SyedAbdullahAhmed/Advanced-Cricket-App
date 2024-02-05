const express = require("express");
const router = express.Router();

const match = require("../controllers/match");
const { verifyToken } = require("../middleware/authentication");

router.post("/match/:id",verifyToken, match.createMatch);
router.put("/match/:id", match.updateMatchInfoByID);
router.get("/match", match.getAllMatches);
router.get("/match/:id", match.getMatchByID);

router.post("/match/:matchId/team/:teamId", match.addTeamInMatchByID);
router.delete("/match/:matchId/team/:teamId", match.removeTeamInMatchByID);

router.get("/matchTeamAndPlayersInfo/:matchId", match.matchTeamAndPlayersInfo);

module.exports = router;
