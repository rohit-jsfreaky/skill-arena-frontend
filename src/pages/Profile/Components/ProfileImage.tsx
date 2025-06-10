import { UserResource } from "@clerk/types";

interface ProfileImageProps {
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  user: UserResource;
  imageUrl: string | null;
}

const ProfileImage = ({
  user,
  handleImageChange,
  imageUrl,
}: ProfileImageProps) => {
  return (
    <div className="relative group">
      {imageUrl ? (
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#BBF429]/30 hover:border-[#BBF429] transition-all duration-300">
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#BBF429]/20 to-black border-4 border-[#BBF429]/30 hover:border-[#BBF429] transition-all duration-300 flex items-center justify-center">
          <span className="text-[#BBF429] text-4xl md:text-5xl font-bold">
            {user?.fullName?.charAt(0) || "U"}
          </span>
        </div>
      )}
      
      <label
        htmlFor="profile-upload"
        className="absolute bottom-2 right-2 bg-black/80 rounded-full p-2 cursor-pointer hover:bg-[#BBF429]/20 transition-all duration-300 border border-[#BBF429]/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#BBF429"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </label>
      <input
        type="file"
        id="profile-upload"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileImage;
