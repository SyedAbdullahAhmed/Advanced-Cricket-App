const boom = require("@hapi/boom");
const playerRepo = require("../repositories/player");

exports.createNewPlayer = async (payLoad) => {
  try {
    // check if player already exist or not
    const user = await playerRepo.findPlayerById(payLoad.userId);
    if (!user.role.toLowerCase() === 'audience') throw boom.badRequest('Player creation failed')

    // convert it to player
    user.role = 'player'
    await user.save()

    // create player
    const newUser = await playerRepo.createNewPlayer(payLoad);
    return newUser;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.updatePlayerBatting = async (playerId, payLoad) => {
  try {
    let player = (await playerRepo.findPlayerBattingById(playerId)) || false;
    if (!player) player = await playerRepo.createPlayerBatting(playerId);
    console.log(`player in service batting: ${player}`);
    const updatedPlayerBatting = await playerRepo.updatePlayerBatting(
      playerId,
      payLoad
    );

    console.log(`updated batting in services: ${updatedPlayerBatting}`);
    return updatedPlayerBatting;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.updatePlayerBowling = async (playerId, payLoad) => {
  try {
    let player = (await playerRepo.findPlayerBowlingById(playerId)) || false;
    if (!player) player = await playerRepo.createPlayerBowling(playerId);

    const updatedPlayerBowling = await playerRepo.updatePlayerBowling(
      playerId,
      payLoad
    );
    return updatedPlayerBowling;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.updatePlayerFielding = async (playerId, payLoad) => {
  try {
    let player = (await playerRepo.findPlayerFieldingById(playerId)) || false;
    if (!player) player = await playerRepo.createPlayerFielding(playerId);

    const updatedPlayerFielding = await playerRepo.updatePlayerFielding(
      playerId,
      payLoad
    );
    return updatedPlayerFielding;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.updatePlayerStatistics = async (playerId, payLoad) => {
  try {
    let player = (await playerRepo.findPlayerStatisticsById(playerId)) || false;
    if (!player) player = await playerRepo.createPlayerStatistics(playerId);

    const updatedPlayerStatistics = await playerRepo.updatePlayerStatistics(
      playerId,
      payLoad
    );
    return updatedPlayerStatistics;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.getAllPlayer = async () => {
  try {
    const players = await playerRepo.getAllPlayers();
    if (!players) throw boom.badRequest("players not found");
    return players;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.getPlayerId = async (id) => {
  try {
    const player = await playerRepo.findPlayerById(id);
    if (!player) throw boom.badRequest("player not found");
    return player._id;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.getPlayer = async (id) => {
  try {
    let player = await playerRepo.getPlayer(id);
    if (!player) throw boom.badRequest("player not found");

    return player;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.getPlayersForInvitation = async (teamId) => {
  try {

    // get all player whose are not the part of taem
    const teamPlayers = await playerRepo.getPlayersOfTeam(teamId);

    const nonInvitedPlayer = await playerRepo.getPlayersForInvitation();

    if (!nonInvitedPlayer)
      throw boom.badRequest("no player for invitation available");


    const filteredPlayers = [];

    for (let i = 0; i < nonInvitedPlayer.length; i++) {

      if (
        !teamPlayers.players.includes(
          nonInvitedPlayer[i].UninvitedPlayers[0]._id
        )
      ) {

        filteredPlayers.push({
          profilePicture: nonInvitedPlayer[i].profilePicture,
          fullName: nonInvitedPlayer[i].fullName,
          playingRole: nonInvitedPlayer[i].UninvitedPlayers[0].playingRole,
          playerId: nonInvitedPlayer[i].UninvitedPlayers[0]._id,
        });
      }
    }
    //now compare
    //   const parsedInvitedPlayer = await JSON.stringify(nonInvitedPlayer);
    //  console.log(parsedInvitedPlayer)
    //   const filtered = teamPlayers.players.filter((element) => {
    //    // console.log(parsedInvitedPlayer);
    //     for (let i = 0; i < parsedInvitedPlayer.length; i++) {
    //       console.table(`nonInvitedPlayer:\n${parsedInvitedPlayer[i]}`);
    //       if (
    //         parsedInvitedPlayer[i].UninvitedPlayer.length!=[] &&
    //         parsedInvitedPlayer[i].UninvitedPlayer[0]._id &&
    //         element !== parsedInvitedPlayer[i].UninvitedPlayer[0]._id
    //     ) {
    //         return parsedInvitedPlayer[i];
    //     }

    //     }
    //   });

    return filteredPlayers;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

exports.getPlayerTeamData = async (userId) => {
  try {
    // const team = await playerRepo.getTeam(userId);

    // if (!team) throw boom.badRequest("no teams of this player");
    // const playersData = await playerRepo.getPlayerTeamData(team.teamId);
    const playersData = await playerRepo.getPlayerTeamData(userId);
    console.log(playersData)

    return playersData;
  } catch (error) {
    console.log(error)
    throw boom.badRequest(error.message);
  }
};

module.exports.getAllInvitations = async (userId) => {
  try {
    const user = await playerRepo.findPlayerById(userId)
    if (!user) throw boom.badRequest('player not found')

    if (user.role.toLowerCase() === 'player' || user.role.toLowerCase() === 'captain') {
      const invitationInfo = await playerRepo.getInvitationsIds(userId)
      return invitationInfo
    }
    else if (user.role.toLowerCase() === 'umpire') {
      const invitationInfo = await playerRepo.getInvitationsIds(userId)
      return invitationInfo
    }

  }
  catch (error) {
    console.log(error)
    throw boom.badRequest(error.message)
  }
}

module.exports.declineInvitation = async (userId, teamId) => {
  try {
    const user = await playerRepo.findPlayerById(userId)
    console.log(user)
    if (!user) throw boom.badRequest('User not found')

    if(user.role.toLowerCase() === 'player') {
      let findInvitedPlayers = await playerRepo.declineInvitation(teamId)
      findInvitedPlayers.invitedPlayers = findInvitedPlayers.invitedPlayers.filter((element) => element !== userId);
      await findInvitedPlayers.save()
      return findInvitedPlayers
    }
    else if(user.role.toLowerCase() === 'umpire') {
      let findInvitedUmpires = await playerRepo.declineInvitation(teamId)
      console.log(findInvitedUmpires)
      findInvitedUmpires.invitedUmpires = findInvitedUmpires.invitedUmpires.filter((element) => element !== userId);
      await findInvitedUmpires.save()
      return findInvitedUmpires
    }
  }
  catch (error) {
    console.log(error)
    throw boom.badRequest(error.message)
  }
}

module.exports.createdByPlayer = async (userId) => {
  try {
    // find team match model
    const teamMatchInfo = await playerRepo.findTeamMatchInfo(userId)
    console.log(teamMatchInfo)
    const teamArray = teamMatchInfo.createdTeam
    const teamInfo = await playerRepo.getTeamInfo(teamArray)
    console.log(teamInfo)
    return teamInfo
  }
  catch (error) {
    console.log(error)
    throw boom.badRequest(error.message)
  }
}

module.exports.getAllPlayersInfos = async () => {
  try {
    const players = await playerRepo.getAllPlayersInfos();
    if (!players) throw boom.badRequest("players not found");
    return players;
  } catch (error) {
    throw boom.badRequest(error.message);
  }
};

module.exports.getPlayerMatchHistory = async(userId) => {
  try{
      const history = await playerRepo.getPlayerMatchHistory(userId)
      console.log(history)
      return history
  }
  catch(error) {
    consoel.lgo(error)
    throw boom.badRequest(error.message);
  }
}

module.exports.getAllUmpires = async(userId) => {
  try{
      const umpires = await playerRepo.getAllUmpires()
      return umpires
  }
  catch(error) {
    consoel.lgo(error)
    throw boom.badRequest(error.message);
  }
}