const express = require('express')
const router = express.Router()
const scoreUpdator = require('../controllers/scoreUpdator')

router.post('/scoreUpdator',scoreUpdator.scoreUpdator)

module.exports = router