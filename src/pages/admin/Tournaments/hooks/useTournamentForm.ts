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
  // Slot-based tournament fields
  tournament_type?: 'regular' | 'slot-based';
  max_groups?: number;
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
    // Slot-based fields
    tournament_type: "slot-based",
    max_groups: 10,
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
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: ["entry_fee_normal", "entry_fee_pro", "max_participants", "prize_pool", "max_groups"].includes(name)
          ? parseFloat(value) || 0
          : value,
      };

      // Auto-calculate max_participants for slot-based tournaments
      if (newFormData.tournament_type === 'slot-based' && (name === 'team_mode' || name === 'max_groups')) {
        const slotsPerGroupMap = {
          'solo': 1,
          'duo': 2,
          '4v4': 4,
          '6v6': 6,
          '8v8': 8
        } as const;
        
        const slotsPerGroup = slotsPerGroupMap[newFormData.team_mode as keyof typeof slotsPerGroupMap] || 1;
        newFormData.max_participants = (newFormData.max_groups || 1) * slotsPerGroup;
      }

      return newFormData;
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