import { createTournament } from "@/api/tournament";
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

    // Format dates to ISO strings before sending to the API
    const apiFormData = {
      ...formData,
      name: formData.title,
      image: formData.image_url,
      // Ensure dates are in ISO format
      start_time: formData.start_time
        ? new Date(formData.start_time).toISOString()
        : formData.start_time,
      end_time: formData.end_time
        ? new Date(formData.end_time).toISOString()
        : formData.end_time,
    };

    const res = await createTournament({
      setLoading,
      formData: apiFormData,
    });

    if (res.success) {
      showSuccessToast(res.message);
    } else {
      showErrorToast(res.message);
    }
  };

  return {
    ...tournamentForm,
    handleSubmit,
  };
};
