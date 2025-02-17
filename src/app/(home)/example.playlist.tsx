import { useArrayDemo } from "../(updates)/shared";
import { AnimateChildren } from "../../../lib/AnimateChildren/src";
import { LucideArrowDown, LucideArrowUp, LucideTrash, RadixIconsPlus, RadixIconsShuffle } from "./assets";

export function PlaylistExample() {
  const demo = useArrayDemo(5)

  return (
    <div className="flex flex-col text-xs text-[var(--text-light-3)]">
      <div className="flex gap-2">
        <button
          onClick={demo.shuffle}
          className="h-8 mb-2 text-sm px-4 rounded-full bg-[var(--bg-light-2)] border border-[var(--border-light))] flex gap-2 items-center tracking-tight text-[var(--text-light)] hover:bg-[var(--bg-light-3)]">
          <RadixIconsShuffle />
          shuffle
        </button>
        <button
          onClick={() => demo.arr.length < 5 && demo.add()}
          className="h-8 mb-2 text-sm px-4 rounded-full bg-[var(--bg-light-2)] border border-[var(--border-light))] flex gap-2 items-center tracking-tight text-[var(--text-light)] hover:bg-[var(--bg-light-3)]">
          <RadixIconsPlus />
          add
        </button>
      </div>

      <div>
        <AnimateChildren
          useAbsolutePositionOnDelete
        >
          {
            demo.arr.map((item) => {
              return (
                <div
                  key={item}
                  className="data-[deleting]:opacity-0 transition-all border-t h-14 box-content flex gap-1 bg-[var(--bg-light)] group hover:bg-[var(--bg-light-2)] cursor-pointer relative"
                  style={{ zIndex: item }}
                >
                  <div className="p-2">
                    <img
                      src={songs[item % songs.length].cover}
                      className="bg-zinc-200 h-full aspect-square rounded-md" />
                  </div>
                  <div className="py-2 flex flex-col justify-center gap-1 leading-none grow">
                    <div className="text-[var(--text-light)]">
                      {songs[item % songs.length].title}
                    </div>
                    <div>
                      {songs[item % songs.length].artist}
                    </div>
                  </div>
                  <div className="gap-2 justify-end items-center hidden group-hover:flex mr-2">
                    <button
                      onClick={() => demo.moveUp(item)}
                      className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                      <LucideArrowUp />
                    </button>
                    <button
                      onClick={() => demo.moveDown(item)}
                      className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                      <LucideArrowDown />
                    </button>
                    <button
                      onClick={() => demo.remove(item)}
                      className="p-2 text-[var(--text-light-3)] hover:text-[var(--text-light-2)] hover:bg-[var(--bg-light-3)] rounded-full transition-all duration-100">
                      <LucideTrash />
                    </button>
                  </div>
                  <div className="flex self-center mr-2 group-hover:hidden">
                    {songs[item % songs.length].length}
                  </div>
                </div>
              )
            })
          }
          <hr />
        </AnimateChildren>
      </div>

    </div>
  )
}

const songs = [
  {
    title: "Be a Flower",
    artist: "Ryokuoushoku Shakai",
    length: "3:20",
    cover: "https://lh3.googleusercontent.com/NXXSkZbIeHfz7VaEqux9fE9oJY4jhnBeMFiqumSibPZvOBUF4ItL8D7kaCEqHP--BmXPriGQOT458PgS=w544-h544-l90-rj"
  },
  {
    title: "Darken",
    artist: "ZUTOMAYO",
    length: "4:10",
    cover: "https://images.genius.com/5199cd3c5afcad6a6f59a7e2bef3cb6f.1000x1000x1.jpg"
  },
  {
    title: "Anytime Anywhere",
    artist: "Milet",
    length: "3:51",
    cover: "https://images.genius.com/3d679a5ddd3323b23bd26e684ebdc88c.1000x1000x1.png"
  },
  {
    title: "Ienai",
    artist: "Ryokuoushoku Shakai",
    length: "4:37",
    cover: "https://images.genius.com/5493e12a1b5ab3d020ac4b497fcc815d.1000x1000x1.png"
  },
  {
    title: "Deep Indigo",
    artist: "Yorushika",
    length: "4:10",
    cover: "https://images.genius.com/82821bb91549f41e919477b16fadab34.1000x1000x1.jpg"
  }
]



