import { Check, Pencil, X } from "lucide-react";

type AdminMarginProps = {
  isEditingMargin: boolean;
  tempMargin: number;
  setTempMargin: (value: number) => void;
  handleUpdateMargin: () => void;
  handleCancelEdit: () => void;
  tournamentMargin: number;
  handleEditMargin: () => void;
};

const AdminMargin = ({
  isEditingMargin,
  tempMargin,
  setTempMargin,
  handleUpdateMargin,
  handleCancelEdit,
  tournamentMargin,
  handleEditMargin,
}: AdminMarginProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Handle empty input
    if (value === "") {
      setTempMargin(0);
      return;
    }
    
    // Only update if input is a valid number
    const parsed = parseInt(value);
    if (!isNaN(parsed)) {
      setTempMargin(parsed);
    }
  };

  return (
    <div className="flex items-center">
      <p className="text-white mr-2">TDM Margin: </p>
      {isEditingMargin ? (
        <div className="flex items-center bg-black/40 border border-[#BBF429]/40 rounded-lg p-1">
          <input
            type="text"
            value={tempMargin === 0 && document.activeElement === document.getElementById("margin-input") ? "" : tempMargin}
            onChange={handleInputChange}
            id="margin-input"
            className="bg-black/60 text-white border-none outline-none rounded px-2 py-1 w-16 mr-1"
          />
          <button
            onClick={handleUpdateMargin}
            className="p-1 rounded hover:bg-[#BBF429]/10 text-green-400 hover:text-green-300"
            title="Update"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancelEdit}
            className="p-1 rounded hover:bg-[#BBF429]/10 text-red-400 hover:text-red-300"
            title="Cancel"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center bg-black/40 hover:bg-black/60 border border-[#BBF429]/40 rounded-lg px-3 py-1 transition-all duration-300">
          <span className="text-[#BBF429] font-medium">
            {tournamentMargin}%
          </span>
          <button
            onClick={handleEditMargin}
            className="ml-2 text-white hover:text-[#BBF429] transition-colors"
            title="Edit margin"
          >
            <Pencil size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMargin;