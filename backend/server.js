const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/etudiants', require('./routes/etudiants'));
app.use('/api/enseignants', require('./routes/enseignants'));
app.listen(5000, () => console.log("Server running on port 5000"));