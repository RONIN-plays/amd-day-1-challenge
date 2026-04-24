const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRecommendations, dismissRecommendation, regenerateRecommendations } = require('../controllers/recommendationController');

router.get('/', auth, getRecommendations);
router.post('/:id/dismiss', auth, dismissRecommendation);
router.post('/generate', auth, regenerateRecommendations);

module.exports = router;
