import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  googleLogin,
  clearError,
  verifyOTP,
  resetSignupSuccess,
} from "../Slices/AuthSlice";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    signupSuccess,
    isAuthenticated,
    otpVerified,
    signupEmail,
  } = useSelector((state: any) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signupUser(formData));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
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

    const emailToVerify = signupEmail || formData.email;

    const otpPayload = {
      email: emailToVerify,
      otp: otpString,
      code: otpString,
      verification_code: otpString,
    };

    console.log("Submitting OTP with payload:", otpPayload);
    dispatch(verifyOTP(otpPayload));
  };

  const handleResendOtp = () => {
    // Resend OTP by calling signup again
    dispatch(signupUser(formData));
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  // Show OTP modal when signup is successful
  useEffect(() => {
    if (signupSuccess && !isAuthenticated) {
      setShowOtpModal(true);
    }
  }, [signupSuccess, isAuthenticated]);

  // Navigate to chat when OTP is verified or authenticated
  useEffect(() => {
    if (otpVerified && isAuthenticated) {
      setShowOtpModal(false);
      navigate("/chat");
    }
  }, [otpVerified, isAuthenticated, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(resetSignupSuccess());
    };
  }, [dispatch]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-[#0f243f] overflow-hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mx-4 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg text-center text-white"
        >
          <h2 className="text-2xl font-semibold mb-6">Get Started</h2>

          {error && !showOtpModal && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {typeof error === "string" ? error : JSON.stringify(error)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (e.g., +1234567890)"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
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

          <div className="w-full">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  dispatch(
                    googleLogin({ id_token: credentialResponse.credential })
                  );
                }
              }}
              onError={() => {
                console.log("Google Sign Up Failed");
              }}
              useOneTap={false}
              theme="filled_white"
              size="large"
              text="signup_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          <div className="mt-6">
            <p className="text-sm text-white/80">Already Have an Account?</p>
            <Link to="/login">
              <p className="mt-1 text-sm underline cursor-pointer hover:text-indigo-200">
                Login
              </p>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowOtpModal(false);
              }
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
                  {signupEmail || formData.email}
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
    </div>
  );
};

export default SignUp;
