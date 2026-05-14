export default function Modal({ form, setForm, onSubmit, editId, onCancel, type }) {
  const fields = type === 'etudiant'
    ? ['nom', 'prenom', 'email', 'classe']
    : ['nom', 'prenom', 'email', 'matiere'];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>{editId ? 'Modifier' : 'Ajouter'} {type}</h3>

        {fields.map(field => (
          <input
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field] || ''}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            style={styles.input}
          />
        ))}

        <div style={styles.actions}>
          <button onClick={onSubmit} style={styles.btnConfirm}>
            {editId ? 'Modifier' : 'Ajouter'}
          </button>
          <button onClick={onCancel} style={styles.btnCancel}>
            ❌ Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff', padding: '30px',
    borderRadius: '10px', width: '400px',
    display: 'flex', flexDirection: 'column', gap: '12px'
  },
  input: {
    padding: '10px', borderRadius: '6px',
    border: '1px solid #ccc', fontSize: '14px'
  },
  actions: { display: 'flex', gap: '10px', marginTop: '10px' },
  btnConfirm: {
    flex: 1, padding: '10px', background: '#4CAF50',
    color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'
  },
  btnCancel: {
    flex: 1, padding: '10px', background: '#f44336',
    color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer'
  }
};