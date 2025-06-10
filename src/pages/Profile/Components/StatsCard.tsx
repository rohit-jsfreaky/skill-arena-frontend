interface StatsCardProps {
  title: string;
}

const StatsCard = ({ title }: StatsCardProps) => {
  return (
    <div className="bg-gradient-to-r border-2 border-[#BBF429] hover:scale-110 transition-transform duration-300 ease-in-out flex flex-col justify-center items-center font-bold text-white p-4 rounded-lg shadow-lgw-64 h-40 sm:w-72 sm:h-44 md:w-80 md:h-48 lg:w-96 lg:h-52">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center break-words w-full">
        {title}
      </h2>
      <div className="rounded-2xl text-black bg-[linear-gradient(90deg,#BBF429_70%,transparent_100%)] hover:bg-white transition duration-300 px-4 sm:px-6 py-2 w-full text-center">
        score
      </div>
    </div>
  );
};

export default StatsCard;