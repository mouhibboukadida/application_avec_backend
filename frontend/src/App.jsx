import { Routes, Route } from "react-router-dom";
import LoginComponent from "./LoginComponent";
import InscriptionComponent from "./inscriptionComponent";
import Etudiants from "./Etudiants";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginComponent />} />
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/inscription" element={<InscriptionComponent />} />
      <Route path="/etudiants" element={<Etudiants />} />

    </Routes>
  );
}

export default App;