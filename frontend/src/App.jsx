import { Routes, Route } from "react-router-dom";
import LoginComponent from "./pages/login";
import EnseignantPage from "./pages/enseignant";
import EtudiantPage from "./pages/etudiants";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginComponent />} />
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/etudiants" element={<EtudiantPage />} />
      <Route path="/enseignants" element={<EnseignantPage />} />
    </Routes>
  );
}
export default App;