const playerServices = require("../services/player");

module.exports.createNewPlayer = async (req, res, next) => {
  try {
    const payLoad = {
      userId: req.user.id,
      playingRole: req.body.playingRole,
    };

    const player = await playerServices.createNewPlayer(payLoad);
    if (!player)
      return res
        .status(400)
        .json({ response: false, message: "unable to create player" });
    res
      .status(200)
      .json({ response: true, message: "player created successfully" });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

//update
module.exports.updatePerformance = async (req, res, next) => {
  try {
    const payLoad = req.body;
    const userId = req.user.id;
    console.log(userId);
    const keys = Object.keys(payLoad);
    let updated = {};
    // console.log(payLoad)

    const playerId = await playerServices.getPlayerId(userId);
    if (!playerId)
      return res
        .status(401)
        .json({ response: false, message: "player does not exists" });

    if (!(Object.keys(payLoad).length > 0))
      return res
        .status(400)
        .json({ response: false, message: "sent payload was empty" });

    keys.forEach(async (element) => {
      switch (element) {
        case "batting":
          console.log('batting')
          updated.batting = await playerServices.updatePlayerBatting(
            playerId,
            payLoad.batting
          );
          console.log(`playerbatting:${updated.batting}`);
          break;
        case "bowling":
          updated.bowling = await playerServices.updatePlayerBowling(
            playerId,
            payLoad.bowling
          );
          console.log(`playerbowling:${updated.bowling}`);
          break;
        case "fielding":
          updated.fielding = await playerServices.updatePlayerFielding(
            playerId,
            payLoad.fielding
          );
          console.log(`playerfielding:${updated.fielding}`);
          break;
        case "statistics":
          updated.statistics = await playerServices.updatePlayerStatistics(
            playerId,
            payLoad.statistics
          );
          console.log(`playerstatistics:${updated.statistics}`);
          break;
      }
    });
    if (!updated)
      return res
        .status(400)
        .json({ response: false, message: "unable to update" });
    console.log(`updated: ${updated}`);
    return res
      .status(200)
      .json({ response: true, message: "Player Updated Sucessfully" });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

// module.exports.updatePlayerBatting = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const payLoad = req.body;

//     const updatedPlayerBatting = await playerServices.updatePlayerBatting(
//       userId,
//       payLoad
//     );
//     if (!updatedPlayerBatting)
//       res
//         .status(400)
//         .json({ response: false, message: "failed to update player batting" });
//     res
//       .status(200)
//       .json({ response: true, message: "player batting updated successfully" });
//   } catch (error) {
//     res.status(400).json({ response: false, message: error.message });
//   }
// };

// module.exports.updatePlayerBowling = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const payLoad = req.body;

//     const updatedPlayerBowling = await playerServices.updatePlayerBowling(
//       userId,
//       payLoad
//     );
//     if (!updatedPlayerBowling)
//       res
//         .status(400)
//         .json({ response: false, message: "failed to update player bowling" });
//     res
//       .status(200)
//       .json({ response: true, message: "player bowling updated successfully" });
//   } catch (error) {
//     res.status(400).json({ response: false, message: error.message });
//   }
// };

// module.exports.updatePlayerFielding = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const payLoad = req.body;

//     const updatedPlayerFielding = await playerServices.updatePlayerFielding(
//       userId,
//       payLoad
//     );
//     if (!updatedPlayerFielding)
//       res
//         .status(400)
//         .json({ response: false, message: "failed to update player fielding" });
//     res.status(200).json({
//       response: true,
//       message: "player fielding updated successfully",
//     });
//   } catch (error) {
//     res.status(400).json({ response: false, message: error.message });
//   }
// };

// module.exports.updatePlayerStatistics = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const payLoad = req.body;

//     const updatedPlayerStatistics = await playerServices.updatePlayerStatistics(
//       userId,
//       payLoad
//     );
//     if (!updatedPlayerStatistics)
//       res.status(400).json({
//         response: false,
//         message: "failed to update player statistics",
//       });
//     res.status(200).json({
//       response: true,
//       message: "player statistics updated successfully",
//     });
//   } catch (error) {
//     res.status(400).json({ response: false, message: error.message });
//   }
// };

module.exports.getAllPlayers = async (req, res, next) => {
  try {
    const players = await playerServices.getAllPlayer();
    if (!players)
      res
        .status(400)
        .json({ response: false, message: "failed to get players" });
    res.status(200).json({ response: true, players: players });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.getPlayer = async (req, res, next) => {
  try {
    const id = req.user.id;
    const player = await playerServices.getPlayer(id);
    if (!player)
      return res
        .status(400)
        .json({ response: false, message: "unable to get player" });
    res.status(200).json({ response: true, player: player });
  } catch (error) {
    console.log(error);
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.getPlayerPerformance = async (req, res, next) => {
  try {
    const performance = {};
    const userId = req.user.id;
    const requiredPerformance = req.body.required; //required = Array
    requiredPerformance.forEach(async (element) => {
      switch (element) {
        case "batting":
          performance.batting = await playerServices.getPlayerBatting(userId);
          break;
        case "bowling":
          performance.bowling = await playerServices.getPlayerBowling(userId);
          break;
        case "fielding":
          performance.fielding = await playerServices.getPlayerFielding(userId);
          break;
        case "statistics":
          performance.statistics = await playerServices.getPlayerStatistics(
            userId
          );
          break;
        default:
          performance.message = "no data found";
      }
    });
  } catch (error) {
    res.status(400).json({ resonse: false, message: error.message });
  }
};

module.exports.getPlayersForInvitation = async (req, res, next) => {
  try {
    

    const teamId = req.params.teamId;
    if(!teamId) return res.status(400).json({response:false,message:'team id was not sent'})
    const players = await playerServices.getPlayersForInvitation(
    
      teamId
    );
    console.log(`filtered players: ${players}`);
    if (!players)
      return res
        .status(400)
        .json({ response: false, message: "no players found" });
    res.status(200).json({ response: true, players: players });
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.getPlayerTeamData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const playersTeam = await playerServices.getPlayerTeamData(userId);
    if (!playersTeam)
      return res
        .status(400)
        .json({
          response: false,
          message: "unable to fetch players team data",
        });
    res.status(200).json({ response: true, playersTeam: playersTeam });
  } catch (error) {
    res.status(400).json({ resonse: false, message: error.message });
  }
};

module.exports.allInvitations = async (req, res) => {
  try {
    const userId = req.user.id
    const allInvitations = await playerServices.getAllInvitations(userId)
    if (!allInvitations) return res.status(400).json({ response: false, message: 'Not found' })
    res.status(200).json({ response: true, allInvitations })

  }
  catch (error) {
    console.log(error)
    res.status(400).json({ resonse: false, message: error.message });
  }
}

module.exports.declineInvitation = async (req, res) => {
  try {
    const userId = req.user.id
    const teamId = req.params.teamId
    const declinedInvitation = await playerServices.declineInvitation(userId,teamId)
    if(!declinedInvitation ) return res.status(400).json({response : false ,message : 'Declined Failed'})
    res.status(200).json({response : true ,message : 'Declined successful'})

  }
  catch (error) {
    console.log(error)
    res.status(400).json({ resonse: false, message: error.message });
  }
}

module.exports.createdByPlayer = async(req,res) => {
  try{
      const userId = req.user.id
      const createdData = await playerServices.createdByPlayer(userId)
      if(!createdData) return res.status(400).json({response : false ,message : 'not found'})
      res.status(200).json({response : true ,createdData})
  }
  catch(error){
    console.log(error)
    res.status(400).json({ resonse: false, message: error.message });
  }
}

module.exports.getAllPlayersInfos = async (req, res, next) => {
  try {
    const players = await playerServices.getAllPlayersInfos();
    if (!players)
      res
        .status(400)
        .json({ response: false, message: "failed to get players" });
    res.status(200).json({ response: true, players: players });
    
  } catch (error) {
    res.status(400).json({ response: false, message: error.message });
  }
};

module.exports.getPlayerMatchHistory = async(req,res) => {
  try{
      const userId = req.user.id
      const history = await playerServices.getPlayerMatchHistory(userId)
      if(!history) return res.status(400).json({response : false ,message : 'not found'})
      res.status(200).json({response : true , history})
  }
  catch(error){
    console.log(error)
    res.status(400).json({ resonse: false, message: error.message });
  }
}

module.exports.getAllUmpires = async(req,res) => {
  try{
      const umpires = await playerServices.getAllUmpires()
      if(!umpires) return res.status(400).json({response : false ,message : 'not found'})
      res.status(200).json({response : true , umpires})
  }
  catch(error){
    console.log(error)
    res.status(400).json({ resonse: false, message: error.message });
  }
}

