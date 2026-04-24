const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMeals, getTodayMeals, getMeal, createMeal, updateMeal, deleteMeal, getWeeklyStats } = require('../controllers/mealController');

router.get('/', auth, getMeals);
router.get('/today', auth, getTodayMeals);
router.get('/stats/weekly', auth, getWeeklyStats);
router.get('/:id', auth, getMeal);
router.post('/', auth, createMeal);
router.put('/:id', auth, updateMeal);
router.delete('/:id', auth, deleteMeal);

module.exports = router;
