const { db } = require('../config/db');

exports.getMeals = (req, res, next) => {
  try {
    const { date } = req.query;
    let meals;
    if (date) {
      meals = db.prepare('SELECT * FROM meals WHERE user_id = ? AND DATE(logged_at) = ? ORDER BY logged_at DESC').all(req.user.id, date);
    } else {
      meals = db.prepare('SELECT * FROM meals WHERE user_id = ? ORDER BY logged_at DESC LIMIT 50').all(req.user.id);
    }
    res.json({ meals });
  } catch (err) { next(err); }
};

exports.getTodayMeals = (req, res, next) => {
  try {
    const meals = db.prepare("SELECT * FROM meals WHERE user_id = ? AND DATE(logged_at) = DATE('now') ORDER BY logged_at ASC").all(req.user.id);
    const s = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalFiber: 0, mealCount: meals.length };
    meals.forEach(m => { s.totalCalories += m.calories||0; s.totalProtein += m.protein_g||0; s.totalCarbs += m.carbs_g||0; s.totalFat += m.fat_g||0; s.totalFiber += m.fiber_g||0; });
    Object.keys(s).forEach(k => { if (typeof s[k]==='number' && k!=='mealCount') s[k] = Math.round(s[k]*10)/10; });
    const user = db.prepare('SELECT daily_calorie_goal FROM users WHERE id = ?').get(req.user.id);
    res.json({ meals, summary: s, calorieGoal: user?.daily_calorie_goal || 2000 });
  } catch (err) { next(err); }
};

exports.getMeal = (req, res, next) => {
  try {
    const meal = db.prepare('SELECT * FROM meals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!meal) return res.status(404).json({ error: 'Meal not found.' });
    res.json({ meal });
  } catch (err) { next(err); }
};

exports.createMeal = (req, res, next) => {
  try {
    const { meal_type, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, notes } = req.body;
    if (!meal_type || !food_name || calories === undefined) return res.status(400).json({ error: 'meal_type, food_name, and calories are required.' });
    const valid = ['breakfast','lunch','dinner','snack'];
    if (!valid.includes(meal_type)) return res.status(400).json({ error: 'Invalid meal_type' });
    const result = db.prepare('INSERT INTO meals (user_id, meal_type, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, notes) VALUES (?,?,?,?,?,?,?,?,?)').run(req.user.id, meal_type, food_name, calories, protein_g||0, carbs_g||0, fat_g||0, fiber_g||0, notes||null);
    const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Meal logged', meal });
  } catch (err) { next(err); }
};

exports.updateMeal = (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM meals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ error: 'Meal not found.' });
    const { meal_type, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, notes } = req.body;
    db.prepare('UPDATE meals SET meal_type=COALESCE(?,meal_type), food_name=COALESCE(?,food_name), calories=COALESCE(?,calories), protein_g=COALESCE(?,protein_g), carbs_g=COALESCE(?,carbs_g), fat_g=COALESCE(?,fat_g), fiber_g=COALESCE(?,fiber_g), notes=COALESCE(?,notes) WHERE id=? AND user_id=?').run(meal_type, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, notes, req.params.id, req.user.id);
    const meal = db.prepare('SELECT * FROM meals WHERE id = ?').get(req.params.id);
    res.json({ message: 'Meal updated', meal });
  } catch (err) { next(err); }
};

exports.deleteMeal = (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM meals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ error: 'Meal not found.' });
    db.prepare('DELETE FROM meals WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ message: 'Meal deleted' });
  } catch (err) { next(err); }
};

exports.getWeeklyStats = (req, res, next) => {
  try {
    const stats = db.prepare("SELECT DATE(logged_at) as date, COUNT(*) as meal_count, ROUND(SUM(calories),1) as total_calories, ROUND(SUM(protein_g),1) as total_protein, ROUND(SUM(carbs_g),1) as total_carbs, ROUND(SUM(fat_g),1) as total_fat, ROUND(SUM(fiber_g),1) as total_fiber FROM meals WHERE user_id = ? AND DATE(logged_at) >= DATE('now','-7 days') GROUP BY DATE(logged_at) ORDER BY date ASC").all(req.user.id);
    const user = db.prepare('SELECT daily_calorie_goal FROM users WHERE id = ?').get(req.user.id);
    res.json({ stats, calorieGoal: user?.daily_calorie_goal || 2000 });
  } catch (err) { next(err); }
};
