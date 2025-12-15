import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const LnadingPage = () => {
  return (
    <>
      <Navbar />
      <div className="h-screen">
        <div className="bg-[#0f243f] h-[50vh] flex items-center justify-center px-4">
          <div className="text-center font-[italiana] font-normal text-[36px] max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              OCR – Optical Character Recognition
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-300">
              Convert images into editable text instantly.
            </p>
            <div className="mt-4">
              <button className="bg-white text-black rounded-2xl h-10 w-40 text-lg hover:bg-amber-200 hover:scale-110 transition-all">
                <Link to="/login">Get started Free</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LnadingPage;
