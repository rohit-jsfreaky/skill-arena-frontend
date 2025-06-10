import { Button } from "../ui/button"

const Hero = () => {
  return (
    <div className="p-4 flex flex-col items-center justify-center">
    <div className="text-6xl md:text-9xl font-bold text-center">
      <p>
        MAKE <span className="text-[#BBF429]">YOUR</span>
      </p>
    </div>

    <div className="text-6xl md:text-9xl font-bold text-center">
      <p>
        FUTURE{" "}
        <span className="text-transparent stroke-white [-webkit-text-stroke:1px_white]">
          NOW
        </span>
      </p>
    </div>

    <div className="flex flex-col md:flex-row mt-10 items-center gap-5 text-center md:text-left">
      <div className="text-xl md:text-2xl font-bold">
        <p>PLAY TOURNAMENTS AND</p>
        <p>WIN EXCITING PRIZES</p>
      </div>
      <div>
        <Button className="text-white bg-[linear-gradient(90deg,#BBF429_20%,transparent_100%)] hover:bg-white transition duration-300">
          LET'S GO
        </Button>
      </div>
    </div>

    <div className="text-4xl md:text-6xl font-bold mt-20 text-center">
      <p>LET'S PLAY TOGETHER</p>
    </div>
  </div>
  )
}

export default Hero
