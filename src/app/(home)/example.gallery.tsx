import { useState, type SVGProps } from "react";
import { AnimateChildren } from "../../../lib/AnimateChildren/src";
import { cn } from "lazy-cn";

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

  const srcIndex = ((current % list.length) + list.length) % list.length;
  const src = list[srcIndex].img;

  return (
    <div className="flex flex-col">
      <div className="w-full relative aspect-video overflow-hidden object-contain rounded-md border border-[var(--border-light)] group"
        data-direction={direction}
      >
        <AnimateChildren useAbsolutePositionOnDelete duration={1000}>
          <img
            key={src}
            src={src}
            alt={list[srcIndex].title + " image"}
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


export function LucideArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 19l-7-7l7-7m7 7H5"></path></svg>
  )
}

export function LucideArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7l7 7l-7 7"></path></svg>
  )
}

const list = [
  {
    title: "Orange",
    img: "https://www.heroui.com/images/fruit-1.jpeg",
    price: "$5.50",
  },
  {
    title: "Tangerine",
    img: "https://www.heroui.com/images/fruit-2.jpeg",
    price: "$3.00",
  },
  {
    title: "Raspberry",
    img: "https://www.heroui.com/images/fruit-3.jpeg",
    price: "$10.00",
  },
  {
    title: "Lemon",
    img: "https://www.heroui.com/images/fruit-4.jpeg",
    price: "$5.30",
  },
  {
    title: "Avocado",
    img: "https://www.heroui.com/images/fruit-5.jpeg",
    price: "$15.70",
  },
  {
    title: "Lemon 2",
    img: "https://www.heroui.com/images/fruit-6.jpeg",
    price: "$8.00",
  },
  {
    title: "Banana",
    img: "https://www.heroui.com/images/fruit-7.jpeg",
    price: "$7.50",
  },
  {
    title: "Watermelon",
    img: "https://www.heroui.com/images/fruit-8.jpeg",
    price: "$12.20",
  },
];