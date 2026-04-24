const { db } = require('../config/db');
const foodDatabase = require('../data/foodDatabase');

exports.getRecommendations = (req, res, next) => {
  try {
    // Get existing non-dismissed recommendations
    let recs = db.prepare('SELECT * FROM recommendations WHERE user_id = ? AND is_dismissed = 0 ORDER BY created_at DESC LIMIT 10').all(req.user.id);
    if (recs.length === 0) {
      recs = generateRecommendations(req.user.id);
    }
    res.json({ recommendations: recs });
  } catch (err) { next(err); }
};

exports.dismissRecommendation = (req, res, next) => {
  try {
    const rec = db.prepare('SELECT * FROM recommendations WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!rec) return res.status(404).json({ error: 'Recommendation not found.' });
    db.prepare('UPDATE recommendations SET is_dismissed = 1 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Recommendation dismissed' });
  } catch (err) { next(err); }
};

exports.regenerateRecommendations = (req, res, next) => {
  try {
    db.prepare('UPDATE recommendations SET is_dismissed = 1 WHERE user_id = ? AND is_dismissed = 0').run(req.user.id);
    const recs = generateRecommendations(req.user.id);
    res.json({ recommendations: recs, message: 'Recommendations refreshed' });
  } catch (err) { next(err); }
};

function generateRecommendations(userId) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const meals = db.prepare("SELECT * FROM meals WHERE user_id = ? AND DATE(logged_at) >= DATE('now', '-7 days')").all(userId);
  const todayMeals = db.prepare("SELECT * FROM meals WHERE user_id = ? AND DATE(logged_at) = DATE('now')").all(userId);

  // Calculate 7-day averages
  const days = Math.max(1, new Set(meals.map(m => m.logged_at?.split('T')[0] || m.logged_at?.split(' ')[0])).size);
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  meals.forEach(m => { totals.calories += m.calories||0; totals.protein += m.protein_g||0; totals.carbs += m.carbs_g||0; totals.fat += m.fat_g||0; totals.fiber += m.fiber_g||0; });
  const avg = { calories: totals.calories/days, protein: totals.protein/days, carbs: totals.carbs/days, fat: totals.fat/days, fiber: totals.fiber/days };

  // Calculate today's totals
  const today = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  todayMeals.forEach(m => { today.calories += m.calories||0; today.protein += m.protein_g||0; today.carbs += m.carbs_g||0; today.fat += m.fat_g||0; today.fiber += m.fiber_g||0; });

  // Identify deficits & goals
  const goal = user?.daily_calorie_goal || 2000;
  const healthGoal = user?.health_goal || 'balanced diet';
  const deficits = [];
  const reasons = {};

  // Check today's immediate gaps
  if (today.protein < 50) { deficits.push('high-protein'); reasons['high-protein'] = "You're low on protein today — try this."; }
  if (today.fiber < 25) { deficits.push('fiber-rich'); reasons['fiber-rich'] = "Boost your fiber intake today for better digestion."; }
  
  // Check 7-day trends
  if (avg.carbs > 300) { deficits.push('low-carb'); reasons['low-carb'] = "Your carb intake has been high lately, try this lighter option."; }
  
  // Factor in health goal
  if (healthGoal === 'weight loss' && today.calories > goal * 0.8) {
    deficits.push('low-carb', 'fiber-rich');
    reasons['low-carb'] = "Keep your calories in check for weight loss.";
    reasons['fiber-rich'] = "Stay full longer with this high-fiber option.";
  }
  if (healthGoal === 'muscle gain') {
    deficits.push('high-protein');
    reasons['high-protein'] = "Essential for your muscle gain goal.";
  }

  if (deficits.length === 0) {
    deficits.push('balanced', 'vitamin-boost');
    reasons['balanced'] = "A great balanced choice for your day.";
    reasons['vitamin-boost'] = "Add some vitamins to your daily intake.";
  }

  // Filter by dietary preference
  const pref = user?.dietary_preference || 'none';
  let foods = foodDatabase.filter(f => {
    if (pref === 'vegetarian') return f.vegetarian;
    if (pref === 'vegan') return f.vegan;
    if (pref === 'keto') return f.category === 'low-carb' || f.category === 'high-protein';
    if (pref === 'paleo') return f.paleo;
    return true;
  });

  // Score and rank
  foods = foods.map(f => {
    let score = 1;
    if (deficits.includes(f.category)) score += 10;
    if (healthGoal === 'weight loss' && f.calories > 300) score -= 5;
    if (healthGoal === 'muscle gain' && f.category === 'high-protein') score += 5;
    return { ...f, score };
  }).sort((a, b) => b.score - a.score).slice(0, 5);

  // Store in DB
  const stmt = db.prepare('INSERT INTO recommendations (user_id, food_name, reason, calories, protein_g, carbs_g, fat_g, category) VALUES (?,?,?,?,?,?,?,?)');
  const insert = db.transaction((items) => {
    items.forEach(f => {
      const reason = reasons[f.category] || "A nutritious addition to maintain variety.";
      stmt.run(userId, f.name, reason, f.calories, f.protein, f.carbs, f.fat, f.category);
    });
  });
  insert(foods);

  return db.prepare('SELECT * FROM recommendations WHERE user_id = ? AND is_dismissed = 0 ORDER BY created_at DESC LIMIT 5').all(userId);
}
