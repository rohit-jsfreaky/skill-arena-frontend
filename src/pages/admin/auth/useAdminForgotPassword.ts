import { useState, useRef } from "react";
import api from "@/utils/api";

export const useAdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await api.post("api/admin/auth/send-otp", { email: email });

      if (res.status === 200) {
        setIsOtpSent(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOTP = otp.join("");

    try {
      setLoading(true);
      const res = await api.post("api/admin/auth/verify-otp", {
        email: email,
        otp: enteredOTP,
      });
      if (res.status === 200) {
        setIsOtpVerified(true);
      }
      console.log(res.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!password || !confirmPassword) {
      return console.log("Password is required");
    }

    if (password !== confirmPassword) {
      return console.log("Password do no match");
    }

    if (password.length < 8) {
      return console.log("Password length must be 8 digit");
    }

    try {
      setLoading(true);
      const res = await api.post("api/admin/auth/reset-password", {
        email: email,
        password: password,
      });

      console.log(res.data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};