const scoreUpdatorRepo = require('../repositories/scoreUpdator')
const boom = require("@hapi/boom");

module.exports.scoreUpdator = async (update) => {
     try {
          for (let team of ["teamA", "teamB"]) {
               for (let i = 0; i < update[team].players.length; i++) {

                    /**
                     * PLAYER BATTING
                     */
                    let id = update[team].players[i].playerId

                    let playerBattingCollection = await scoreUpdatorRepo.findPlayerBatting(id)

                    if (!playerBattingCollection) playerBattingCollection = await scoreUpdatorRepo.createPlayerBatting(id)

                    let updatedBatting
                    updatedBatting = playerBattingCollection
                    // console.log(updatedBatting)

                    let playerBatting = update[team].players[i].playerBatting;

                    // total runs
                    updatedBatting.totalRuns += Math.max(0, playerBatting.runs);

                    // thirties
                    updatedBatting.thirties =
                         (playerBatting.runs >= 30 && playerBatting.runs < 50)
                              ? updatedBatting.thirties + 1
                              : updatedBatting.thirties;

                    // fifties
                    updatedBatting.fifties =
                         (playerBatting.runs >= 50 && playerBatting.runs < 100)
                              ? updatedBatting.fifties + 1
                              : updatedBatting.fifties;

                    // centuries
                    updatedBatting.centuries =
                         (playerBatting.runs >= 100)
                              ? updatedBatting.centuries + 1
                              : updatedBatting.centuries;

                    // fours
                    updatedBatting.fours += Math.max(0, playerBatting.fours);

                    // sixes
                    updatedBatting.sixes += Math.max(0, playerBatting.sixes);

                    // strikeRate
                    updatedBatting.strikeRate = parseFloat((Math.max(0, playerBatting.runs / playerBatting.bowls) / 100).toFixed(3));


                    // ducks
                    updatedBatting.ducks =
                         (playerBatting.runs === 0)
                              ? updatedBatting.ducks + 1
                              : updatedBatting.ducks;

                    // highestScore
                    updatedBatting.highestScore = Math.max(
                         0,
                         (playerBatting.runs > updatedBatting.highestScore)
                              ? playerBatting.runs
                              : updatedBatting.highestScore
                    );

                    // innings
                    updatedBatting.innings =
                         (playerBatting.runs >= 1)
                              ? updatedBatting.innings + 1
                              : updatedBatting.innings;

                    // noOfMatches
                    updatedBatting.noOfMatches = Math.max(
                         0,
                         updatedBatting.noOfMatches + 1
                    );

                    // average
                    updatedBatting.average =
                         updatedBatting.noOfDismissals > 0
                              ? updatedBatting.totalRuns / updatedBatting.noOfDismissals
                              : 0;

                    let updatedPlayerBattingCollection = await scoreUpdatorRepo.updatePlayerBatting(id, updatedBatting)

                    // if (updatedPlayerBattingCollection) {
                    //      console.log('batting updated')
                    // } else {
                    //      console.log('batting not updated')
                    // }



                    // console.log(`${team} : ${JSON.stringify(updatedBatting,null,2)}`);


                    /**
                    * PLAYER BOWLING
                    */

                    let playerBowlingCollection = await scoreUpdatorRepo.findPlayerBowling(id)

                    if (!playerBowlingCollection) playerBowlingCollection = await scoreUpdatorRepo.createPlayerBowling(id)


                    let updatedBowling
                    updatedBowling = playerBowlingCollection
                    // console.log(updatedBowling)

                    let playerBowling = update[team].players[i].playerBowling;

                    // innings
                    updatedBowling.innings = (playerBowling.overs > 0) ? updatedBowling.innings += 1 : updatedBowling.innings

                    // overs
                    updatedBowling.overs += playerBowling.overs

                    // wickets
                    updatedBowling.wickets += playerBowling.wickets

                    // wides
                    updatedBowling.wides += playerBowling.wides

                    // noBalls
                    updatedBowling.noBalls += playerBowling.noBalls

                    // dotBalls
                    updatedBowling.dotBalls += playerBowling.dotBalls

                    // runs
                    updatedBowling.runs += playerBowling.runs

                    // maiden
                    updatedBowling.maiden += playerBowling.maiden

                    // average
                    updatedBowling.average = parseFloat((updatedBowling.runs / updatedBowling.wickets).toFixed(3))

                    // economy
                    updatedBowling.economy = parseFloat((updatedBowling.runs / updatedBowling.wickets).toFixed(3))

                    // threeWicketsHauls
                    updatedBowling.threeWicketsHauls = (playerBowling.wickets >= 3 && playerBowling.wickets < 5) ? updatedBowling.threeWicketsHauls += 1 : updatedBowling.threeWicketsHauls

                    // fiveWicketsHauls
                    updatedBowling.fiveWicketsHauls = (playerBowling.wickets >= 5) ? updatedBowling.fiveWicketsHauls += 1 : updatedBowling.fiveWicketsHauls

                    // bestFigures
                    let [runs, wickets] = updatedBowling.bestFigures.split("/").map(Number);

                    if (updatedBowling.bestFigures === '0/0') {
                         updatedBowling.bestFigures = `${playerBowling.runs}/${playerBowling.wickets}`
                         // console.log(updatedBowling.bestFigures)
                    }
                    else {
                         let bestF1 = runs / wickets
                         let bestF2 = playerBowling.runs / playerBowling.wickets

                         if (bestF1 < bestF2) {
                              updatedBowling.bestFigures = `${runs}/${wickets}`
                         }
                         else if (bestF1 === bestF2) {
                              updatedBowling.bestFigures = `${runs}/${wickets}`
                         }
                         else if (bestF2 < bestF1) {
                              updatedBowling.bestFigures = `${playerBowling.runs}/${playerBowling.wickets}`
                         }

                         // console.log(updatedBowling.bestFigures)
                    }

                    // console.log(`${playerBowling.runs}/${playerBowling.wickets}`)
                    // console.log(`${runs}/${wickets}`)

                    // console.log(`${team} : ${JSON.stringify(updatedBowling,null,2)}`);
                    let updatedPlayerBowlingCollection = await scoreUpdatorRepo.updatePlayerBowling(id, updatedBowling)

                    // if (updatedPlayerBowlingCollection) {
                    //      console.log('Bowling updated')
                    // } else {
                    //      console.log('Bowling not updated')
                    // }
                    /**
               * PLAYER FIELDING
               */
                    let playerFieldingCollection = await scoreUpdatorRepo.findPlayerFielding(id)

                    if (!playerFieldingCollection) playerFieldingCollection = await scoreUpdatorRepo.createPlayerFielding(id)


                    let updatedFielding
                    updatedFielding = playerFieldingCollection


                    let playerFielding = update[team].players[i].playerFielding;
                    // catches
                    updatedFielding.catches += 1
                    // runout
                    updatedFielding.runOut += 1
                    // stumping
                    updatedFielding.stumping += 1

                    let updatedPlayerFieldingCollection = await scoreUpdatorRepo.updatePlayerFielding(id, updatedFielding)

                    // if (updatedPlayerFieldingCollection) {
                    //      console.log('fielding updated')
                    // } else {
                    //      console.log('fielding not updated')
                    // }
                    /**
                   * PLAYER STATISTICS
                   */

                    let playerStatisticsCollection = await scoreUpdatorRepo.findPlayerStatistics(id)

                    if (!playerStatisticsCollection) playerStatisticsCollection = await scoreUpdatorRepo.createPlayerStatistics(id)


                    let updatedStatistics
                    updatedStatistics = playerStatisticsCollection

                    let playerStatistics = update[team].players[i].playerStatistics;

                    // totalInnings
                    if (playerBatting.runs || playerBowling.overs) updatedStatistics.totalInnings += 1
                    // totalMatches
                    updatedStatistics.totalMatches += 1
                    // won
                    if (team === 'teamA') {
                         if (update.teamA.score > update.teamB.score) updatedStatistics.won += 1;
                         else if (update.teamA.score < update.teamB.score) updatedStatistics.loose += 1;
                         else updatedStatistics.draws += 1;
                    }
                    if (team === 'teamB') {
                         if (update.teamB.score > update.teamA.score) updatedStatistics.won += 1;
                         else if (update.teamB.score < update.teamA.score) updatedStatistics.loose += 1;
                         else updatedStatistics.draws += 1;
                    }
                    let updatedPlayerStatisticsCollection = await scoreUpdatorRepo.updatePlayerStatistics(id, updatedStatistics)

                    // if (updatedPlayerStatisticsCollection) {
                    //      console.log('Statistics updated')
                    // } else {
                    //      console.log('Statistics not updated')
                    // }

                    // console.log(`${team} : ${JSON.stringify(updatedStatistics,null,2)}`);
               }

               let teamId = update[team].teamId
               // console.log(teamId)
               /**
              * TEAM SCORES
              */
               let teamScoresCollection = await scoreUpdatorRepo.findTeamScores(teamId)

               if (!teamScoresCollection) teamScoresCollection = await scoreUpdatorRepo.createTeamScores(teamId)

               let updatedTeamScores
               updatedTeamScores = teamScoresCollection

               let teamScores = update[team].teamScores;
               let score = update[team].score

               // highestTeamScore
               updatedTeamScores.highestTeamScore = (score > updatedTeamScores.highestTeamScore) ? score : updatedTeamScores.highestTeamScore

               // lowestTeamScore
               if (updatedTeamScores.lowestTeamScore === 0) {
                    updatedTeamScores.lowestTeamScore = score
               }
               else {
                    updatedTeamScores.lowestTeamScore = (score < updatedTeamScores.lowestTeamScore) ? score : updatedTeamScores.lowestTeamScore
               }

               let updatedTeamScoresCollection = await scoreUpdatorRepo.updateTeamScores(teamId, updatedTeamScores)

               // if (updatedTeamScoresCollection) {
               //      console.log('team scores updated')
               // } else {
               //      console.log('team scores not updated')
               // }

               // console.log(`${team} : ${JSON.stringify(updatedTeamScores,null,2)}`);

               /**
              * TEAM STATISTICS
              */
               let teamStatisticsCollection = await scoreUpdatorRepo.findTeamStatistics(teamId)

               if (!teamStatisticsCollection) teamStatisticsCollection = await scoreUpdatorRepo.createTeamStatistics(teamId)

               let updatedTeamStatistics
               updatedTeamStatistics = teamStatisticsCollection

               let teamStatistics = update[team].teamStatistics;

               //  totalMatchesPlayed
               updatedTeamStatistics.totalMatchesPlayed += 1
               if (team === 'teamA') {
                    if (update.teamA.score > update.teamB.score) updatedTeamStatistics.totalWins += 1;
                    else if (update.teamA.score < update.teamB.score) updatedTeamStatistics.totalLosses += 1;
                    else updatedTeamStatistics.totalDraws += 1;
               }
               if (team === 'teamB') {
                    if (update.teamB.score > update.teamA.score) updatedTeamStatistics.totalWins += 1;
                    else if (update.teamB.score < update.teamA.score) updatedTeamStatistics.totalLosses += 1;
                    else updatedTeamStatistics.totalDraws += 1;
               }

               //  winningPercentage
               updatedTeamStatistics.winningPercentage = parseFloat(((updatedTeamStatistics.totalWins / updatedTeamStatistics.totalMatchesPlayed) * 100).toFixed(3))

               let updatedTeamStatisticsCollection = await scoreUpdatorRepo.updateTeamStatistics(teamId, updatedTeamStatistics)

               // if (updatedTeamStatisticsCollection) {
               //      console.log('team Statistics updated')
               // } else {
               //      console.log('team Statistics not updated')
               // }
               //  console.log(`${team} : ${JSON.stringify(updatedTeamStatistics,null,2)}`);
          }
          return true

     }
     catch (error) {
          console.log(error);
          throw boom.badRequest(error.message)
     }
}