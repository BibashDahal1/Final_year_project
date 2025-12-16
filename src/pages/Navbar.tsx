import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#0f243f] shadow-md px-4 md:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Left: Company Text */}
        <Link to="/" className="text-xl font-[italiana] font-bold text-white hover:scale-110">
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

          <Link
            to="/login"
            className="px-4 py-2 font-[italiana] rounded-md border-2 border-white text-white"
          >
            <p className="hover:scale-110">Login</p>
          </Link>
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

          <Link
            to="/login"
            className="text-white border-none font-[italiana] hover:scale-105"
            onClick={() => setIsOpen(false)}
          >
            <p className="hover:scale-110">Login</p>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
