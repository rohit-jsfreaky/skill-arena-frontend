import { SignInButton } from "@clerk/clerk-react";

const NotLoginCard = () => {
  return (
    <div className="bg-gradient-to-r flex justify-center items-center flex-col from-[#EAFFA9] to-[#BBF429] p-8 rounded-lg shadow-lg text-black w-96">
      <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
      <p className="mb-4">You need to log in to access the dashboard.</p>

      <div className="rounded-2xl text-black bg-[linear-gradient(90deg,#BBF429_70%,transparent_100%)] hover:bg-white transition duration-300 px-6 py-2.5">
        <SignInButton />
      </div>
    </div>
  );
};

export default NotLoginCard;
