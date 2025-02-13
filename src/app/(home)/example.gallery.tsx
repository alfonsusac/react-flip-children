import { useState } from "react";
import { AnimateChildren } from "../../../lib/AnimateChildren/src";
import { cn } from "lazy-cn";
import { LucideArrowLeft, LucideArrowRight } from "./assets";

const fruitList = [
  "https://www.heroui.com/images/fruit-1.jpeg",
  "https://www.heroui.com/images/fruit-2.jpeg",
  "https://www.heroui.com/images/fruit-3.jpeg",
  "https://www.heroui.com/images/fruit-4.jpeg",
  "https://www.heroui.com/images/fruit-5.jpeg",
  "https://www.heroui.com/images/fruit-6.jpeg",
  "https://www.heroui.com/images/fruit-7.jpeg",
  "https://www.heroui.com/images/fruit-8.jpeg",
];

export function GalleryExample() {

  const [current, setCurrent] = useState(0);

  const [direction, setDirection] = useState<"left" | "right">("right");

  const goLeft = () => {
    setDirection("left");
    setCurrent((prev) => prev - 1);
  }
  const goRight = () => {
    setDirection("right");
    setCurrent((prev) => prev + 1);
  }

  const srcIndex = ((current % fruitList.length) + fruitList.length) % fruitList.length;
  const src = fruitList[srcIndex];

  return (
    <div className="flex flex-col">
      <div className="w-full relative aspect-video overflow-hidden object-contain rounded-md border border-[var(--border-light)] group"
        data-direction={direction}
      >
        <AnimateChildren useAbsolutePositionOnDelete duration={1000}>
          <img
            key={src}
            src={src}
            alt={srcIndex + "image"}
            className={cn(
              "absolute inset-0 object-cover w-full h-full",
              "transition-all",
              "z-10",
              "group-data-[direction=left]:data-[adding]:translate-x-full",
              "group-data-[direction=left]:data-[adding]:-translate-x-full",

              "group-data-[direction=left]:data-[deleting]:-translate-x-full",
              "group-data-[direction=left]:data-[deleting]:translate-x-full",

              "group-data-[direction=right]:data-[adding]:-translate-x-full",
              "group-data-[direction=right]:data-[adding]:translate-x-full",

              "group-data-[direction=right]:data-[deleting]:translate-x-full",
              "group-data-[direction=right]:data-[deleting]:-translate-x-full",
            )}
          />
        </AnimateChildren>
      </div>
      <div className="flex gap-1 justify-center pt-2 text-lg text-[var(--text-light-3)]">
        <button
          onClick={goLeft}
          className="p-2 rounded-full hover:bg-[var(--bg-light-3)] hover:text-[var(--text-light-2)]">
          <LucideArrowLeft />
        </button>
        <button
          onClick={goRight}
          className="p-2 rounded-full hover:bg-[var(--bg-light-3)] hover:text-[var(--text-light-2)]">
          <LucideArrowRight />
        </button>
      </div>
    </div>
  )
}

