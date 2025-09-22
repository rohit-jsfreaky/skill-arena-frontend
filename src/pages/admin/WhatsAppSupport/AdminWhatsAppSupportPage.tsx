import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import api from "@/utils/api";
import { MessageCircle, Phone, Save } from "lucide-react";

interface SupportConfig {
  config_key: string;
  config_value: string;
  config_label: string;
  config_description: string;
  config_type: string;
  is_active: boolean;
}

const AdminWhatsAppSupportPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp_number: "",
    whatsapp_enabled: true,
    whatsapp_message: ""
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/support-config");
      
      if (response.data.success) {
        // Initialize form data
        const configsObj = response.data.configs.reduce((acc: Record<string, string | boolean>, config: SupportConfig) => {
          acc[config.config_key] = config.config_type === 'boolean' 
            ? config.config_value === 'true' 
            : config.config_value;
          return acc;
        }, {});
        
        setFormData(configsObj);
      } else {
        showErrorToast("Failed to fetch support configurations");
      }
    } catch (error) {
      console.error("Error fetching support configs:", error);
      showErrorToast("Failed to fetch support configurations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateConfig = async (configKey: string, configValue: string | boolean) => {
    try {
      const response = await api.put("/api/admin/support-config", {
        config_key: configKey,
        config_value: configValue.toString()
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return true;
    } catch (error: unknown) {
      throw new Error(error instanceof Error && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String(error.response.data.message) 
        : "Failed to update configuration");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update all configurations
      await Promise.all([
        updateConfig('whatsapp_number', formData.whatsapp_number),
        updateConfig('whatsapp_enabled', formData.whatsapp_enabled),
        updateConfig('whatsapp_message', formData.whatsapp_message)
      ]);

      showSuccessToast("WhatsApp support configuration updated successfully!");
      await fetchConfigs(); // Refresh data
    } catch (error: unknown) {
      showErrorToast(error instanceof Error ? error.message : "Failed to save configurations");
    } finally {
      setSaving(false);
    }
  };

  const validateWhatsAppNumber = (number: string) => {
    if (!number) return true; // Allow empty for optional
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(number.replace(/[\s-]/g, ''));
  };

  const handleTestWhatsApp = () => {
    if (!formData.whatsapp_number) {
      showErrorToast("Please enter a WhatsApp number first");
      return;
    }

    if (!validateWhatsAppNumber(formData.whatsapp_number)) {
      showErrorToast("Please enter a valid WhatsApp number with country code");
      return;
    }

    const message = formData.whatsapp_message || "Hello! I need help with Skill Arena.";
    const whatsappUrl = `https://wa.me/${formData.whatsapp_number.replace(/[\s+-]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner color="white" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-black pt-10">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold">WhatsApp Support Configuration</h1>
          <p className="text-gray-600 mt-1">
            Configure WhatsApp support settings for your website
          </p>
        </div>
      </div>

      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            WhatsApp Support Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            {/* Enable/Disable WhatsApp Support */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Enable WhatsApp Support</Label>
                <p className="text-sm text-gray-500">
                  Show WhatsApp support button on the website
                </p>
              </div>
              <Switch
                checked={formData.whatsapp_enabled}
                onCheckedChange={(checked) => handleInputChange('whatsapp_enabled', checked)}
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number" className="text-base font-medium">
                WhatsApp Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="whatsapp_number"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  onClick={handleTestWhatsApp}
                  disabled={!formData.whatsapp_number}
                >
                  Test
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Enter the WhatsApp number with country code (e.g., +1234567890)
              </p>
              {formData.whatsapp_number && !validateWhatsAppNumber(formData.whatsapp_number) && (
                <p className="text-sm text-red-500">
                  Please enter a valid WhatsApp number with country code
                </p>
              )}
            </div>

            {/* Default Message */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp_message" className="text-base font-medium">
                Default Message
              </Label>
              <Textarea
                id="whatsapp_message"
                placeholder="Hello! I need help with Skill Arena."
                value={formData.whatsapp_message}
                onChange={(e) => handleInputChange('whatsapp_message', e.target.value)}
                rows={3}
              />
              <p className="text-sm text-gray-500">
                This message will be pre-filled when users click the WhatsApp button
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saving || Boolean(formData.whatsapp_number && !validateWhatsAppNumber(formData.whatsapp_number))}
              className="flex items-center gap-2"
            >
              {saving ? (
                <LoadingSpinner color="white" size={16} />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {formData.whatsapp_enabled && formData.whatsapp_number && (
        <Card className="bg-black text-white">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-black text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp Support</p>
                  <p className="text-sm text-gray-600">Click to get help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestWhatsApp}
              >
                Test Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminWhatsAppSupportPage;