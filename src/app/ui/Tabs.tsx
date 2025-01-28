import { cn } from "lazy-cn";
import { useState, type ComponentProps } from "react";

export function useTabs<const T extends [(string | number), ...(string | number)[]]>(...items: T) {

  const [tab, setTab] = useState<T[number]>(items[0])
  const gotoTab = (tab: T[number]) => () => setTab(tab)
  const isTab = (tab2: T[number]) => tab === tab2
  
  return {
    tab,
    gotoTab,
    isTab,
  }

}


export function Tab(
  { className, children, ...props }: ComponentProps<"button">
) {
  return <button {...props} className={cn(
    "my-1",
    // `bg-zinc-800`,
    `text-sm`,
    `transition-all duration-100`,

    `grow`,
    `flex flex-col items-center gap-1`,

    "font-medium",
    "text-[hsl(215.4_16.3%_46.9%)]",
    "data-[selected]:text-[hsl(222.2_47.4%_11.2%)]",

    `group`,
    className
  )}>
    {children}
    <div className={cn(
      "w-full h-[0.2rem] rounded-full",

      "transition-all",
      "bg-[hsl(205_16%_47%_/_0.3)]",
      "group-data-[selected]:bg-[hsl(222.2_47.4%_11.2%)]",
    )} />
  </button>
}