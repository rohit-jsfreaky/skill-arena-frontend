// TDM Match Status Types
export type TdmMatchType = 'public' | 'private';
export type TdmMatchStatus = 'waiting' | 'team_a_ready' | 'team_b_ready' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type TdmTeamType = 'team_a' | 'team_b';

// Basic TDM Match
export interface TdmMatch {
  id: number;
  match_type: TdmMatchType;
  status: TdmMatchStatus;
  room_id?: string;
  room_password?: string;
  game_name: string;
  entry_fee: number;
  prize_pool: number;
  created_by: number;
  created_at: string;
  start_time?: string;
  end_time?: string;
  winner_team_id?: number;
  team_a_name?: string;
  team_b_name?: string;
  team_a_size?: number;
  team_b_size?: number;
  team_a_id?: number;
  team_b_id?: number;
  team_a_members?:string;
  team_size: number;  // Add team size
}

// TDM Team Member
export interface TdmTeamMember {
  id: number;
  team_id: number;
  user_id: number;
  username?: string;
  name?: string;
  profile?: string;
  is_captain: boolean;
  payment_amount?: number;
  payment_status?: 'pending' | 'completed';
  joined_at: string;
}

// TDM Team
export interface TdmTeam {
  id: number;
  match_id: number;
  team_type: TdmTeamType;
  team_name: string;
  is_ready: boolean;
  payment_completed: boolean;
  created_at: string;
  members?: TdmTeamMember[];
}

// Detailed TDM Match (includes teams)
export interface TdmMatchDetails extends TdmMatch {
  team_a: TdmTeam;
  team_b: TdmTeam;
}

// Request Types
export interface CreateTdmMatchRequest {
  match_type: TdmMatchType;
  game_name: string;
  entry_fee: number;
  team_name: string;
  team_members: number[]; // Now can be 1-4 members
  creatorId: number;
  team_size: number;  // Add this new field
}

export interface JoinTdmMatchRequest {
  match_id: number;
  team_name: string;
  team_members: number[]; // Now can be 1-4 members
  captainId: number;
  team_size?: number;  // Add optional team size for joining (server might already know it)
}

// TDM Screenshot
export interface TdmScreenshot {
  id: number;
  match_id: number;
  team_id: number;
  user_id: number;
  username?: string;
  screenshot_path: string;
  upload_timestamp: string;
  verification_status: 'pending' | 'verified_win' | 'verified_loss' | 'disputed' | 'admin_reviewed';
  ocr_result?: string;
  admin_notes?: string;
}

// TDM Dispute
export interface TdmDispute {
  id: number;
  match_id: number;
  reported_by: number;
  reporter_username?: string;
  reported_team_id: number;
  reported_team_name?: string;
  reason: string;
  evidence_path?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

// TDM Match Result
export interface TdmMatchResult {
  id: number;
  match_id: number;
  winner_team_id: number;
  prize_awarded: boolean;
  prize_amount: number;
  resolution_method: 'automatic' | 'admin_decision';
  resolved_at: string;
  created_at: string;
}