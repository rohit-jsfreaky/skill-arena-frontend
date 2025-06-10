import { motion } from "framer-motion";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type ForgotPasswordPasswordProps = {
  name: string;
  handleChange: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
};
const ForgotPasswordPassword = ({
  name,
  password,
  showPassword,
  handleChange,
  setShowPassword,
}: ForgotPasswordPasswordProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <label className="block text-gray-700 font-medium">
        {name === "confirm" ? "Confirm Password" : "Password"}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          name="password"
          placeholder="Enter password"
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#BBF429] focus:outline-none pr-10 transition-all duration-300"
          required
        />
        <span
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 hover:text-black transition-all duration-300"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </span>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPassword;
