import WorkingCard from "./WorkingCard";

const Working = () => {
  return (
    <div>
      <h1 className="text-white  mb-5 text-3xl md:text-5xl font-bold">
        HOW SKILL ARENA WORKS
      </h1>

      <div className="flex flex-wrap gap-5 justify-evenly">
        <WorkingCard
          title="TOP UP YOUR ACCOUNT"
          description="USING ANY PAYMENT METHOD"
        />
        <WorkingCard
          title="PLAY"
          description="FIND A FIT RIVAL, PLAY & REPORT RESULTS"
        />
        <WorkingCard
          title="WIN A MATCH"
          description="AND DOUBLE YOU WAGER"
        />
        <WorkingCard
          title="WITHDRAW MONEY"
          description="GET PAID INSTANTLY"
        />
      </div>
    </div>
  );
};

export default Working;
