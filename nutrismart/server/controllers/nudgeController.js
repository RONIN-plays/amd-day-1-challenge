const { db } = require('../config/db');

exports.getNudges = (req, res, next) => {
  try {
    const nudges = db.prepare('SELECT * FROM nudges WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json({ nudges });
  } catch (err) { next(err); }
};

exports.getActiveNudges = (req, res, next) => {
  try {
    const nudges = db.prepare('SELECT * FROM nudges WHERE user_id = ? AND is_active = 1 ORDER BY schedule_time ASC').all(req.user.id);
    res.json({ nudges });
  } catch (err) { next(err); }
};

exports.createNudge = (req, res, next) => {
  try {
    const { title, message, nudge_type, schedule_time } = req.body;
    if (!title || !message || !nudge_type) return res.status(400).json({ error: 'title, message, and nudge_type are required.' });
    const valid = ['hydration','meal_reminder','veggie_check','sugar_limit','exercise'];
    if (!valid.includes(nudge_type)) return res.status(400).json({ error: 'Invalid nudge_type' });
    const result = db.prepare('INSERT INTO nudges (user_id, title, message, nudge_type, schedule_time) VALUES (?,?,?,?,?)').run(req.user.id, title, message, nudge_type, schedule_time || null);
    const nudge = db.prepare('SELECT * FROM nudges WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Nudge created', nudge });
  } catch (err) { next(err); }
};

exports.updateNudge = (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM nudges WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ error: 'Nudge not found.' });
    const { title, message, nudge_type, schedule_time, is_active } = req.body;
    db.prepare('UPDATE nudges SET title=COALESCE(?,title), message=COALESCE(?,message), nudge_type=COALESCE(?,nudge_type), schedule_time=COALESCE(?,schedule_time), is_active=COALESCE(?,is_active) WHERE id=? AND user_id=?').run(title, message, nudge_type, schedule_time, is_active, req.params.id, req.user.id);
    const nudge = db.prepare('SELECT * FROM nudges WHERE id = ?').get(req.params.id);
    res.json({ message: 'Nudge updated', nudge });
  } catch (err) { next(err); }
};

exports.deleteNudge = (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM nudges WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ error: 'Nudge not found.' });
    db.prepare('DELETE FROM nudges WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ message: 'Nudge deleted' });
  } catch (err) { next(err); }
};

exports.completeNudge = (req, res, next) => {
  try {
    const existing = db.prepare('SELECT * FROM nudges WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!existing) return res.status(404).json({ error: 'Nudge not found.' });
    db.prepare('UPDATE nudges SET is_completed = 1 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Nudge completed' });
  } catch (err) { next(err); }
};
