import React from "react";

const InteractiveMap = () => {
  return (
    <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-md shadow-zinc-800/20 dark:shadow-zinc-200/10 p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Interactive Map (WIP)
      </h2>
      <div className="h-96 md:h-[500px] bg-white/50 dark:bg-zinc-800/50 flex items-center justify-center">
        <img
          src="https://placehold.co/600x400"
          alt="Interactive Map Placeholder"
          className="max-h-full max-w-full"
        />
      </div>
    </div>
  );
};

export default InteractiveMap;
