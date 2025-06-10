import { TailSpin } from "react-loader-spinner";

interface LoadingSpinnerProps {
  color: string;
  size: number;
}
export const LoadingSpinner = ({ color, size }: LoadingSpinnerProps) => {
  return (
    <TailSpin
      height={size}
      width={size}
      color={color}
      ariaLabel="loading-spinner"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};
