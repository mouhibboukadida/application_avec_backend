import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ← AJOUTER

function EnseignantPage() {  // ← Majuscule (convention React)
  const [enseignants, setEnseignants] = useState([]);  // ← pluriel

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    age: "",
    telephone: "",
    adresse: "",
    specialite: ""
  });

  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();  // ← AJOUTER pour la navigation
  const token = localStorage.getItem("token");

  // 🔒 REDIRECTION si pas de token (CORRIGÉ)
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // 📋 GET Enseignants (CORRIGÉ)
  const fetchEnseignants = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/enseignants",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEnseignants(res.data);
    } catch (err) {
      console.log(err);
      alert("Erreur chargement enseignants: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (token) {  // ← Ne charger que si token existe
      fetchEnseignants();
    }
  }, [token]);

  // ✍️ Handle Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🧹 Reset Form (CORRIGÉ - enlever les champs qui n'existent pas)
  const resetForm = () => {
    setForm({
      nom: "",
      prenom: "",
      email: "",
      age: "",
      telephone: "",
      adresse: "",
      specialite: ""  // ← Enlevé date_naissance et niveau (pas dans table enseignants)
    });
    setEditingId(null);
  };

  // ➕ ADD ENSEIGNANT (CORRIGÉ - utiliser la bonne route)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE enseignant
        await axios.put(
          `http://localhost:4000/api/enseignants/${editingId}`,  // ← route enseignants
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Enseignant modifié");
      } else {
        // ADD enseignant
        await axios.post(
          "http://localhost:4000/api/enseignants",  // ← route enseignants
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Enseignant ajouté");
      }

      resetForm();
      fetchEnseignants();  // ← Rafraîchir la liste

    } catch (err) {
      console.log(err);
      alert("Erreur: " + (err.response?.data?.message || err.message));
    }
  };

  // ❌ DELETE Enseignant (CORRIGÉ)
  const deleteEnseignant = async (id) => {
    if (!window.confirm("Supprimer enseignant ?")) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/enseignants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      fetchEnseignants();
      alert("Enseignant supprimé ✅");
    } catch (err) {
      console.log(err);
      alert("Erreur suppression: " + (err.response?.data?.message || err.message));
    }
  };

  // ✏️ EDIT Enseignant (CORRIGÉ)
  const editEnseignant = (enseignant) => {
    setForm({
      nom: enseignant.nom || "",
      prenom: enseignant.prenom || "",
      email: enseignant.email || "",
      age: enseignant.age || "",
      telephone: enseignant.telephone || "",
      adresse: enseignant.adresse || "",
      specialite: enseignant.specialite || ""
    });
    setEditingId(enseignant.id);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");  // ← Nettoyer aussi le rôle
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h1>Gestion des Enseignants</h1>
        <button style={styles.logoutBtn} onClick={logout}>
          déconnecter
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          required
        />
        <input
          name="prenom"
          placeholder="Prénom"
          value={form.prenom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />
        <input
          name="telephone"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={handleChange}
        />
        <input
          name="adresse"
          placeholder="Adresse"
          value={form.adresse}
          onChange={handleChange}
        />
        <input
          name="specialite"
          placeholder="Spécialité"
          value={form.specialite}
          onChange={handleChange}
        />
        <button type="submit" style={styles.addBtn}>
          {editingId ? "Modifier" : "Ajouter"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={styles.cancelBtn}>
            Annuler
          </button>
        )}
      </form>

      {/* TABLE */}
      <h2>Liste des Enseignants</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Age</th>
            <th>Téléphone</th>
            <th>Spécialité</th>
            
          </tr>
        </thead>
        <tbody>
          {enseignants.length > 0 ? (
            enseignants.map((e) => (
              <tr key={e.id}>
                <td>{e.nom}</td>
                <td>{e.prenom}</td>
                <td>{e.email}</td>
                <td>{e.age}</td>
                <td>{e.telephone}</td>
                <td>{e.specialite}</td>
                <td>
                  <button
                    style={styles.editBtn}
                    onClick={() => editEnseignant(e)}
                  >
                    modifier
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteEnseignant(e.id)}
                  >
                    supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Aucun enseignant
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "15px 25px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "30px"
  },
  title: {
    color: "#2c3e50",
    margin: 0,
    fontSize: "24px"
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "30px"
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    transition: "border-color 0.3s"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  th: {
    backgroundColor: "#34495e",
    color: "white",
    padding: "12px",
    textAlign: "left",
    fontWeight: "600"
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee"
  },
  addBtn: {
    background: "linear-gradient(135deg, #27ae60, #2ecc71)",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "transform 0.2s, box-shadow 0.2s"
  },
  editBtn: {
    background: "#f39c12",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
    transition: "background 0.3s",
    
  },
  deleteBtn: {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s"
  },
  cancelBtn: {
    background: "#95a5a6",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold"
  },
  logoutBtn: {
    background: "linear-gradient(135deg, #c0392b, #e74c3c)",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "transform 0.2s"
  },
  searchBar: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px"
  }
};

export default EnseignantPage;