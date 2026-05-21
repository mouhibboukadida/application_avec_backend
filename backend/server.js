const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "mysecretkey";
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token manquant"
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token invalide"
      });
    }
    req.user = user;
    next();
  });
}

app.post("/api/login", async (req, res) => {
  const { name, password, role } = req.body;

  try {
    const [result] = await pool.query(
      `SELECT * FROM users WHERE name = ? AND password = ? AND role = ?`,
      [name, password, role]
    );

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Nom, mot de passe ou rôle incorrect"
      });
    }

    const user = result[0];

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        role: user.role
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ✅ FIXED: GET all students
app.get("/api/etudiants", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM etudiants ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ FIXED: ADD student - Remove 'id' from insert (auto-increment)
app.post("/api/etudiants", authenticateToken, async (req, res) => {
  const { nom, prenom, email, age, telephone, adresse, date_naissance, niveau, specialite } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO etudiants (nom, prenom, email, age, telephone, adresse, date_naissance, niveau, specialite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, email, age, telephone, adresse, date_naissance, niveau, specialite]
    );
    const [newEtudiant] = await pool.query("SELECT * FROM etudiants WHERE id = ?", [result.insertId]);
    res.json(newEtudiant[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.put("/api/etudiants/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, age, telephone, adresse, date_naissance, niveau, specialite } = req.body;
  try {
    await pool.query(
      `UPDATE etudiants SET nom=?, prenom=?, email=?, age=?, telephone=?, adresse=?, date_naissance=?, niveau=?, specialite=? WHERE id=?`,
      [nom, prenom, email, age, telephone, adresse, date_naissance, niveau, specialite, id]
    );
    const [updated] = await pool.query("SELECT * FROM etudiants WHERE id = ?", [id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE student
app.delete("/api/etudiants/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "ID invalide" 
    });
  }
  
  try {
    const [check] = await pool.query("SELECT * FROM etudiants WHERE id = ?", [id]);
    
    if (check.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Étudiant non trouvé" 
      });
    }
    
    await pool.query("DELETE FROM etudiants WHERE id = ?", [id]);
    res.json({ success: true, message: "Étudiant supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression" 
    });
  }
});

// GET all teachers
app.get("/api/enseignants", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM enseignants ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ FIXED: ADD teacher - Specify columns, let id auto-increment
app.post("/api/enseignants", authenticateToken, async (req, res) => {
  const { nom, prenom, email, age, telephone, adresse, specialite } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO enseignants (nom, prenom, email, age, telephone, adresse, specialite) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, email, age, telephone, adresse, specialite]
    );
    const [newEnseignant] = await pool.query("SELECT * FROM enseignants WHERE id = ?", [result.insertId]);
    res.json(newEnseignant[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// MODIFY teacher
app.put("/api/enseignants/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, age, telephone, adresse, specialite } = req.body;
  try {
    await pool.query(
      `UPDATE enseignants SET nom=?, prenom=?, email=?, age=?, telephone=?, adresse=?, specialite=? WHERE id=?`,
      [nom, prenom, email, age, telephone, adresse, specialite, id]
    );
    const [updated] = await pool.query("SELECT * FROM enseignants WHERE id = ?", [id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE teacher
app.delete("/api/enseignants/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "ID invalide" 
    });
  }
  
  try {
    const [check] = await pool.query("SELECT * FROM enseignants WHERE id = ?", [id]);
    
    if (check.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Enseignant non trouvé" 
      });
    }
    
    await pool.query("DELETE FROM enseignants WHERE id = ?", [id]);
    res.json({ success: true, message: "Enseignant supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression" 
    });
  }
});

app.listen(4000, () => {
  console.log("✅ Server running on port 4000");
});