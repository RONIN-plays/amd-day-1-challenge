const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

function generateTokens(user) {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { token, refreshToken };
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if user exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const stmt = db.prepare(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    );
    const result = stmt.run(name, email, password_hash);

    const user = {
      id: result.lastInsertRowid,
      name,
      email,
      dietary_preference: 'none',
      daily_calorie_goal: 2000,
    };

    const tokens = generateTokens(user);

    res.status(201).json({
      message: 'Account created successfully',
      ...tokens,
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const tokens = generateTokens(user);

    const { password_hash, ...safeUser } = user;

    res.json({
      message: 'Login successful',
      ...tokens,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.refresh = (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required.' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const token = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    res.json({ token });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
};

exports.getMe = (req, res, next) => {
  try {
    const user = db.prepare('SELECT id, name, email, age, weight_kg, height_cm, dietary_preference, daily_calorie_goal, created_at FROM users WHERE id = ?').get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = (req, res, next) => {
  try {
    const { name, age, weight_kg, height_cm, dietary_preference, daily_calorie_goal } = req.body;

    const stmt = db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        age = COALESCE(?, age),
        weight_kg = COALESCE(?, weight_kg),
        height_cm = COALESCE(?, height_cm),
        dietary_preference = COALESCE(?, dietary_preference),
        daily_calorie_goal = COALESCE(?, daily_calorie_goal)
      WHERE id = ?
    `);

    stmt.run(name, age, weight_kg, height_cm, dietary_preference, daily_calorie_goal, req.user.id);

    const user = db.prepare('SELECT id, name, email, age, weight_kg, height_cm, dietary_preference, daily_calorie_goal, created_at FROM users WHERE id = ?').get(req.user.id);

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
};
