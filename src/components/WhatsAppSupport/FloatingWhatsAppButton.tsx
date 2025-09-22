import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/utils/apiClient";

interface WhatsAppConfig {
  whatsapp_number: string;
  whatsapp_enabled: string;
  whatsapp_message: string;
}

const FloatingWhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    // Fetch WhatsApp configuration
    const fetchConfig = async () => {
      try {
        const response = await apiClient.get("/api/support-config");
        if (response.data.success) {
          const configData = response.data.configs;
          // Only show if WhatsApp is enabled and has a number
          if (configData.whatsapp_enabled === 'true' && configData.whatsapp_number) {
            setConfig(configData);
            setIsVisible(true);
            
            // Show tooltip after 3 seconds for first-time visitors
            const tooltipTimer = setTimeout(() => {
              setShowTooltip(true);
              // Hide tooltip after 5 seconds
              setTimeout(() => setShowTooltip(false), 5000);
            }, 3000);
            
            return () => clearTimeout(tooltipTimer);
          }
        }
      } catch (error) {
        console.error("Error fetching WhatsApp config:", error);
      }
    };
    
    fetchConfig();
  }, []);
  
  const handleWhatsAppClick = () => {
    if (!config?.whatsapp_number) return;
    
    const message = config.whatsapp_message || "Hello! I need help with Skill Arena.";
    const phoneNumber = config.whatsapp_number.replace(/[\s+-]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    setShowTooltip(false);
  };
  
  if (!isVisible || !config) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-2 min-w-[200px]"
          >
            <div className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg border relative">
              <button
                onClick={() => setShowTooltip(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Need Help?</p>
                  <p className="text-xs text-gray-600">Chat with us on WhatsApp!</p>
                </div>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={handleWhatsAppClick}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat with us on WhatsApp"
      >
        {/* Ripple effect */}
        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
        
        <MessageCircle 
          className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-200" 
        />
        
        {/* Pulsing ring */}
        <div className="absolute inset-0 border-2 border-green-300 rounded-full animate-pulse"></div>
      </motion.button>
    </div>
  );
};

export default FloatingWhatsAppButton;