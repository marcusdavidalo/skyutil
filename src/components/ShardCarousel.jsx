import { DateTime } from "luxon";
import React, { Suspense, lazy } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ShardSchedules = lazy(() => import("./ShardSchedules"));

const ShardCarousel = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Carousel
        showArrows
        showStatus={false}
        showThumbs={false}
        showIndicators={false}
        swipeable={true}
        emulateTouch
        centerMode
        centerSlidePercentage={100}
        className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-lg shadow-md shadow-zinc-800/20 dark:shadow-zinc-200/10 p-4 md:p-6 lg:p-8"
      >
        {Array.from({ length: 30 }, (_, i) => {
          const currentDate = DateTime.local().plus({ days: i });
          const title =
            i === 0 ? "Today" : i === 1 ? "Tomorrow" : `in ${i} days`;
          return (
            <div key={i} className="flex justify-center">
              <ShardSchedules date={currentDate} title={title} />
            </div>
          );
        })}
      </Carousel>
    </Suspense>
  );
};

export default ShardCarousel;
