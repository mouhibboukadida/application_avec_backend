const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all
router.get('/', (req, res) => {
  db.query('SELECT * FROM etudiants', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// GET one
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM etudiants WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// POST create
router.post('/', (req, res) => {
  const { nom, prenom, email, classe } = req.body;
  db.query(
    'INSERT INTO etudiants (nom, prenom, email, classe) VALUES (?, ?, ?, ?)',
    [nom, prenom, email, classe],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, message: 'Étudiant créé' });
    }
  );
});

// PUT update
router.put('/:id', (req, res) => {
  const { nom, prenom, email, classe } = req.body;
  db.query(
    'UPDATE etudiants SET nom=?, prenom=?, email=?, classe=? WHERE id=?',
    [nom, prenom, email, classe, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Étudiant mis à jour' });
    }
  );
});

// DELETE
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM etudiants WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Étudiant supprimé' });
  });
});

module.exports = router;