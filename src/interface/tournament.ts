import { UserContextType } from "@/context/UserContext";
import { Participant } from "@/pages/Tournaments/TournamentDetails";
import { NavigateFunction } from "react-router";

export type TournamentFilterOption =
  | "all"
  | "upcoming"
  | "ongoing"
  | "completed";

export interface TournamentFormData {
  title: string;
  description: string;
  image_url: string;
  team_mode: "solo" | "duo" | "4v4";
  entry_fee_normal: number;
  entry_fee_pro: number;
  max_participants: number;
  start_time: string;
  end_time: string;
  game_name: string;
  prize_pool: number;
  room_id?: string | null;
  room_password?: string | null;
  rules: string;
  youtube_live_url?: string | null;
}

export interface Tournament {
  id: number;
  name: string;
  game_name: string;
  description: string;
  image: string;
  team_mode: string;
  entry_fee_normal: number;
  entry_fee_pro: number;
  prize_pool: number;
  max_participants: number;
  start_time: string;
  end_time: string;
  rules: string;
  status: string;
  room_id?: string;
  room_password?: string;
  current_participants: number;
  youtube_live_url?: string | null;
}

export interface PastTournament {
  id: number;
  title: string;
  image_url: string;
  team_mode: string;
  entry_fee_normal: number;
  entry_fee_pro: number;
  participants: number;
  max_participants: number;
  start_time: string;
  end_time: string;
}

export interface createTournamentProps {
  setLoading: (value: React.SetStateAction<boolean>) => void;
  formData: TournamentFormData;
}

export interface updateTournamentProps {
  setLoading: (value: React.SetStateAction<boolean>) => void;
  formData: TournamentFormData;
  id: number;
}

export interface fetchTournamentDetailsProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTournament: React.Dispatch<React.SetStateAction<Tournament | null>>;
  id: string | undefined;
  myUser?: UserContextType | null;
  setHasJoined?: React.Dispatch<React.SetStateAction<boolean>>;
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  authToken?: string;
  admin?: boolean;
}

export interface joinTournamentProps {
  myUser: UserContextType | null;
  navigate: NavigateFunction;
  setJoining: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  id: string | undefined;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  setHasJoined: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<UserContextType | null>>;
  setTournament: React.Dispatch<React.SetStateAction<Tournament | null>>;
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
}

export interface fetchHistoryProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
}

export interface fetchTournamentsProps {
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  page?: number;
  limit?: number;
  user_id?: number;
}

export interface fetchMyTournamentsProps {
  myUser: UserContextType | null;
  setMyTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
}
