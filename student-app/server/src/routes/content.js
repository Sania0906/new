const express = require('express');
const { all, get } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/subjects', requireAuth, async (req, res) => {
  try {
    const subjects = await all('SELECT id, title, grade_band FROM subjects WHERE grade_band = ? ORDER BY title', [req.user.grade_band]);
    res.json({ subjects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

router.get('/subjects/:id/lessons', requireAuth, async (req, res) => {
  try {
    const subjectId = Number(req.params.id);
    if (!Number.isInteger(subjectId)) {
      res.status(400).json({ error: 'Invalid subject id' });
      return;
    }
    const lessons = await all(
      `SELECT l.id, l.title, l.description
       FROM lessons l
       JOIN subjects s ON s.id = l.subject_id
       WHERE l.subject_id = ? AND s.grade_band = ?
       ORDER BY l.title`,
      [subjectId, req.user.grade_band]
    );
    res.json({ lessons });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

router.get('/lessons/:id', requireAuth, async (req, res) => {
  try {
    const lessonId = Number(req.params.id);
    if (!Number.isInteger(lessonId)) {
      res.status(400).json({ error: 'Invalid lesson id' });
      return;
    }
    const lesson = await get(
      `SELECT l.id, l.title, l.description, l.content
       FROM lessons l
       JOIN subjects s ON s.id = l.subject_id
       WHERE l.id = ? AND s.grade_band = ?`,
      [lessonId, req.user.grade_band]
    );
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }
    res.json({ lesson });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

module.exports = router;
