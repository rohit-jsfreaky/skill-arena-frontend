import React from "react";

interface TournamentYoutubeLiveUrlProps {
  youtube_live_url: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TournamentYoutubeLiveUrl: React.FC<TournamentYoutubeLiveUrlProps> = ({
  youtube_live_url,
  handleChange,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="youtube_live_url"
        className="block text-sm font-medium text-white"
      >
        YouTube Live URL
        <span className="text-xs text-gray-400 ml-2">(Optional)</span>
      </label>
      <input
        type="url"
        id="youtube_live_url"
        name="youtube_live_url"
        value={youtube_live_url}
        onChange={handleChange}
        placeholder="https://youtube.com/live/..."
        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#BBF429]/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BBF429] focus:border-transparent"
      />
      <p className="text-xs text-gray-400">
        Add a YouTube live stream URL for participants to watch the tournament live
      </p>
    </div>
  );
};

export default TournamentYoutubeLiveUrl;
