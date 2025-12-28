import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faCloudArrowUp,
  faFileExport,
  faShieldHalved,
  faBrain,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";

const Features = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const features = [
    {
      id: 1,
      from: "left",
      heading: "Advanced OCR Technology",
      baseText: "Pixel-perfect text extraction from Nepali documents",
      detailedText:
        "Our OCR engine accurately identifies and extracts Nepali Devanagari script from images, handling various fonts, handwriting styles, and document qualities with exceptional precision.",
      icons: faFileLines,
      color: "text-blue-600",
      bgGradient: "from-blue-500 to-blue-700",
      bgHover: "bg-blue-50",
    },
    {
      id: 2,
      from: "right",
      heading: "Character Recognition (RCNN)",
      baseText: "Letter-by-letter deep learning analysis",
      detailedText:
        "Using Regional Convolutional Neural Networks, we analyze each character individually, ensuring accurate recognition even with complex ligatures and conjunct consonants unique to Nepali script.",
      icons: faBrain,
      color: "text-purple-600",
      bgGradient: "from-purple-500 to-purple-700",
      bgHover: "bg-purple-50",
    },
    {
      id: 3,
      from: "left",
      heading: "Intelligent Word Formation",
      baseText: "Context-aware word construction and validation",
      detailedText:
        "Our AI assembles recognized characters into meaningful Nepali words, using linguistic models to ensure proper word boundaries and grammatical accuracy in the Devanagari script.",
      icons: faLanguage,
      color: "text-emerald-600",
      bgGradient: "from-emerald-500 to-emerald-700",
      bgHover: "bg-emerald-50",
    },
    {
      id: 4,
      from: "right",
      heading: "Batch Processing",
      baseText: "Process multiple documents simultaneously",
      detailedText:
        "Upload and convert dozens of Nepali documents at once. Our system handles batch operations efficiently, saving you time on large-scale translation projects.",
      icons: faCloudArrowUp,
      color: "text-yellow-600",
      bgGradient: "from-yellow-500 to-yellow-700",
      bgHover: "bg-yellow-50",
    },
    {
      id: 5,
      from: "left",
      heading: "Multi-Format Export",
      baseText: "Download in TXT, PDF, or DOC formats",
      detailedText:
        "Export your translated content in multiple formats. Preserve formatting, maintain document structure, and choose the file type that works best for your workflow.",
      icons: faFileExport,
      color: "text-red-600",
      bgGradient: "from-red-500 to-red-700",
      bgHover: "bg-red-50",
    },
    {
      id: 6,
      from: "right",
      heading: "High-Speed Processing",
      baseText: "Fast, reliable, and consistent performance",
      detailedText:
        "Experience lightning-fast translation without compromising accuracy. Our optimized pipeline processes documents in seconds, with 99.9% uptime reliability.",
      icons: faShieldHalved,
      color: "text-green-600",
      bgGradient: "from-green-500 to-green-700",
      bgHover: "bg-green-50",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-[#0f243f] via-[#1a3a5c] to-[#0f243f] min-h-screen">
        {/* Header Section */}
        <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-10 md:pb-12 lg:pb-16 px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 font-[italiana]">
              Features
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-[italiana]">
              Experience cutting-edge AI technology for Nepali text recognition
              and translation
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8 pb-12 sm:pb-16 md:pb-20 max-w-7xl mx-auto">
          {features.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: item.from === "left" ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px", amount: 0.2 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.1,
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
              w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[75%]
              ${item.from === "left" ? "self-start" : "self-end"}
            `}
            >
              <div
                className={`
                relative group
                bg-white rounded-2xl sm:rounded-3xl
                shadow-xl hover:shadow-2xl
                transition-all duration-500
                ${hoveredId === item.id ? item.bgHover : ""}
                overflow-hidden
              `}
              >
                {/* Animated gradient border effect */}
                <div
                  className={`
                  absolute inset-0 rounded-2xl sm:rounded-3xl
                  bg-gradient-to-r ${item.bgGradient}
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-500
                  blur-xl -z-10
                `}
                />

                {/* Content Container */}
                <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
                  {/* Icon and Heading Row */}
                  <div className="flex items-start gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5">
                    {/* Icon Container */}
                    <motion.div
                      animate={{
                        scale: hoveredId === item.id ? 1.1 : 1,
                        rotate: hoveredId === item.id ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{
                        duration: 0.5,
                        rotate: { duration: 0.6 },
                      }}
                      className={`
                      flex-shrink-0
                      w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                      flex items-center justify-center
                      rounded-xl sm:rounded-2xl
                      bg-gradient-to-br ${item.bgGradient}
                      shadow-lg
                    `}
                    >
                      <FontAwesomeIcon
                        icon={item.icons}
                        className="text-white text-lg sm:text-xl md:text-2xl"
                      />
                    </motion.div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight font-[italiana]">
                        {item.heading}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 leading-relaxed font-[italiana]">
                        {item.baseText}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4 sm:mb-5" />

                  {/* Detailed Description */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: hoveredId === item.id ? "auto" : 0,
                      opacity: hoveredId === item.id ? 1 : 0,
                      marginBottom: hoveredId === item.id ? "1rem" : 0,
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden hidden md:block"
                  >
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed font-[italiana]">
                      {item.detailedText}
                    </p>
                  </motion.div>

                  {/* Always visible on mobile/tablet */}
                  <div className="md:hidden">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-[italiana]">
                      {item.detailedText}
                    </p>
                  </div>

                  {/* Decorative corner accent */}
                  <div
                    className={`
                    absolute ${
                      item.from === "left" ? "top-0 right-0" : "top-0 left-0"
                    }
                    w-24 h-24 sm:w-32 sm:h-32
                    bg-gradient-to-br ${item.bgGradient}
                    opacity-5
                    rounded-full
                    blur-2xl
                    -translate-y-1/2 ${
                      item.from === "left"
                        ? "translate-x-1/2"
                        : "-translate-x-1/2"
                    }
                  `}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center pb-16 sm:pb-20 md:pb-24 lg:pb-28 px-4 sm:px-6"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight font-[italiana]">
              Ready to Transform Your Nepali Documents?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto font-[italiana]">
              Join thousands of users who trust our AI-powered OCR technology
              for accurate Nepali text recognition and translation
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Features;
