import { ReorderArray } from "@/app/ui/Reorder"
import { useRef, useState, type SVGProps } from "react"
import { Button } from "../homeui/button"
import { AnimateChild } from "@/app/ui/Reorder2"
import { AnimateChildren } from "../../../../lib/AnimateChildren/src"
import { cn } from "lazy-cn"

export const notificationsExample = {
  code: `<div className="flex flex-col">
  <ReorderArray>
    {arr.map(item => 
      <Notification key={item}
        data={item}
        className="animate-appear"
        style={{ zIndex: item }} />)}
  </ReorderArray>
</div>`,
  render: <TodoExample />,
} as const

function TodoExample() {
  const idCountRef = useRef(0)  // This is a reference to keep track of the next id
  const [arr, setArr] = useState(Array.from({ length: 4 }, (_, i) => idCountRef.current++))

  const shuffle = () => setArr(arr.toSorted(() => Math.random() - 0.5))
  const sort = () => setArr(arr.toSorted((a, b) => a - b))
  const add = () => setArr([...arr, idCountRef.current++])
  const remove = (item: number) => setArr(arr.filter(i => i !== item))

  return (
    <>
      <div className="h-10" />
      <div className="flex gap-2 justify-stretch">
        <button onClick={shuffle} className="grow p-2 px-4 bg-[#45adc7] text-white rounded-md transition-all active:scale-110 font-bold">Reorder</button>
        <button onClick={sort} className="grow p-2 px-4 bg-[#45adc7] text-white rounded-md transition-all active:scale-110 font-bold">Sort</button>
      </div>

      <div className="h-10" />
      <div className="flex flex-col gap-2 transition-all">
        <AnimateChildren>
          {arr.map(item => (
            <div key={item} className={cn(
              "flex gap-4 bg-[#F7E5C699] p-4 rounded-2xl",
              "transition-all duration-500",
              "data-[adding]:opacity-0",
              "data-[deleting]:opacity-0",
            )}>
              <div className="w-10 h-10 bg-full rounded-2xl bg-black flex items-center justify-center"
                style={{ backgroundColor: colors2[item % colors2.length] }}
              >
                {notifications[item % notifications.length].icon({ className: "w-6 h-6 text-white" })}
              </div>
              <div className="flex flex-col leading-none gap-1  font-bold grow">
                <div className="text-[#846b3f]">{notifications[item % notifications.length].title}</div>
                <div className="text-[#624c2588]">{notifications[item % notifications.length].description}</div>
              </div>
              {/* <div className="flex-grow">{item}</div> */}
              <button onClick={() => remove(item)} className="-m-2 shrink-0 p-1 hover:bg-black/10 text-white rounded-full transition-all active:scale-110 font-bold self-start">
                <MaterialSymbolsAddRounded className="rotate-45 w-6 h-6 text-[#624c2588]" />
              </button>
            </div>
          ))}
          <Button key={"add"} onClick={add} className="p-2 px-4 bg-[#4caf50] text-white rounded-md transition-all active:scale-110 font-bold">Add</Button>
        </AnimateChildren>
      </div>
    </>
  )
}

const notifications = [
  { title: "New message", description: "You have a new message from John Doe", icon: SolarChatRoundLineBoldDuotone },
  { title: "New photo", description: "You have a new photo from John Doe", icon: SolarGalleryMinimalisticBoldDuotone },
  { title: "Missed call", description: "You have a missed call from John Doe", icon: SolarPhoneBoldDuotone },
  { title: "New event", description: "You have a new event from John Doe", icon: SolarCalendarBoldDuotone },
  { title: "New file", description: "You have a new file from John Doe", icon: SolarFolderWithFilesBoldDuotone },
  { title: "New contact", description: "You have a new contact from John Doe", icon: SolarSettingsBoldDuotone },
  { title: "New message", description: "You have a new message from John Doe", icon: SolarChatRoundLineBoldDuotone },
  { title: "New photo", description: "You have a new photo from John Doe", icon: SolarGalleryMinimalisticBoldDuotone },
  { title: "Missed call", description: "You have a missed call from John Doe", icon: SolarPhoneBoldDuotone },
  { title: "New event", description: "You have a new event from John Doe", icon: SolarCalendarBoldDuotone },
  { title: "New file", description: "You have a new file from John Doe", icon: SolarFolderWithFilesBoldDuotone },
  { title: "New contact", description: "You have a new contact from John Doe", icon: SolarSettingsBoldDuotone },
  { title: "New message", description: "You have a new message from John Doe", icon: SolarChatRoundLineBoldDuotone },
  { title: "New photo", description: "You have a new photo from John Doe", icon: SolarGalleryMinimalisticBoldDuotone },
  { title: "Missed call", description: "You have a missed call from John Doe", icon: SolarPhoneBoldDuotone },
  { title: "New event", description: "You have a new event from John Doe", icon: SolarCalendarBoldDuotone },
  { title: "New file", description: "You have a new file from John Doe", icon: SolarFolderWithFilesBoldDuotone },
  { title: "New contact", description: "You have a new contact from John Doe", icon: SolarSettingsBoldDuotone },
  { title: "New message", description: "You have a new message from John Doe", icon: SolarChatRoundLineBoldDuotone },
  { title: "New photo", description: "You have a new photo from John Doe", icon: SolarGalleryMinimalisticBoldDuotone },
  { title: "Missed call", description: "You have a missed call from John Doe", icon: SolarPhoneBoldDuotone },

]

