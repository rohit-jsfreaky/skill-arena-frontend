import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "@/utils/api";
import { toast } from "sonner";

interface FormData {
  usernameOrEmail: string;
  password: string;
}

export const useAdminAuth = () => {
  const [formData, setFormData] = useState<FormData>({
    usernameOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("checking auth");
      try {
        const res = await api.get("api/admin/auth/check-auth");
        if (res.data.authenticated) {
          navigate("/admin/dashboard");
        }
        console.log(res.data);
      } catch {
        console.log("Not authenticated, staying on login page");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("api/admin/auth/login", formData);
      toast.success("Login successful!");
      return
      setTimeout(()=>{
        navigate("/admin/dashboard");
      },1000)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    showPassword,
    loading,
    handleChange,
    handleLogin,
    setShowPassword,
    navigate
  };
};