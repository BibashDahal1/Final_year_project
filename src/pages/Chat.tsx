import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History } from "lucide-react";
import {
  Upload,
  FileText,
  FileImage,
  File,
  X,
  Languages,
  Download,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import NavBar from "./Navbar";

const Translator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedPreviewUrl, setTranslatedPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");

  const [showHistory, setShowHistory] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([
    {
      id: 1,
      fileName: "document1.pdf",
      sourceLang: "English",
      targetLang: "Nepali",
      date: "2024-01-20",
      time: "10:30 AM",
    },
    {
      id: 2,
      fileName: "image2.jpg",
      sourceLang: "Nepali",
      targetLang: "English",
      date: "2024-01-19",
      time: "03:45 PM",
    },
  ]);

  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const languages = [
    { code: "en", name: "English" },
    { code: "ne", name: "Nepali" },
  ];

  const getFileIcon = (type) => {
    if (type?.startsWith("image/")) return <FileImage className="w-8 h-8" />;
    if (type?.includes("pdf")) return <FileText className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const getFileTypeCategory = (type) => {
    if (type?.startsWith("image/")) return "image";
    if (type?.includes("pdf")) return "pdf";
    if (type?.includes("word") || type?.includes("document")) return "document";
    return "other";
  };

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit");
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Unsupported file type. Please upload an image, PDF, or Word document",
      );
    }

    return true;
  };

  const handleFileSelect = (file) => {
    try {
      setError(null);
      setIsTranslated(false);
      setTranslatedPreviewUrl(null);

      if (!file) return;

      validateFile(file);

      setSelectedFile(file);
      setFileType(getFileTypeCategory(file.type));

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.onerror = () => {
          setError("Failed to read image file");
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    } catch (err) {
      setError(err.message);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-teal-500", "bg-teal-50");
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-teal-500", "bg-teal-50");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-teal-500", "bg-teal-50");
    }

    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file);
  };

  const handleTranslate = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    if (sourceLang !== "auto" && sourceLang === targetLang) {
      setError("Source and target languages cannot be the same");
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      // Simulate translation process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setTranslatedPreviewUrl(previewUrl || "translated");
      setIsTranslated(true);

      const newHistoryItem = {
        id: Date.now(),
        fileName: selectedFile.name,
        sourceLang:
          languages.find((l) => l.code === sourceLang)?.name || sourceLang,
        targetLang:
          languages.find((l) => l.code === targetLang)?.name || targetLang,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setTranslationHistory((prev) => [newHistoryItem, ...prev]);
    } catch (err) {
      setError("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleExport = () => {
    if (!isTranslated || !selectedFile) {
      setError("No translated document to export");
      return;
    }

    try {
      // In real implementation, this would download the translated file
      const fileName =
        selectedFile.name.replace(/\.[^/.]+$/, "") +
        "_translated" +
        selectedFile.name.match(/\.[^/.]+$/)[0];

      // Simulate download
      const link = document.createElement("a");
      link.href = translatedPreviewUrl || "#";
      link.download = fileName;
      link.click();

      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      successMsg.textContent = "Document exported successfully!";
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (err) {
      setError("Failed to export document");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
    setIsTranslated(false);
    setTranslatedPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />

      <button
        onClick={() => setShowHistory(true)}
        className="fixed top-20 left-4 z-40 bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        title="Translation History"
      >
        <History className="w-6 h-6" />
      </button>

      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              OCRio Translator
            </h1>
            <p className="text-gray-600">
              Upload your documents and translate them instantly
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Language Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <Languages className="w-6 h-6 text-teal-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Translation Settings
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Language
                </label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Language
                </label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  {languages
                    .filter((lang) => lang.code !== "auto")
                    .map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          {!selectedFile ? (
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="bg-white rounded-xl shadow-lg p-12 border-2 border-dashed border-gray-300 hover:border-teal-400 transition-all duration-300"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-6">
                  <Upload className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Upload Your Document
                </h3>
                <p className="text-gray-600 mb-6">
                  Drag and drop your file here, or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Choose File
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Document */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Original Document
                  </h3>
                  <button
                    onClick={handleReset}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* File Info */}
                <div className="flex items-center space-x-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-teal-500">
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                {/* Preview */}
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  {fileType === "image" && previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-50">
                      <div className="text-center">
                        {getFileIcon(selectedFile.type)}
                        <p className="mt-2 text-gray-600">
                          Preview not available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Translated Document */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Translated Document
                  </h3>
                  {isTranslated && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>

                {/* Preview */}
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
                  {isTranslated &&
                  fileType === "image" &&
                  translatedPreviewUrl ? (
                    <img
                      src={translatedPreviewUrl}
                      alt="Translated Preview"
                      className="w-full h-auto max-h-96 object-contain bg-gray-50"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-50">
                      <div className="text-center">
                        {isTranslating ? (
                          <>
                            <Loader className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">
                              Translating...
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              This may take a moment
                            </p>
                          </>
                        ) : (
                          <>
                            <Languages className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">
                              Translation will appear here
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleTranslate}
                    disabled={isTranslating || isTranslated}
                    className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    {isTranslating ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Translating...</span>
                      </>
                    ) : (
                      <>
                        <Languages className="w-5 h-5" />
                        <span>
                          {isTranslated ? "Translated" : "Translate Document"}
                        </span>
                      </>
                    )}
                  </button>

                  {isTranslated && (
                    <button
                      onClick={handleExport}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Export Translated Document</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <FileImage className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Multiple Formats
              </h3>
              <p className="text-sm text-gray-600">
                Support for images, PDFs, and Word documents
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Languages className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Multi-Language
              </h3>
              <p className="text-sm text-gray-600">
                Translate to and from 2+ languages
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Easy Export</h3>
              <p className="text-sm text-gray-600">
                Download your translated documents instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showHistory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <History className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Translation History</h2>
                  </div>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="hover:bg-white/20 p-1 rounded-full transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-teal-50">
                  {translationHistory.length} translations
                </p>
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {translationHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <History className="w-16 h-16 mb-3 opacity-30" />
                    <p className="text-sm">No translation history yet</p>
                  </div>
                ) : (
                  translationHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 cursor-pointer transition-all border border-gray-200 hover:border-teal-300 hover:shadow-md"
                      onClick={() => {
                        // Handle clicking on history item
                        console.log("Load translation:", item.id);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-teal-500 flex-shrink-0" />
                          <p className="font-medium text-gray-800 truncate text-sm">
                            {item.fileName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {item.sourceLang}
                        </span>
                        <Languages className="w-3 h-3" />
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {item.targetLang}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.date}</span>
                        <span>{item.time}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    if (window.confirm("Clear all translation history?")) {
                      setTranslationHistory([]);
                    }
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Clear History
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Translator;
