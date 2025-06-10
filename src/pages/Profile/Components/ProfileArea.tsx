interface ProfileAreaProps {
  title: string;
}

const ProfileArea = ({ title }: ProfileAreaProps) => {
  return (
    <div className="p-4 border-b border-[#BBF429]/20 bg-black/40 backdrop-blur-sm">
      <div className="flex items-center">
        <h3 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-[#BBF429] to-white bg-clip-text text-transparent">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default ProfileArea;
