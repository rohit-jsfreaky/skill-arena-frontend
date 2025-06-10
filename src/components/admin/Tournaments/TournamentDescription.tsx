type TournamentDescriptionProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  description: string;
};

const TournamentDescription = ({
  description,
  handleChange,
}: TournamentDescriptionProps) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-white mb-1">
        Description*
      </label>
      <textarea
      placeholder="Enter Tournament Description"
        name="description"
        value={description}
        onChange={handleChange}
        required
        rows={4}
        className="w-full px-3 py-2 border text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TournamentDescription;
