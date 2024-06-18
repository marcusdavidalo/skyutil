import { useRef, useState, useEffect } from "react";
import EventSchedules from "./components/EventSchedules";
import ShardCarousel from "./components/ShardCarousel";
import InteractiveMap from "./components/InteractiveMap";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import bg from "./assets/bg.png";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="text-white rounded-full text-2xl md:text-4xl p-2 transition-colors duration-300 ease-in-out"
      onClick={toggleTheme}
    >
      {theme === "light" ? "☀️" : "🌑"}
    </button>
  );
};

const App = () => {
  // America/Los_Angeles time zone for skyTime
  const [skyTime, setSkyTime] = useState(
    new Date().toLocaleTimeString("en-US", { timeZone: "America/Los_Angeles" })
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSkyTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
        })
      );
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const localTimeRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <img
        src={bg}
        alt="background"
        className="fixed object-cover h-full w-full -z-50"
      />
      <ThemeProvider>
        <div className="w-full bg-zinc-100/50 text-zinc-900 dark:bg-zinc-950/50  dark:text-zinc-200 min-h-screen ">
          <div className="container mx-auto p-4">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-md shadow-zinc-800/20 dark:shadow-zinc-200/10 px-4 md:px-6 lg:px-8 py-4">
              <div className="flex items-center mb-2 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-shadow-sm">
                  Sky Utils
                </h1>
                <h2
                  ref={localTimeRef}
                  className="text-lg md:text-2xl font-normal text-zinc-800 dark:text-zinc-200 ml-4 text-shadow-sm"
                >
                  Local Time: {currentTime}
                </h2>
                <h2
                  ref={localTimeRef}
                  className="text-lg md:text-2xl font-normal text-zinc-800 dark:text-zinc-200 ml-4 text-shadow-sm"
                >
                  Sky Time: {skyTime}
                </h2>
              </div>
              <ThemeToggle />
            </header>

            <main>
              <section className="flex flex-col lg:flex-row justify-evenly w-full gap-4 mb-8">
                <aside className="w-full lg:w-1/2" id="event-schedules">
                  <EventSchedules />
                </aside>
                <aside className="w-full lg:w-1/2" id="shard-events">
                  <ShardCarousel />
                </aside>
              </section>
              <section id="interactive-map" className="mb-8">
                <InteractiveMap />
              </section>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
