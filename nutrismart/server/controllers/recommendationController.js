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

  // Calculate averages
  const days = Math.max(1, new Set(meals.map(m => m.logged_at?.split('T')[0] || m.logged_at?.split(' ')[0])).size);
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  meals.forEach(m => { totals.calories += m.calories||0; totals.protein += m.protein_g||0; totals.carbs += m.carbs_g||0; totals.fat += m.fat_g||0; totals.fiber += m.fiber_g||0; });
  const avg = { calories: totals.calories/days, protein: totals.protein/days, carbs: totals.carbs/days, fat: totals.fat/days, fiber: totals.fiber/days };

  // Identify deficits
  const goal = user?.daily_calorie_goal || 2000;
  const deficits = [];
  if (avg.protein < 50) deficits.push('high-protein');
  if (avg.fiber < 25) deficits.push('fiber-rich');
  if (avg.calories < goal * 0.7) deficits.push('balanced');
  if (avg.carbs > 300) deficits.push('low-carb');
  if (deficits.length === 0) deficits.push('balanced', 'vitamin-boost');

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
  foods = foods.map(f => ({ ...f, score: deficits.includes(f.category) ? 10 : 1 }))
    .sort((a, b) => b.score - a.score).slice(0, 5);

  // Store in DB
  const stmt = db.prepare('INSERT INTO recommendations (user_id, food_name, reason, calories, protein_g, carbs_g, fat_g, category) VALUES (?,?,?,?,?,?,?,?)');
  const insert = db.transaction((items) => {
    items.forEach(f => {
      const reason = deficits.includes(f.category)
        ? `Great source of ${f.category.replace('-', ' ')} to balance your diet`
        : 'A nutritious addition to maintain variety';
      stmt.run(userId, f.name, reason, f.calories, f.protein, f.carbs, f.fat, f.category);
    });
  });
  insert(foods);

  return db.prepare('SELECT * FROM recommendations WHERE user_id = ? AND is_dismissed = 0 ORDER BY created_at DESC LIMIT 5').all(userId);
}
