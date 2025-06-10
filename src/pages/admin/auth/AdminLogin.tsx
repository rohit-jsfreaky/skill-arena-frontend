import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAdminAuth } from "./useAdminAuth";

const AdminLogin = () => {
  const {
    showPassword,
    loading,
    handleChange,
    handleLogin,
    setShowPassword,
    navigate
  } = useAdminAuth();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-[#BBF429] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username / Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label className="block text-gray-700 font-medium">
              Username or Email
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Enter username or email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#BBF429] focus:outline-none transition-all duration-300"
              required
            />
          </motion.div>

          {/* Password Input with Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
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

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p
              onClick={() => {
                navigate("/admin/forgot");
              }}
              className="text-blue-500 text-sm cursor-pointer underline"
            >
              Forgot Password?
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl w-full text-black bg-[linear-gradient(90deg,#BBF429_70%,transparent_100%)] hover:bg-white transition duration-300 px-6 py-2.5 hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
