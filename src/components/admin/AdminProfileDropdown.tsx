import { useState, useRef, useEffect } from "react";
import { LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import api from "@/utils/api";

interface AdminProfileDropdownProps {
  adminUsername?: string;
}

const AdminProfileDropdown = ({ adminUsername = "Admin" }: AdminProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const confirmDialogRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        confirmDialogRef.current &&
        !confirmDialogRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout with confirmation
  const handleLogout = async () => {
    try {
      const response = await api.post('api/admin/auth/logout');
      if (response.status === 200) {
        showSuccessToast('Logged out successfully');
        navigate('/admin/login');
      } else {
        showErrorToast('Failed to logout');
      }
    } catch (error) {
      showErrorToast('An error occurred during logout');
      console.error('Logout error:', error);
    } finally {
      setShowLogoutConfirm(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-black/40 hover:bg-black/60 border border-[#BBF429]/40 rounded-full p-2 transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-[#BBF429]/20 flex items-center justify-center text-[#BBF429]">
          <User size={18} />
        </div>
        <span className="hidden md:block ml-2 text-white font-medium">
          {adminUsername}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-black/90 border border-[#BBF429]/30 rounded-lg shadow-xl overflow-hidden"
          >
            <div 
              className="px-4 py-3 cursor-pointer hover:bg-[#BBF429]/10 flex items-center gap-2 text-white"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut size={16} className="text-red-400" />
              <span>Logout</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-[#BBF429]/30 rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
              ref={confirmDialogRef}
            >
              <h3 className="text-xl font-bold text-white mb-4">Confirm Logout</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfileDropdown;