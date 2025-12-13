import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#0f243f] shadow-md px-4 md:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Left: Company Text */}
        <Link to="/" className="text-xl font-bold text-white">
          OCRio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/features" className="text-white transition">
            Features
          </Link>

          <Link
            to="/login"
            className="px-4 py-2 rounded-md border-none text-white"
          >
            Login
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
            className="text-white"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>

          <Link
            to="/login"
            className="text-white border-none"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
