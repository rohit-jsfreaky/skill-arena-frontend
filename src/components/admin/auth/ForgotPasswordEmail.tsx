import { motion } from "framer-motion";
import React from "react";

type ForgotPasswordEmailProps = {
  handleForgotPassword: (e: React.FormEvent) => Promise<void>;
  email: string;
  setEmail: (value: React.SetStateAction<string>) => void;
  loading: boolean;
  isOtpSent: boolean;
};

const ForgotPasswordEmail = ({
  handleForgotPassword,
  email,
  setEmail,
  loading,
  isOtpSent,
}: ForgotPasswordEmailProps) => {
  return (
    <form onSubmit={handleForgotPassword} className="space-y-8 mb-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="text"
          name="usernameOrEmail"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#BBF429] focus:outline-none transition-all duration-300"
          required
        />
      </motion.div>

      {!isOtpSent && (
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl w-full text-black bg-[linear-gradient(90deg,#BBF429_70%,transparent_100%)] hover:bg-white transition duration-300 px-6 py-2.5 hover:cursor-pointer"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Otp"}
        </motion.button>
      )}
    </form>
  );
};

export default ForgotPasswordEmail;
