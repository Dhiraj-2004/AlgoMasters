const express = require('express');
const router = express.Router();
const { getUserRankByScores } = require('../controllers/amcatController');

// Define route
router.get('/user/rank/:amcatID', getUserRankByScores);


module.exports = router;
