import React from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <>
      <Navbar />
      <div className="h-screen flex items-center justify-center bg-[#0f243f]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-80 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 shadow-lg text-center text-white"
        >
          <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>
          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-white/30 hover:bg-white/50 text-white font-bold transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm underline cursor-pointer hover:text-indigo-200">
            Forgot password?
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
