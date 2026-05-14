import { useState, useEffect } from 'react';
import API from '../api/api';
import Modal from '../components/model';

export default function Etudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', classe: '' });
  const [editId, setEditId] = useState(null);

  const fetchAll = () => API.get('/etudiants').then(r => setEtudiants(r.data));
  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async () => {
    if (editId) await API.put(`/etudiants/${editId}`, form);
    else await API.post('/etudiants', form);
    setShowModal(false);
    setEditId(null);
    setForm({ nom: '', prenom: '', email: '', classe: '' });
    fetchAll();
  };

  const handleEdit = (et) => {
    setEditId(et.id);
    setForm({ nom: et.nom, prenom: et.prenom, email: et.email, classe: et.classe });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet étudiant ?')) {
      await API.delete(`/etudiants/${id}`);
      fetchAll();
    }
  };

  return (
    <div>
      <h2>Étudiants</h2>
      <button onClick={() => setShowModal(true)}>Ajouter</button>

      {showModal && (
        <Modal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          editId={editId}
          onCancel={() => { setShowModal(false); setEditId(null); }}
          type="etudiant"
        />
      )}

      <table>
        <thead>
          <tr><th>Nom</th><th>Prénom</th><th>Email</th><th>Classe</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {etudiants.map(et => (
            <tr key={et.id}>
              <td>{et.nom}</td><td>{et.prenom}</td>
              <td>{et.email}</td><td>{et.classe}</td>
              <td>
                <button onClick={() => handleEdit(et)}>Modifier</button>
                <button onClick={() => handleDelete(et.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}