import React from "react";
import EventSchedules from "./components/EventSchedules";
import ShardEvents from "./components/ShardEvents";
import InteractiveMap from "./components/InteractiveMap";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <div className="w-full bg-gray-100 text-gray-900 dark:bg-gray-950/90 dark:text-gray-200">
        <div className="container mx-auto p-4">
          <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Sky: Children of the Light Utils
            </h1>
            <ThemeToggle />
          </header>
          <main>
            <section className="flex justify-evenly w-full">
              <aside className="w-full" id="event-schedules">
                <EventSchedules />
              </aside>
              <aside class="w-full" id="shard-events">
                <ShardEvents />
              </aside>
            </section>
            <section id="interactive-map">
              <InteractiveMap />
            </section>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={toggleTheme}
    >
      {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    </button>
  );
};

export default App;
