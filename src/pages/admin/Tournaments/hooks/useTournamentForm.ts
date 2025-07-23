import { useState, useEffect } from 'react';
import { TournamentFormData } from "@/interface/tournament";
import { handleImageUpload } from "@/api/admin/tournaments";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";

export interface TournamentFormState extends TournamentFormData {
  game_name: string;
  prize_pool: number;
  rules: string;
  room_id?: string | null;
  room_password?: string | null;
}

export const useTournamentForm = (initialData?: Partial<TournamentFormState>) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minDateTime, setMinDateTime] = useState("");

  const [formData, setFormData] = useState<TournamentFormState>({
    title: "",
    description: "",
    image_url: "",
    team_mode: "solo",
    entry_fee_normal: 0,
    entry_fee_pro: 0,
    max_participants: 100,
    start_time: "",
    end_time: "",
    game_name: "",
    prize_pool: 0,
    rules: "",
    youtube_live_url: "",
    ...initialData
  });

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ["entry_fee_normal", "entry_fee_pro", "max_participants", "prize_pool"].includes(name)
        ? parseFloat(value)
        : value,
    });
  };

  const imageUpload = async (file: File) => {
    const res = await handleImageUpload(file, setUploading, setFormData);
    if (res.success) {
      showSuccessToast(res.message);
    } else {
      showErrorToast(res.message);
    }
  };

  const validateForm = () => {
    const now = new Date();
    const startTime = new Date(formData.start_time);
    const endTime = formData.end_time ? new Date(formData.end_time) : null;

    if (startTime <= now) {
      setError("Start time must be in the future");
      return false;
    }

    if (endTime && endTime <= startTime) {
      setError("End time must be after start time");
      return false;
    }

    return true;
  };

  return {
    loading,
    setLoading,
    uploading,
    error,
    setError,
    minDateTime,
    formData,
    setFormData,
    handleChange,
    imageUpload,
    validateForm
  };
};