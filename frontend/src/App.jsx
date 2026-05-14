import {browserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Etudiants from './pages/etudiants';
import Enseignant from './pages/enseignant';
export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/etudiants">Étudiants</Link>
        <Link to="/enseignants">Enseignants</Link>
      </nav>
      <Routes>
        <Route path="/etudiants" element={<Etudiants />} />
        <Route path="/enseignants" element={<Enseignants />} />
      </Routes>
    </BrowserRouter>
  );
}