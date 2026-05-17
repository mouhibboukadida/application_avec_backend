const mysql = require('mysql2/promise'); 
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',           
  database: 'gestion_etudiants',
});

// Tester la connexion
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connecté ✓');
    connection.release();
  } catch (err) {
    console.error('Erreur de connexion MySQL:', err.message);
  }
})();

module.exports = pool;