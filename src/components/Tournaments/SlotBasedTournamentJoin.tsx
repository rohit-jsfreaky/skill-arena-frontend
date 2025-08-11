import React, { useState, useEffect, useCallback } from 'react';
import { Users, Crown, Trophy, Clock } from 'lucide-react';
import { getTournamentGroups, joinTournamentGroup, leaveTournamentGroup } from '@/api/tournament';
import { TournamentGroupsResponse } from '@/interface/tournament';

interface SlotBasedTournamentJoinProps {
  tournamentId: string;
  tournamentName: string;
  entryFee: number;
  userWallet: number;
  userId: string;
  onJoinSuccess: () => void;
}

const SlotBasedTournamentJoin: React.FC<SlotBasedTournamentJoinProps> = ({
  tournamentId,
  entryFee,
  userWallet,
  onJoinSuccess,
  userId,
}) => {
  const [groupsData, setGroupsData] = useState<TournamentGroupsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
  const response = await getTournamentGroups(tournamentId, userId);
      if (response.success) {
        setGroupsData(response.data);
      } else {
        setError('Failed to load tournament groups');
      }
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load tournament groups');
    } finally {
      setLoading(false);
    }
  }, [tournamentId, userId]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleJoinGroup = async () => {
    if (!selectedGroupId) {
      setError('Please select a group to join');
      return;
    }

    if (userWallet < entryFee) {
      setError('Insufficient wallet balance');
      return;
    }

    try {
      setJoining(true);
      setError('');
      
  const response = await joinTournamentGroup(tournamentId, parseInt(selectedGroupId), userId);
      
      if (response.success) {
        setSuccess(response.message);
        await fetchGroups(); // Refresh groups data
        onJoinSuccess();
        // Reload page to refresh user wallet and tournament state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(response.message || 'Failed to join group');
      }
    } catch (err: unknown) {
      console.error('Error joining group:', err);
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && 
        typeof err.response.data === 'object' && err.response.data !== null &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
        ? err.response.data.message
        : 'Failed to join group';
      setError(errorMessage);
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLeaving(true);
      setError('');
      
  const response = await leaveTournamentGroup(tournamentId, userId);
      
      if (response.success) {
        setSuccess(response.message);
        await fetchGroups(); // Refresh groups data
        // Reload page to refresh user wallet and tournament state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(response.message || 'Failed to leave group');
      }
    } catch (err: unknown) {
      console.error('Error leaving group:', err);
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && 
        typeof err.response.data === 'object' && err.response.data !== null &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
        ? err.response.data.message
        : 'Failed to leave group';
      setError(errorMessage);
    } finally {
      setLeaving(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'solo': return <Crown className="w-4 h-4" />;
      case 'duo': return <Users className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-black to-[#1A1A1A] border-2 border-[#BBF429] rounded-lg p-6">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BBF429]"></div>
        </div>
      </div>
    );
  }

  if (!groupsData) {
    return (
      <div className="w-full bg-gradient-to-r from-black to-[#1A1A1A] border-2 border-[#BBF429] rounded-lg p-6">
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
          Failed to load tournament groups
        </div>
      </div>
    );
  }

  const availableGroups = groupsData.groups.filter(group => !group.is_full);
  const isUserInGroup = groupsData.user_group !== null;
  const insufficientFunds = userWallet < entryFee;

  return (
    <div className="w-full bg-gradient-to-r from-black to-[#1A1A1A] border-2 border-[#BBF429] rounded-lg overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-[#BBF429]/30">
        <div className="flex items-center gap-2 mb-2">
          {getModeIcon(groupsData.tournament_mode)}
          <h2 className="text-2xl font-bold text-white">
            Join Tournament - {groupsData.tournament_mode.toUpperCase()} Mode
          </h2>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {groupsData.slots_per_group} players per group
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            {groupsData.max_groups} total groups
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg">
            {success}
          </div>
        )}

        {isUserInGroup ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#BBF429]/10 border border-[#BBF429]/30 text-[#BBF429] rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                You are in Group {groupsData.user_group?.group_number}
              </div>
            </div>
            
            <button
              onClick={handleLeaveGroup}
              disabled={leaving}
              className={`w-full px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                leaving
                  ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
                  : "bg-red-500 hover:bg-red-500/80 text-white"
              }`}
            >
              {leaving ? 'Leaving...' : 'Leave Group'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {insufficientFunds && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
                Insufficient wallet balance. You need ₹{entryFee} but have ₹{userWallet}
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-white font-medium">Select a Group <span className="text-red-400">*</span>:</label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-[#BBF429]/30 rounded-lg text-white focus:outline-none focus:border-[#BBF429] transition-colors"
              >
                <option value="" className="bg-black text-gray-400">
                  {availableGroups.length === 0 ? "No available groups" : "Choose an available group"}
                </option>
                {availableGroups.map((group) => (
                  <option key={group.id} value={group.id.toString()} className="bg-black">
                    Group {group.group_number} ({group.current_members}/{group.max_members})
                  </option>
                ))}
              </select>
              
              {availableGroups.length === 0 && (
                <p className="text-sm text-gray-400">All groups are full.</p>
              )}
            </div>

            <button
              onClick={handleJoinGroup}
              disabled={joining || insufficientFunds || availableGroups.length === 0 || !selectedGroupId}
              className={`w-full px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                joining || insufficientFunds || availableGroups.length === 0 || !selectedGroupId
                  ? "bg-gray-600/50 cursor-not-allowed text-gray-400"
                  : "bg-[#BBF429] hover:bg-[#BBF429]/80 text-black"
              }`}
            >
              {joining 
                ? 'Joining...' 
                : !selectedGroupId
                ? 'Select a Group First'
                : `Join Group (₹${entryFee})`
              }
            </button>
          </div>
        )}

        {/* Groups Overview */}
        <div className="border-t border-[#BBF429]/30 pt-6">
          <h4 className="text-white font-medium mb-4">Groups Overview:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {groupsData.groups.map((group) => (
              <div 
                key={group.id}
                className={`p-3 rounded-lg border text-center text-sm transition-all duration-200 ${
                  group.is_full 
                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                } ${
                  groupsData.user_group?.group_id === group.id 
                    ? 'ring-2 ring-[#BBF429] bg-[#BBF429]/10 border-[#BBF429]/30' 
                    : ''
                }`}
              >
                <div className="font-medium text-white">Group {group.group_number}</div>
                <div className="text-xs mt-1 flex items-center justify-center gap-1">
                  <span>{group.current_members}/{group.max_members}</span>
                  {groupsData.user_group?.group_id === group.id && (
                    <span className="px-2 py-0.5 bg-[#BBF429] text-black rounded text-xs font-medium">
                      You
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotBasedTournamentJoin;