const apps = [
  { name: "Gallery", icon: SolarGalleryMinimalisticBoldDuotone },
  { name: "Settings", icon: SolarSettingsBoldDuotone },
  { name: "Files", icon: SolarFolderWithFilesBoldDuotone },
  { name: "Chat", icon: SolarChatRoundLineBoldDuotone },
  { name: "Camera", icon: SolarCameraBoldDuotone },
  { name: "Phone", icon: SolarPhoneBoldDuotone },
  { name: "Calculator", icon: SolarCalculatorBoldDuotone },
  { name: "Calendar", icon: SolarCalendarBoldDuotone },
]


const colors2 = [
  '#F59597',
  '#B2B4DA',
  '#6dbf9c',
  '#a2d28d',
  '#c19ec8',
  '#FBB39A',
  '#a7bcd2',
]


export function MaterialSymbolsAddRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"></path></svg>
  )
}
export function SolarCalendarBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M6.94 2c.416 0 .753.324.753.724v1.46c.668-.012 1.417-.012 2.26-.012h4.015c.842 0 1.591 0 2.259.013v-1.46c0-.4.337-.725.753-.725s.753.324.753.724V4.25c1.445.111 2.394.384 3.09 1.055c.698.67.982 1.582 1.097 2.972L22 9H2v-.724c.116-1.39.4-2.302 1.097-2.972s1.645-.944 3.09-1.055V2.724c0-.4.337-.724.753-.724"></path><path fill="currentColor" d="M22 14v-2c0-.839-.004-2.335-.017-3H2.01c-.013.665-.01 2.161-.01 3v2c0 3.771 0 5.657 1.172 6.828S6.228 22 10 22h4c3.77 0 5.656 0 6.828-1.172S22 17.772 22 14" opacity=".5"></path><path fill="currentColor" d="M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0"></path></svg>
  )
}
export function SolarCalculatorBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22c-4.243 0-6.364 0-7.682-1.465C3 19.072 3 16.714 3 12s0-7.071 1.318-8.536S7.758 2 12 2s6.364 0 7.682 1.464C21 4.93 21 7.286 21 12s0 7.071-1.318 8.535S16.242 22 12 22" opacity=".5"></path><path fill="currentColor" d="M15 6H9c-.465 0-.697 0-.888.051a1.5 1.5 0 0 0-1.06 1.06C7 7.304 7 7.536 7 8s0 .697.051.888a1.5 1.5 0 0 0 1.06 1.06C8.304 10 8.536 10 9 10h6c.465 0 .697 0 .888-.051a1.5 1.5 0 0 0 1.06-1.06C17 8.696 17 8.464 17 8s0-.697-.051-.888a1.5 1.5 0 0 0-1.06-1.06C15.697 6 15.464 6 15 6m-7 8a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m4-4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m4-4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2"></path></svg>
  )
}
export function SolarPhoneBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="m16.1 13.359l.456-.453c.63-.626 1.611-.755 2.417-.317l1.91 1.039c1.227.667 1.498 2.302.539 3.255l-1.42 1.412c-.362.36-.81.622-1.326.67c-1.192.111-3.645.051-6.539-1.643zm-5.91-5.876l.287-.286c.707-.702.774-1.83.157-2.654L9.374 2.86C8.61 1.84 7.135 1.705 6.26 2.575l-1.57 1.56c-.433.432-.723.99-.688 1.61c.065 1.14.453 3.22 2.149 5.776z" clipRule="evenodd"></path><path fill="currentColor" d="M12.063 11.497c-2.946-2.929-1.88-4.008-1.873-4.015l-4.039 4.04c.667 1.004 1.535 2.081 2.664 3.204c1.14 1.134 2.26 1.975 3.322 2.596L16.1 13.36s-1.082 1.076-4.037-1.862" opacity=".6"></path></svg>
  )
}
export function SolarCameraBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9.778 21h4.444c3.121 0 4.682 0 5.803-.735a4.4 4.4 0 0 0 1.226-1.204c.749-1.1.749-2.633.749-5.697s0-4.597-.749-5.697a4.4 4.4 0 0 0-1.226-1.204c-.72-.473-1.622-.642-3.003-.702c-.659 0-1.226-.49-1.355-1.125A2.064 2.064 0 0 0 13.634 3h-3.268c-.988 0-1.839.685-2.033 1.636c-.129.635-.696 1.125-1.355 1.125c-1.38.06-2.282.23-3.003.702A4.4 4.4 0 0 0 2.75 7.667C2 8.767 2 10.299 2 13.364s0 4.596.749 5.697c.324.476.74.885 1.226 1.204C5.096 21 6.657 21 9.778 21" opacity=".5"></path><path fill="currentColor" d="M17.556 9.272a.826.826 0 0 0-.833.819c0 .452.373.818.833.818h1.111c.46 0 .834-.367.834-.818a.826.826 0 0 0-.834-.819z"></path><path fill="currentColor" fillRule="evenodd" d="M12 9.272c-2.3 0-4.166 1.832-4.166 4.091s1.865 4.091 4.167 4.091c2.3 0 4.166-1.831 4.166-4.09s-1.865-4.092-4.166-4.092m0 1.637c-1.38 0-2.5 1.099-2.5 2.454s1.12 2.455 2.5 2.455c1.381 0 2.5-1.099 2.5-2.455c0-1.355-1.119-2.454-2.5-2.454" clipRule="evenodd"></path></svg>
  )
}
export function SolarGalleryMinimalisticBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12s0-7.071-1.465-8.536C19.072 2 16.714 2 12 2S4.929 2 3.464 3.464" clipRule="evenodd" opacity=".5"></path><path fill="currentColor" d="M8.504 13.177a1.55 1.55 0 0 0-2.183-.073l-.81.753a.75.75 0 0 1-1.021-1.1l.81-.752a3.05 3.05 0 0 1 4.296.143l2.647 2.81a.795.795 0 0 0 1.054.092a3.07 3.07 0 0 1 3.953.241l2.268 2.167a.75.75 0 0 1-1.036 1.084l-2.268-2.166a1.57 1.57 0 0 0-2.02-.123a2.295 2.295 0 0 1-3.043-.266zM18 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0"></path></svg>
  )
}
export function SolarSettingsBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2 2 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.62 1.62 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.03 2.03 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361s-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a2 2 0 0 0-.399 1.479c.053.394.287.798.757 1.605s.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2 2 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a2 2 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361s.306-1.064.782-1.36c.324-.203.533-.364.682-.556a2 2 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605s-.704-1.21-1.022-1.453a2.03 2.03 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.62 1.62 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2 2 0 0 0-1.09-1.083" clipRule="evenodd" opacity=".5"></path><path fill="currentColor" d="M15.523 12c0 1.657-1.354 3-3.023 3s-3.023-1.343-3.023-3S10.83 9 12.5 9s3.023 1.343 3.023 3"></path></svg>
  )
}
export function SolarFolderWithFilesBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M2 6.95c0-.883 0-1.324.07-1.692A4 4 0 0 1 5.257 2.07C5.626 2 6.068 2 6.95 2c.386 0 .58 0 .766.017a4 4 0 0 1 2.18.904c.144.119.28.255.554.529L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .848.352C14.098 6 14.675 6 15.828 6h.374c2.632 0 3.949 0 4.804.77q.119.105.224.224c.77.855.77 2.172.77 4.804V14c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z" opacity=".5"></path><path fill="currentColor" d="M20 6.238c0-.298-.005-.475-.025-.63a3 3 0 0 0-2.583-2.582C17.197 3 16.965 3 16.5 3H9.988c.116.104.247.234.462.45L11 4c.816.816 1.224 1.224 1.712 1.495a4 4 0 0 0 .849.352C14.098 6 14.675 6 15.829 6h.373c1.78 0 2.957 0 3.798.238"></path><path fill="currentColor" fillRule="evenodd" d="M12.25 10a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75" clipRule="evenodd"></path></svg>
  )
}

export function SolarChatRoundLineBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.6.376 3.112 1.043 4.453c.178.356.237.763.134 1.148l-.595 2.226a1.3 1.3 0 0 0 1.591 1.592l2.226-.596a1.63 1.63 0 0 1 1.149.133A9.96 9.96 0 0 0 12 22" opacity=".5"></path><path fill="currentColor" d="M7.825 12.85a.825.825 0 0 0 0 1.65h6.05a.825.825 0 0 0 0-1.65zm0-3.85a.825.825 0 0 0 0 1.65h8.8a.825.825 0 0 0 0-1.65z"></path></svg>
  )
}
