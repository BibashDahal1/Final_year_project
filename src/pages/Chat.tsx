import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Search,
  ArrowLeft,
} from "lucide-react";
import NavBar from "./Navbar";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! Let's get started",
      sender: "other",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const predefinedReplies = [
    "Sure, that sounds great!",
    "Sorry, I'm busy right now.",
    "Let me think about it.",
    "Thanks for letting me know!",
    "Can we reschedule?",
    "Absolutely! Count me in.",
    "I'll get back to you on that.",
    "No problem at all!",
  ];

  const emojis = [
    "😂",
    "❤️",
    "😍",
    "🤣",
    "😊",
    "🙏",
    "💕",
    "😭",
    "😘",
    "👍",
    "😅",
    "👏",
    "😁",
    "🔥",
    "🥰",
    "💔",
    "💖",
    "💙",
    "😢",
    "🤔",
    "😆",
    "🙄",
    "💪",
    "😉",
    "☺️",
    "👌",
    "🤗",
    "💜",
    "😔",
    "😎",
    "😇",
    "😡",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showSkeleton]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.includes("pdf")) return "📄";
    if (
      file.type.includes("word") ||
      file.name.endsWith(".doc") ||
      file.name.endsWith(".docx")
    )
      return "📝";
    if (
      file.type.includes("presentation") ||
      file.name.endsWith(".ppt") ||
      file.name.endsWith(".pptx")
    )
      return "📊";
    if (
      file.type.includes("sheet") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".xlsx")
    )
      return "📈";
    return "📎";
  };

  const handleSend = () => {
    if (inputText.trim() === "" && selectedFiles.length === 0) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
      files: selectedFiles.length > 0 ? [...selectedFiles] : null,
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setSelectedFiles([]);

    setTimeout(() => {
      setIsTyping(true);
      setShowSkeleton(true);
    }, 1000);

    setTimeout(() => {
      const randomReply =
        predefinedReplies[Math.floor(Math.random() * predefinedReplies.length)];
      const replyMessage = {
        id: messages.length + 2,
        text: randomReply,
        sender: "other",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "read",
      };

      setIsTyping(false);
      setShowSkeleton(false);
      setMessages((prev) => [...prev, replyMessage]);
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleEmojiClick = (emoji) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <NavBar />

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800 md:hidden" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold">
            OCR
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">OCRio</h3>
            <p className="text-xs text-gray-500">
              {isTyping ? "typing..." : "online"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          <MoreVertical className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-2 ${
                  message.sender === "me"
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                {/* Show files if attached */}
                {message.files && message.files.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {message.files.map((file, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center space-x-2 text-xs rounded px-2 py-1 ${
                          message.sender === "me"
                            ? "bg-white/20"
                            : "bg-gray-100"
                        }`}
                      >
                        <span>{getFileIcon(file)}</span>
                        <span className="truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs opacity-70">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {message.text && (
                  <p className="text-sm break-words">{message.text}</p>
                )}

                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-xs opacity-70">{message.time}</span>
                  {message.sender === "me" && (
                    <span className="text-xs">
                      {message.status === "sent" && "✓"}
                      {message.status === "delivered" && "✓✓"}
                      {message.status === "read" && (
                        <span className="text-blue-200">✓✓</span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Skeleton */}
          {showSkeleton && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 md:px-6 lg:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          {/* File Preview Section */}
          {selectedFiles.length > 0 && (
            <div className="mb-3 bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 text-sm shadow-sm border border-gray-200"
                  >
                    <span className="text-lg">{getFileIcon(file)}</span>
                    <span className="text-gray-700 truncate max-w-32">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors text-xl leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center space-x-3">
            <div className="relative" ref={emojiPickerRef}>
              <Smile
                className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 flex-shrink-0"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />

              {/* Emoji Picker Dropdown */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 w-72 max-h-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-y-auto z-50">
                  <div className="grid grid-cols-8 gap-1 p-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Paperclip
              className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700 flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            />

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-teal-500 text-white rounded-full p-2.5 hover:bg-teal-600 transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
