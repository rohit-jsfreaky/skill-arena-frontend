import WorkingCard from "./WorkingCard";

interface WorkingProps {
  workingImages: string[];
}

const Working = ({ workingImages }: WorkingProps) => {
  return (
    <div>
      <h1 className="text-white  mb-5 text-3xl md:text-5xl font-bold">
        HOW SKILL ARENA WORKS
      </h1>

      <div className="flex flex-wrap gap-5 justify-evenly">
        <WorkingCard
          image={workingImages[0]}
          title="TOP UP YOUR ACCOUNT"
          description="USING ANY PAYMENT METHOD"
        />
        <WorkingCard
          image={workingImages[1]}
          title="PLAY"
          description="FIND A FIT RIVAL, PLAY & REPORT RESULTS"
        />
        <WorkingCard
          image={workingImages[2]}
          title="WIN A MATCH"
          description="AND DOUBLE YOU WAGER"
        />
        <WorkingCard
          image={workingImages[3]}
          title="WITHDRAW MONEY"
          description="GET PAID INSTANTLY"
        />
      </div>
    </div>
  );
};

export default Working;
