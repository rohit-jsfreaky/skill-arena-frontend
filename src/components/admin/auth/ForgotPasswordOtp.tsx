import React from "react";

type ForgotPasswordOtpProps = {
  handleChange: (index: number, value: string) => void;
  handleKeyDown: (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  handleSubmit: () => void;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  otp: string[];
  loading: boolean;
  isOtpVerified: boolean;
};

const ForgotPasswordOtp = ({
  otp,
  inputRefs,
  handleChange,
  handleKeyDown,
  handleSubmit,
  loading,
  isOtpVerified,
}: ForgotPasswordOtpProps) => {
  const checkDisabled = () => {
    const otpNow = otp.join("");
    if (otpNow.length === 6) {
      return false;
    }

    return true;
  };
  return (
    <>
      <h2 className="block text-gray-700 font-medium mb-2">Enter OTP</h2>
      <div className="flex gap-2 justify-center mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-8 h-8 md:w-12 md:h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BBF429]"
          />
        ))}
      </div>
      {!isOtpVerified && (
        <button
          disabled={checkDisabled()}
          onClick={handleSubmit}
          className="rounded-2xl w-full text-black bg-[linear-gradient(90deg,#BBF429_70%,transparent_100%)] hover:bg-white transition duration-300 px-6 py-2.5 hover:cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify otp"}
        </button>
      )}
    </>
  );
};

export default ForgotPasswordOtp;
