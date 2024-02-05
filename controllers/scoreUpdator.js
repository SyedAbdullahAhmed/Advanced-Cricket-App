const scoreUpdatorServices = require('../services/scoreUpdator')

module.exports.scoreUpdator = async (req, res) => {
     try {
          const payLoad = req.body
         
          // console.log(payLoad);
          const updatedScore = await scoreUpdatorServices.scoreUpdator(payLoad)
          if (!updatedScore) return res.status(400).json({ response: false, message: 'Scores updation failed' })
          res.status(200).json({ response: true, message: 'Score updated successfully' })
     }
     catch (error) {
          console.log(error);
          res.status(400).json({ response: false, message: error.message })
     }
}