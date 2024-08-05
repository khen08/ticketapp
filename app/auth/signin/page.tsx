"use client";
import { useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { motion } from "framer-motion";

const SignIn = () => {
  useEffect(() => {
    // Disable body scrolling when the component mounts
    document.body.style.overflow = "hidden";

    // Re-enable body scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden bg-gray-900">
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"
        animate={{ x: [-200, 200, -200], y: [-200, 200, -200] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ mixBlendMode: "overlay" }}
      />
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"
        animate={{ rotate: [0, 360, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ mixBlendMode: "screen" }}
      />
      <LoginForm />
    </div>
  );
};

export default SignIn;
