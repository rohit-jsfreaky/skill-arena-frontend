import ForgotPasswordEmail from "@/components/admin/auth/ForgotPasswordEmail";
import ForgotPasswordOtp from "@/components/admin/auth/ForgotPasswordOtp";
import ForgotPasswordPassword from "@/components/admin/auth/ForgotPasswordPassword";
import { motion } from "framer-motion";
import { useAdminForgotPassword } from "./useAdminForgotPassword";

const ForgotPassword = () => {
  const {
    email,
    setEmail,
    loading,
    isOtpSent,
    otp,
    isOtpVerified,
    password,
    confirmPassword,
    showPassword,
    inputRefs,
    handleForgotPassword,
    handleChange,
    handleKeyDown,
    handleSubmit,
    resetPassword,
    setPassword,
    setConfirmPassword,
    setShowPassword
  } = useAdminForgotPassword();

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-black to-[#BBF429] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        <ForgotPasswordEmail
          email={email}
          handleForgotPassword={handleForgotPassword}
          loading={loading}
          setEmail={setEmail}
          isOtpSent={isOtpSent}
        />

        {isOtpSent && (
          <ForgotPasswordOtp
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleSubmit={handleSubmit}
            inputRefs={inputRefs}
            otp={otp}
            loading={loading}
            isOtpVerified={isOtpVerified}
          />
        )}

        {isOtpVerified && (
          <div className="flex flex-col gap-4">
            <ForgotPasswordPassword
              name="normal"
              handleChange={setPassword}
              password={password}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />

            <ForgotPasswordPassword
              name="confirm"
              handleChange={setConfirmPassword}
              password={confirmPassword}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />

            <button
              onClick={resetPassword}
              className="rounded-2xl w-full text-black bg-[linear-gradient(90deg,#BBF429_70%,transparent_100%)] hover:bg-white transition duration-300 px-6 py-2.5 hover:cursor-pointer"
            >
              {loading ? "Reseting" : "Reset Password"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
