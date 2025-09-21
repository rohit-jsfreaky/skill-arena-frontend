import BannerSlider from "@/components/Home/BannerSlider";
import Footer from "@/components/Home/Footer";
import GamesCard from "@/components/Home/GamesCard";
import GamesCarousel from "@/components/Home/GamesCarousel";
import Hero from "@/components/Home/Hero";
import Working from "@/components/Home/Working";
import HomeTournamentNotifications from "@/components/Home/HomeTournamentNotifications";
import { 
  banner_1, 
  banner_2, 
  banner_3, 
  banner_4,
  bgmi,
  coc,
  cod,
  ff,
  valo,
  play,
  top_up,
  win_a_match,
   withdraw_money
} from "@/constants/images";

const Home = () => {
  // GamesSliderImages - using local game images repeated for carousel effect
  const GamesSliderImages = [
    bgmi,
    valo,
    cod,
    ff,
    coc,
    bgmi,
    valo,
    cod,
    ff,
    coc,
    bgmi,
    valo,
    cod,
    ff,
    coc,
    bgmi,
    valo,
    cod,
    ff,
    coc,
  ];

  // GamesCard images - using local images from images.ts
  const games = [
    bgmi,
    coc,
    cod,
    ff,
    valo,
  ];

  // BannerSlider images - using local banner images from images.ts
  const images = [
    banner_1,
    banner_2,
    banner_3,
    banner_4,
  ];

  const workingImages = [
    play,
    top_up,
    win_a_match,
    withdraw_money
  ];
  return (
    <div
      className="bg-black text-white min-h-screen"
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
        <Working workingImages={workingImages}/>
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
