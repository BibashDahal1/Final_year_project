import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, googleLogin, clearError } from "../Slices/AuthSlice";
import { GoogleLogin } from "@react-oauth/google";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, signupSuccess, isAuthenticated } = useSelector(
    (state: any) => state.auth
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

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

  useEffect(() => {
    if (signupSuccess || isAuthenticated) {
      navigate("/chat");
    }
  }, [signupSuccess, isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
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

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              Sign Up Failed! : {error}
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
    </div>
  );
};

export default SignUp;
