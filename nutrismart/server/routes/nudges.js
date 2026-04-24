const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNudges, getActiveNudges, createNudge, updateNudge, deleteNudge, completeNudge } = require('../controllers/nudgeController');

router.get('/', auth, getNudges);
router.get('/active', auth, getActiveNudges);
router.post('/', auth, createNudge);
router.put('/:id', auth, updateNudge);
router.delete('/:id', auth, deleteNudge);
router.post('/:id/complete', auth, completeNudge);

module.exports = router;
