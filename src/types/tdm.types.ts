export interface TdmPlayer {
  id: number;
  username: string;
  name: string;
  profile: string;
}

export interface TdmTeam {
  id: number;
  team_type: 'team_a' | 'team_b';
  team_name: string;
  is_ready: boolean;
  payment_completed: boolean;
  members: TdmPlayer[];
}

export interface TdmMatch {
  id: number;
  match_type: 'public' | 'private';
  status: 'waiting' | 'team_a_ready' | 'team_b_ready' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
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
  team_a?: TdmTeam;
  team_b?: TdmTeam;
}

export interface TdmDispute {
  id: number;
  match_id: number;
  reported_by: number;
  reported_team_id: number;
  reason: string;
  evidence_path?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface TdmMatchResult {
  match_id: number;
  winner_team_id: number;
  prize_awarded: boolean;
  prize_amount: number;
  resolution_method: 'automatic' | 'admin_decision';
  resolved_at: string;
}

export interface TdmScreenshot {
  id: number;
  match_id: number;
  team_id: number;
  user_id: number;
  screenshot_path: string;
  upload_timestamp: string;
  verification_status: 'pending' | 'verified_win' | 'verified_loss' | 'disputed' | 'admin_reviewed';
  ocr_result?: string;
  admin_notes?: string;
}