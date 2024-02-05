const teamInfoModel = require('../models/team/teamInformation')
const teamScoreModel = require('../models/team/teamScore')
const teamStatisticsModel = require('../models/team/teamStatistics')
const playerInfoModel = require('../models/user')
const playerInfosModel = require('../models/player/playerInfo')
const invitationModel = require('../models/team/teamInvitationToPlayers')
const teamMatchInfo = require('../models/player/teamMatchInfo')
const match = require("../models/match")
const mongoose = require('mongoose')


module.exports.createTeam = async (payLoad) => {
     // console.log(payLoad)
     return teamInfoModel.create(payLoad)
}

module.exports.findOneByName = async (name) => {
     return await teamInfoModel.findOne({ name })
}



module.exports.findTeam = async (id) => {
     return await teamInfoModel.findOne({ _id: id })
}

// teaminfo aggregate with teamscores and teamStatistics
module.exports.findAll = async () => {
     const teamOtherInfo = await teamInfoModel.aggregate([
          {
               $lookup: {
                    from: "teamscores",
                    localField: "_id",
                    foreignField: "teamId",
                    as: "TeamScore",
               },
          },
          {
               $lookup: {
                    from: "teamstatistics",
                    localField: "_id",
                    foreignField: "teamId",
                    as: "TeamStatistics",
               },
          },
     ]);
     return teamOtherInfo;
};

exports.getPlayersOfTeam = (teamId) => {
     return teamInfoModel.findOne({ _id: teamId }).select('players')
}

// teaminfo aggregate with teamscores and teamStatistics
module.exports.findOneByID = async (id) => {
     const findTeam = await teamInfoModel.findOne({ _id: id });

     if (!findTeam) {
          return null;
     }
     const teamOtherInfo = await teamInfoModel.aggregate([
          {
               $match: { _id: findTeam._id },
          },
          {
               $lookup: {
                    from: "teamscores",
                    localField: "_id",
                    foreignField: "teamId",
                    as: "teamScore",
               },
          },
          {
               $lookup: {
                    from: "teamstatistics",
                    localField: "_id",
                    foreignField: "teamId",
                    as: "teamStatistics",
               },
          },
     ]);
     return teamOtherInfo
}

module.exports.updateTeamByID = async (id, payLoad) => {
     return await teamInfoModel.findOneAndUpdate({ _id: id }, { $set: payLoad }, { new: true })
}

module.exports.deleteTeamByID = async (id) => {
     return await teamInfoModel.findOneAndDelete({ _id: id })
}

// team score
exports.createTeamScoreById = (id) => {
     return teamScoreModel.create({ teamId: id })
}

exports.findTeamScoreById = (id) => {
     return teamScoreModel.findOne({ teamId: id })
}

exports.updateTeamScoreById = async (id, payLoad) => {
     return teamScoreModel.findOneAndUpdate({ teamId: id }, { $set: payLoad }, { new: true });
}

// team statisctics
exports.createTeamStatisticsById = (id) => {
     return teamStatisticsModel.create({ teamId: id })
}

exports.findTeamStatisticsById = (id) => {
     return teamStatisticsModel.findOne({ teamId: id })
}

exports.updateTeamStatisticsById = async (id, payLoad) => {
     return teamStatisticsModel.findOneAndUpdate({ teamId: id }, { $set: payLoad }, { new: true });
}

module.exports.findTeam = async (id) => {
     return teamInfoModel.findOne({ _id: id })
}

exports.findPlayer = async (id) => {
     return playerInfoModel.findOne({ _id: id })
}

exports.findPlayerInfo = async (id) => {
     return playerInfosModel.findOne({ userId: id })
}
exports.createPlayerInfo = async (payLoad) => {
     return playerInfosModel.create(payLoad)
}

module.exports.findPlayer = (id) => {
     return playerInfoModel.findOne({ _id: id })
}

module.exports.findPlayers = async (id) => {
     return teamInfoModel.findOne({ _id: id }).select('players')
}
module.exports.getTeamPlayerData = async (array) => {
     return playerInfoModel.find({ _id: { $in: array } }).select('_id fullName role')
}

module.exports.updatePlayerToCaptain = async (id, payLoad) => {
     return playerInfoModel.findOneAndUpdate({ _id: id }, { $set: payLoad }, { new: true })
}
module.exports.assignTeamCaptain = async (userId, teamId) => {
     return playerInfoModel.findOneAndUpdate({ _id: teamId }, { $set: { captain: userId } }, { new: true })
}

module.exports.findInvitationModel = async (teamId) => {
     return await invitationModel.findOne({ teamId: teamId })
}
module.exports.createInvitationModel = async (teamId) => {
     return invitationModel.create({ teamId: teamId })
}

module.exports.getTeamCount = () => {
     return teamInfoModel.countDocuments({})
}

module.exports.findTeamMatchInfo = async (id) => {
     return await teamMatchInfo.findOne({ userId: id })
}
module.exports.createTeamMatchInfo = async (id) => {
     return teamMatchInfo.create({ userId: id })
}

module.exports.getInvitationsIds = async (teamId) => {
     return await invitationModel.find({ 'invitedTeams.opponentTeamId': teamId }).select('teamId').exec();
}

module.exports.getAllInvitations = async (array) => {
     return await teamInfoModel.find({ _id: { $in: array } }).select('_id name')
}

module.exports.findDuplicate = async (userId) => {
     return teamInfoModel.find({ players: userId })
}

module.exports.declineInvitation = async (teamId) => {
     return await invitationModel.findOne({ teamId: teamId })
}

module.exports.findMatch = async (id) => {
     return match.findOne({ _id: id })
}
module.exports.getTeamMatchHistory = async (id) => {
     // return teamInfoModel.findOne({_id : id}).select('matchHistory')
     return teamInfoModel.aggregate([
               {
               $match: { _id: new mongoose.Types.ObjectId(id) }
             },
             {
               $project: {
                 matchHistory: 1
               }
             },
             {
               $unwind: "$matchHistory"
             },
             {
               $lookup: {
                 from: "matches",
                 let: { matchHistoryId: "$matchHistory" },
                 pipeline: [
                   {
                     $match: {
                       $expr: {
                         $eq: ["$_id", { $toObjectId: "$$matchHistoryId" }]
                       }
                     }
                   }
                 ],
                 as: "match"
               }
             },
             {
               $unwind: "$match" 
             },
             {
               $project: {
                 "match.date": 1,
                 "match.venue": 1,
                 "match.time": 1
               }
             }
     ])
}
