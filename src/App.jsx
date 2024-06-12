import React from "react";
import EventSchedules from "./components/EventSchedules";
import ShardEvents from "./components/ShardEvents";
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
            <header className="mb-8 flex justify-between items-center bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-md shadow-zinc-800/20 dark:shadow-zinc-200/10 px-4 md:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-shadow-sm">Sky Utils</h1>
              <ThemeToggle />
            </header>
            <main>
              <section className="flex flex-col lg:flex-row justify-evenly w-full gap-4 mb-8">
                <aside className="w-full lg:w-1/2" id="event-schedules">
                  <EventSchedules />
                </aside>
                <aside className="w-full lg:w-1/2" id="shard-events">
                  <ShardEvents />
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
