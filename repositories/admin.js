const userRepo = require("./user");
const playerRepo = require("./player");
const teamRepo = require("./team");

exports.getCount = async () => {
  return {
    user: await userRepo.getUsersCount(),
    player: await playerRepo.getPlayersCount(),
    team: await teamRepo.getTeamCount(),
  };
};
