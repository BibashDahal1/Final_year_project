import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Slices/AuthSlice";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state: any) => state.auth);

  // Check if we're on the chat page
  const isOnChatPage = location.pathname === "/chat";

  // Show logout button if authenticated and on chat page
  const showLogout = isAuthenticated && isOnChatPage;

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsOpen(false); // Close mobile menu if open
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="w-full bg-[#0f243f] shadow-md px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Company Text */}
          <Link
            to="/"
            className="text-xl font-[italiana] font-bold text-white hover:scale-110"
          >
            OCRio
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/features"
              className="text-white transition font-[italiana] hover:scale-110"
            >
              Features
            </Link>

            {showLogout ? (
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2 font-[italiana] rounded-md border-2 border-white text-white hover:scale-110 hover:bg-white/10 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 font-[italiana] rounded-md border-2 border-white text-white"
              >
                <p className="hover:scale-110">Login</p>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-3 pb-4">
            <Link
              to="/features"
              className="text-white font-[italiana] hover:scale-110"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>

            {showLogout ? (
              <button
                onClick={handleLogoutClick}
                className="text-left text-white font-[italiana] hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-white border-none font-[italiana] hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                <p className="hover:scale-110">Login</p>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancelLogout();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl text-white"
            >
              <h3 className="text-xl font-semibold mb-3 text-center">
                Confirm Logout
              </h3>
              <p className="text-sm text-white/80 mb-6 text-center">
                Are you sure you want to logout? All your session data will be
                cleared.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 py-2.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white font-medium transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
