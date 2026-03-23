import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./Store";
import LandingPage from "./pages/LandingPage";
import NepaliLensUI from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Protected Chat Route */}
            <Route path="/chat" element={<NepaliLensUI />} />
          </Routes>
        </HashRouter>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
