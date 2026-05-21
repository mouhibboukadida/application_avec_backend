import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EtudiantsPage.css";
import { useNavigate } from "react-router-dom"; // Add this import

function EtudiantsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    age: "",
    telephone: "",
    adresse: "",
    date_naissance: "",
    niveau: "",
    specialite: ""
  });

  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate(); // Add navigation

  const token = localStorage.getItem("token");

  // 🔒 redirect if no token - FIXED: use navigate instead of window.location
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  // 📋 GET Students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/etudiants",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setStudents(res.data);
    } catch (err) {
      console.log(err);
      alert("Erreur chargement étudiants");
    }
  };

  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [token]);

  // ✅ ADD THIS: Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.nom?.toLowerCase().includes(searchLower) ||
      student.prenom?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.niveau?.toLowerCase().includes(searchLower) ||
      student.specialite?.toLowerCase().includes(searchLower)
    );
  });

  // ✍️ Handle Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🧹 Reset Form
  const resetForm = () => {
    setForm({
      nom: "",
      prenom: "",
      email: "",
      age: "",
      telephone: "",
      adresse: "",
      date_naissance: "",
      niveau: "",
      specialite: ""
    });
    setEditingId(null);
  };

  // ✅ FIXED: Don't send ID when adding new student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE
        await axios.put(
          `http://localhost:4000/api/etudiants/${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Étudiant modifié");
      } else {
        // ADD - Remove id from form data
        const { ...formData } = form;
        await axios.post(
          "http://localhost:4000/api/etudiants",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Étudiant ajouté");
      }

      resetForm();
      fetchStudents();
    } catch (err) {
      console.log(err);
      alert("Erreur: " + (err.response?.data?.message || err.message));
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Supprimer étudiant ?")) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/etudiants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchStudents();
    } catch (err) {
      console.log(err);
      alert("Erreur suppression");
    }
  };

  const editStudent = (student) => {
    setForm({
      nom: student.nom || "",
      prenom: student.prenom || "",
      email: student.email || "",
      age: student.age || "",
      telephone: student.telephone || "",
      adresse: student.adresse || "",
      date_naissance: student.date_naissance
        ? student.date_naissance.substring(0, 10)
        : "",
      niveau: student.niveau || "",
      specialite: student.specialite || ""
    });
    setEditingId(student.id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="etudiants-container">
      <div className="top-bar">
        <h1 className="title">Gestion des Étudiants</h1>
        <button className="btn-logout" onClick={logout}>
          Déconnecter
        </button>
      </div>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="etudiant-form">
        <input
          className="form-input"
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          name="prenom"
          placeholder="Prénom"
          value={form.prenom}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          type="number"
          name="age"
          placeholder="Âge"
          value={form.age}
          onChange={handleChange}
          required
        />
        <input
          className="form-input"
          name="telephone"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={handleChange}
        />
        <input
          className="form-input"
          name="adresse"
          placeholder="Adresse"
          value={form.adresse}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="date"
          name="date_naissance"
          value={form.date_naissance}
          onChange={handleChange}
        />
        <input
          className="form-input"
          name="niveau"
          placeholder="Niveau"
          value={form.niveau}
          onChange={handleChange}
        />
        <input
          className="form-input"
          name="specialite"
          placeholder="Spécialité"
          value={form.specialite}
          onChange={handleChange}
        />
        <button type="submit" className="btn-add">
          {editingId ? "Modifier" : "Ajouter"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="btn-cancel">
            Annuler
          </button>
        )}
      </form>

      {/* ✅ ADDED: Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* TABLEAU DES ÉTUDIANTS */}
      <h2>Liste des Étudiants ({filteredStudents.length})</h2>

      <table className="etudiants-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Âge</th>
            <th>Téléphone</th>
            <th>Niveau</th>
            <th>Spécialité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.nom}</td>
                <td>{s.prenom}</td>
                <td>{s.email}</td>
                <td>{s.age}</td>
                <td>{s.telephone}</td>
                <td>{s.niveau}</td>
                <td>{s.specialite}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => editStudent(s)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteStudent(s.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="empty-message">
                {searchTerm ? "Aucun résultat trouvé" : "Aucun étudiant"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EtudiantsPage;