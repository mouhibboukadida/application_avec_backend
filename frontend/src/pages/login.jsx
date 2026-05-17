import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("enseignant");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
  
    try {
      const res = await axios.post("http://localhost:4000/api/login", {
        name,
        password,
        role  // ← Envoyer le rôle au backend
      });
  
      if (res.data.token) {
        // Stocker le token et les infos utilisateur
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", res.data.user.role);  // ← Stocker le rôle
        localStorage.setItem("userName", res.data.user.name);  // ← Stocker le nom
  
        setMessage("✅ Login réussi");
  
        // 🔄 REDIRECTION SELON LE RÔLE
        if (res.data.user.role === "enseignant") {
          navigate("/enseignants");  // ← Page enseignant
        } else {
          navigate("/etudiants");    // ← Page étudiant
        }
  
      } else {
        setMessage("❌ Login échoué");
      }
  
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🔐 Connexion</h2>

        <input
          className="input"
          type="text"
          placeholder="Nom d'utilisateur"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="enseignant">Enseignant</option>
          <option value="etudiant">Étudiant</option>
        </select>

        <button
          className="button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "⏳ Connexion en cours..." : "Se connecter"}
        </button>

        {message && <p className={message.includes("✅") ? "success" : "error"}>{message}</p>}
      </div>
    </div>
  );
};

export default LoginComponent;