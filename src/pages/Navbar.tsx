import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  loginUser,
  signupUser,
  googleLogin,
  clearError,
  verifyOTP,
  resetSignupSuccess,
} from "../Slices/AuthSlice";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    isAuthenticated,
    isLoading,
    error,
    signupSuccess,
    otpVerified,
    signupEmail,
  } = useSelector((state: any) => state.auth);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  // Login handlers
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(loginData));
  };

  // Signup handlers
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signupUser(signupData));
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    const emailToVerify = signupEmail || signupData.email;
    dispatch(
      verifyOTP({
        email: emailToVerify,
        otp: otpString,
        code: otpString,
        verification_code: otpString,
      }),
    );
  };

  const handleResendOtp = () => {
    dispatch(signupUser(signupData));
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  // Modal control handlers
  const handleLoginClick = () => {
    setShowLoginModal(true);
    setIsOpen(false);
    dispatch(clearError());
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
    setIsOpen(false);
    dispatch(clearError());
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsOpen(false);
  };

  const handleConfirmLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
    setLoginData({ username: "", password: "" });
    dispatch(clearError());
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
    setSignupData({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
    });
    dispatch(clearError());
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowOtpModal(false);
    setLoginData({ username: "", password: "" });
    setSignupData({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
    });
    setOtp(["", "", "", "", "", ""]);
    dispatch(clearError());
  };

  // Show OTP modal when signup is successful
  useEffect(() => {
    if (signupSuccess && !isAuthenticated) {
      setShowSignupModal(false);
      setShowOtpModal(true);
    }
  }, [signupSuccess, isAuthenticated]);

  // Navigate to chat when authenticated from login modal
  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      setShowLoginModal(false);
      setLoginData({ username: "", password: "" });
      navigate("/chat");
    }
  }, [isAuthenticated, showLoginModal, navigate]);

  // Navigate to chat when OTP is verified — react to otpVerified alone,
  // isAuthenticated may land in a later render cycle
  useEffect(() => {
    if (otpVerified) {
      setShowOtpModal(false);
      setShowSignupModal(false);
      setSignupData({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        phone: "",
      });
      setOtp(["", "", "", "", "", ""]);
      dispatch(resetSignupSuccess());
      dispatch(clearError());
      navigate("/chat");
    }
  }, [otpVerified, navigate, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(resetSignupSuccess());
    };
  }, [dispatch]);

  // Listen for custom events to open modals from other components
  useEffect(() => {
    const handleOpenSignupModal = () => {
      setShowSignupModal(true);
      setShowLoginModal(false);
      dispatch(clearError());
    };

    const handleOpenLoginModal = () => {
      setShowLoginModal(true);
      setShowSignupModal(false);
      dispatch(clearError());
    };

    window.addEventListener("openSignupModal", handleOpenSignupModal);
    window.addEventListener("openLoginModal", handleOpenLoginModal);

    return () => {
      window.removeEventListener("openSignupModal", handleOpenSignupModal);
      window.removeEventListener("openLoginModal", handleOpenLoginModal);
    };
  }, [dispatch]);

  return (
    <>
      <nav className="w-full bg-[#0f243f] shadow-md px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link
            to="/"
            className="text-xl font-[italiana] font-bold text-white hover:scale-110 transition-transform"
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

            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="px-4 py-2 font-[italiana] rounded-md border-2 border-white text-white hover:scale-110 hover:bg-white/10 transition"
                >
                  Zone
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="px-4 py-2 font-[italiana] rounded-md border-2 border-red-400 text-red-300 hover:scale-110 hover:bg-red-400/10 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 font-[italiana] rounded-md border-2 border-white text-white hover:scale-110 hover:bg-white/10 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-3 pb-4 z-50">
            <Link
              to="/features"
              className="text-white font-[italiana] hover:scale-110 transition-transform"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="text-white font-[italiana] hover:scale-105 transition-transform"
                  onClick={() => setIsOpen(false)}
                >
                  Zone
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="text-left text-red-300 font-[italiana] hover:scale-105 transition-transform"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="text-left text-white font-[italiana] hover:scale-105 transition-transform"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeAllModals();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl text-white"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Welcome Back</h2>
                <button
                  onClick={closeAllModals}
                  className="text-white/70 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                  Login Failed! : {error}
                </div>
              )}

              <form
                onSubmit={handleLoginSubmit}
                className="flex flex-col space-y-4"
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 rounded-lg bg-white/30 hover:bg-white/50 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/30"></div>
                <span className="px-4 text-sm text-white/70">OR</span>
                <div className="flex-1 border-t border-white/30"></div>
              </div>

              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      dispatch(
                        googleLogin({
                          id_token: credentialResponse.credential,
                        }),
                      );
                    }
                  }}
                  onError={() => console.log("Google Login Failed")}
                  useOneTap={false}
                  theme="filled_blue"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/80">Don't Have an Account?</p>
                <button
                  onClick={switchToSignup}
                  className="mt-1 text-sm underline cursor-pointer hover:text-indigo-200"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Modal */}
      <AnimatePresence>
        {showSignupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeAllModals();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Get Started</h2>
                <button
                  onClick={closeAllModals}
                  className="text-white/70 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                  {typeof error === "string" ? error : JSON.stringify(error)}
                </div>
              )}

              <form
                onSubmit={handleSignupSubmit}
                className="flex flex-col space-y-4"
              >
                <input
                  type="text"
                  name="username"
                  placeholder="Full Name"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number (e.g., +1234567890)"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={signupData.confirm_password}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 rounded-lg bg-white/30 hover:bg-white/50 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/30"></div>
                <span className="px-4 text-sm text-white/70">OR</span>
                <div className="flex-1 border-t border-white/30"></div>
              </div>

              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      dispatch(
                        googleLogin({
                          id_token: credentialResponse.credential,
                        }),
                      );
                    }
                  }}
                  onError={() => console.log("Google Sign Up Failed")}
                  useOneTap={false}
                  theme="filled_blue"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                />
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/80">
                  Already Have an Account?
                </p>
                <button
                  onClick={switchToLogin}
                  className="mt-1 text-sm underline cursor-pointer hover:text-indigo-200"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowOtpModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl text-white"
            >
              <h3 className="text-2xl font-semibold mb-2 text-center">
                Verify Your Email
              </h3>
              <p className="text-sm text-white/70 mb-6 text-center">
                We've sent a 6-digit code to <br />
                <span className="font-medium text-white">
                  {signupEmail || signupData.email}
                </span>
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                  {typeof error === "string"
                    ? error
                    : "Verification failed. Please try again."}
                </div>
              )}
              {otpError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                  {otpError}
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-lg bg-white/20 text-white border-2 border-white/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-white/30 hover:bg-white/50 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-white/70 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm text-indigo-300 hover:text-indigo-200 underline disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Resend OTP
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleCancelLogout();
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
