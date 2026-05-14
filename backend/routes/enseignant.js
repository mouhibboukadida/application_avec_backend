const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
  db.query('SELECT * FROM enseignants', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

 
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM enseignants WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});


router.post('/', (req, res) => {
  const { nom, prenom, email, classe } = req.body;
  db.query(
    'INSERT INTO enseignants (nom, prenom, email, classe) VALUES (?, ?, ?, ?)',
    [nom, prenom, email, classe],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, message: 'Enseignant créé' });
    }
  );
});


router.put('/:id', (req, res) => {
  const { nom, prenom, email, classe } = req.body;
  db.query(
    'UPDATE enseignants SET nom=?, prenom=?, email=?, classe=? WHERE id=?',
    [nom, prenom, email, classe, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Enseignant mis à jour' });
    }
  );
});


router.delete('/:id', (req, res) => {
  db.query('DELETE FROM enseignants WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Enseignant supprimé' });
  });
});

module.exports = router;