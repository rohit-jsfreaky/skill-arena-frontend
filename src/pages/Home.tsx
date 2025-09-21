import BannerSlider from "@/components/Home/BannerSlider";
import Footer from "@/components/Home/Footer";
import GamesCard from "@/components/Home/GamesCard";
import GamesCarousel from "@/components/Home/GamesCarousel";
import Hero from "@/components/Home/Hero";
import Working from "@/components/Home/Working";
import HomeTournamentNotifications from "@/components/Home/HomeTournamentNotifications";

const Home = () => {
  const GamesSliderImages = [
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FmodernWarfare.4ffc72db.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvalorant.49a8ef58.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdotA.a9250df1.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffortnite.c428b7a6.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FmodernWarfare.4ffc72db.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvalorant.49a8ef58.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdotA.a9250df1.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffortnite.c428b7a6.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FmodernWarfare.4ffc72db.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvalorant.49a8ef58.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdotA.a9250df1.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffortnite.c428b7a6.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FmodernWarfare.4ffc72db.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvalorant.49a8ef58.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdotA.a9250df1.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffortnite.c428b7a6.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FmodernWarfare.4ffc72db.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvalorant.49a8ef58.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FdotA.a9250df1.png&w=384&q=30",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffortnite.c428b7a6.png&w=384&q=30",
  ];

  const games = [
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffortnite.3e303bd8.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fvalorant.14c41295.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcs2.903e23bf.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpubg.650281fd.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FmodernWarfare.88df12ea.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FcallOfDuty.c3363329.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Feafc.1b12745c.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Feafc25.51f04def.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrocketLeague.2c70621b.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdota.6f77c490.png&w=256&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FfallGuys.98b8e2d3.png&w=256&q=50",
  ];

  const images = [
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F4.214a5f5a.png&w=3840&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F3.0248ec63.png&w=3840&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1.5d0ba067.png&w=3840&q=50",
    "https://www.duelmasters.io/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2.438195eb.png&w=3840&q=50",
  ];
  return (
    <div
      className="bg-gradient-to-r from-black via-black to-[#BBF429] text-white min-h-screen"
      style={{ minHeight: "calc(100vh - 108px)" }}
    >
      {/* Tournament Completion Notifications */}
      <HomeTournamentNotifications />
      
      <Hero />

      <div className="flex gap-5 justify-center py-20 cursor-pointer flex-wrap px-10 md:px-28">
        {games.map((game, index) => (
          <GamesCard url={game} key={index} />
        ))}
      </div>

      <div className="py-10 px-10 md:px-28">
        <BannerSlider images={images} />
      </div>

      <div className=" py-10 px-10 md:px-28">
        <Working />
      </div>

      <div className=" py-10 px-10 md:px-28">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-bold">
          GAMES
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300">
          Play in one click
        </p>
      </div>
      <GamesCarousel GamesSliderImages={GamesSliderImages} />

      <Footer />
    </div>
  );
};

export default Home;
