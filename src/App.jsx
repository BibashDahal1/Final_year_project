import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./Store";
import LandingPage from "./pages/LandingPage";
import Features from "./pages/Features";
import Translator from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<Features />} />

            {/* Protected Chat Route */}
            <Route
              path="/chat"
              element={
                // <ProtectedRoute>
                <Translator />
                // </ProtectedRoute>
              }
            />
          </Routes>
        </HashRouter>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
