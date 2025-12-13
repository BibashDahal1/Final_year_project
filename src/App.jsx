import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import LnadingPage from "./pages/LnadingPage";
import Features from "./pages/Features";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LnadingPage />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
