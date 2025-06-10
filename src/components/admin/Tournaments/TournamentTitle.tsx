type TournamentTileProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  title: string;
};

const TournamentTitle = ({ handleChange, title }: TournamentTileProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white mb-2">
        Tournament Title<span className="text-[#BBF429] ml-1">*</span>
      </label>
      <input
        placeholder="Enter Tournament Title"
        type="text"
        name="title"
        value={title}
        onChange={handleChange}
        required
        className="w-full px-4 py-2.5 bg-black/50 border border-[#BBF429]/30 rounded-lg 
                   text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-[#BBF429]/50 focus:border-transparent transition-all duration-200"
      />
    </div>
  );
};

export default TournamentTitle;
