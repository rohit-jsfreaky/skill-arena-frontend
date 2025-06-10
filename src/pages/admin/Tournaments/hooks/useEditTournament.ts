import { updateTournament } from "@/api/admin/tournaments";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import { useTournamentForm } from "./useTournamentForm";

export const useEditTournament = (tournament: any) => {
   function convertUTCToKolkataLocal(utcDateStr: string): string {
    const date = new Date(utcDateStr);

    // Create formatter for Asia/Kolkata
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Kolkata",
    };

    // Format the date parts
    const formatter = new Intl.DateTimeFormat("en-GB", options);
    const parts = formatter.formatToParts(date).reduce((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {} as Record<string, string>);

    // Construct in datetime-local format: YYYY-MM-DDTHH:MM
    const localDateTime = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
    console.log(localDateTime);
    return localDateTime;
  }

  const initialData = {
    title: tournament?.name || "",
    description: tournament?.description || "",
    image_url: tournament?.image || "",
    team_mode: tournament?.team_mode || "solo",
    entry_fee_normal: tournament?.entry_fee_normal || 0,
    entry_fee_pro: tournament?.entry_fee_pro || 0,
    max_participants: tournament?.max_participants || 100,
    start_time: tournament?.start_time
      ? convertUTCToKolkataLocal(tournament.start_time)
      : "",
    end_time: tournament?.end_time
      ? convertUTCToKolkataLocal(tournament.end_time)
      : "",
    game_name: tournament?.game_name || "",
    prize_pool: tournament?.prize_pool || 0,
    rules: tournament?.rules || "",
    room_id: tournament?.room_id || null,
    room_password: tournament?.room_password || null,
  };

  const tournamentForm = useTournamentForm(initialData);
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

    const apiFormData = {
      ...formData,
      name: formData.title,
      image: formData.image_url,
    };

    const res = await updateTournament({
      setLoading,
      formData: apiFormData,
      id: tournament.id,
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
    convertUTCToKolkataLocal
  };
};
