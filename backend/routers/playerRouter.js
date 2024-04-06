const { Router } = require("express");

// Knex Setup
const knexConfig = require("../knexfile");
const knex = require("knex");
const knexInstance = knex(knexConfig.development);

const PlayerService = require("../services/playerService");
const playerService = new PlayerService(knexInstance);

const router = Router();

router.route("/list").get(getTopPlayersData);
router.route("/saveData").post(savePlayerData);
router.route("/getPlayerRank/:playerId").get(getPlayerRank)

async function getTopPlayersData(_, res) {
  try {
    const data = await playerService.list();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function savePlayerData(req, res) {
  try {
    const data = await playerService.insert(req.body);
    res.json(data)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getPlayerRank(req, res) {
  try {
    const playerId = req.params.playerId
    const data = await playerService.getPlayerRank(playerId);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = router;