import React from "react";
import NavBar from "./Navbar";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faCloudArrowUp,
  faFileExport,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

const Features = () => {
  const baseVariant = {
    hiddenLeft: { x: "-100%", opacity: 0 },
    hiddenRight: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const containers = [
    {
      id: 1,
      from: "left",
      heading: "High Accuracy OCR",
      baseText: "Pixel perfect text extraction using OCR",
      icons: faFileLines,
      color: "text-blue-600",
    },
    {
      id: 2,
      from: "right",
      heading: "Batch Uploads",
      baseText: "Process multiple documents at once",
      icons: faCloudArrowUp,
      color: "text-yellow-600",
    },
    {
      id: 3,
      from: "left",
      heading: "Export Option",
      baseText: "Instant download as TXT, PDF, DOC",
      icons: faFileExport,
      color: "text-red-600",
    },
    {
      id: 4,
      from: "right",
      heading: "Reliable Execution",
      baseText: "Fast and consistent processing performance",
      icons: faShieldHalved,
      color: "text-green-600",
    },
  ];

  return (
    <>
      <NavBar />
      <div className="bg-[#0f243f]">
        <div className="min-h-screen flex flex-col gap-6 justify-center px-4 overflow-hidden">
          {containers.map((item, index) => (
            <motion.div
              key={item.id}
              variants={baseVariant}
              initial={item.from === "left" ? "hiddenLeft" : "hiddenRight"}
              animate="visible"
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.4,
              }}
              className={`
                w-full sm:w-[70%] md:w-[55%] lg:w-[45%]
                p-6 shadow-xl
                bg-white text-gray-800
                font-[italiana]
                ${
                  item.from === "left"
                    ? "self-start rounded-r-3xl"
                    : "self-end rounded-l-3xl"
                }
              `}
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                <FontAwesomeIcon icon={item.icons} className={item.color} />
                {item.heading}
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {item.baseText}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Features;
