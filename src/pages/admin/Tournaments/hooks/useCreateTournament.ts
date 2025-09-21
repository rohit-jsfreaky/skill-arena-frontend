import { createSlotBasedTournament } from "@/api/tournament";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import { useTournamentForm } from "./useTournamentForm";

export const useCreateTournament = () => {
  const tournamentForm = useTournamentForm();
  const { formData, setError, validateForm, setLoading, uploading } =
    tournamentForm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    if (uploading) {
      setError("Please wait for image upload to complete");
      return;
    }

    try {
      setLoading(true);

      // Handle slot-based tournament creation
      const slotApiFormData = {
        name: formData.title,
        game_name: formData.game_name,
        description: formData.description,
        image: formData.image_url,
        tournament_mode: formData.team_mode as "solo" | "duo" | "4v4" | "6v6" | "8v8",
        max_groups: formData.max_groups || 10,
        entry_fee_normal: formData.entry_fee_normal,
        entry_fee_pro: formData.entry_fee_pro,
        prize_pool: formData.prize_pool,
        start_time: formData.start_time
          ? new Date(formData.start_time).toISOString()
          : formData.start_time,
        end_time: formData.end_time
          ? new Date(formData.end_time).toISOString()
          : formData.end_time,
        rules: formData.rules,
        youtube_live_url: formData.youtube_live_url || undefined,
      };

      const res = await createSlotBasedTournament(slotApiFormData);
      
      if (res.success) {
        showSuccessToast(res.message);
      } else {
        showErrorToast(res.message);
      }
    } catch (error) {
      showErrorToast("An error occurred while creating the tournament");
      console.error("Tournament creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...tournamentForm,
    handleSubmit,
  };
};
