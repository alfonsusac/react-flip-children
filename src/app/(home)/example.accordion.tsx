import { useState, type SVGProps } from "react";
import { AnimateChildren } from "../../../lib/AnimateChildren/src";
import { cn } from "lazy-cn";
import { LucidePlus } from "./assets";

export function AccordionExample() {

  return (
    <>
      <Accordion
        label="How do I reset my password?"
        content='Go to the login page, click "Forgot password," and follow the instructions.'
      />
      <Accordion
        label="Can I enable two-factor authentication?"
        content='Yes, you can enable 2FA in your account settings for added security.'
      />
      <Accordion
        label="Does it support offline mode?"
        content='Yes, you can access your saved data even without an internet connection.'
      />
      <div className="border-t" />
    </>
  )
}

function Accordion(
  props: {
    label: string,
    content: string,
  }
) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t overflow-hidden text-sm flex flex-col text-[var(--text-light-2)]">
      <button
        aria-label="accordion"
        className="p-3 w-full text-start flex items-center gap-2 font-semibold"
        onClick={() => setOpen(!open)}>
        <div className="grow">
          {props.label}
        </div>
        <LucidePlus className={cn(
          "transition",
          open && "rotate-45",
        )} />
      </button>
      <div className="relative">
        <AnimateChildren
          useAbsolutePositionOnDelete
          disableScaleAnimation
          duration={200}
          easing="ease-out"
        >
          {open && <div
            key="content"
            className="p-3 pt-0"
          >
            {props.content}
          </div>}
          <div /> {/*AnimateChildren requires at least one element for parent animation to work properly*/}
        </AnimateChildren>
      </div>
    </div>
  )
}
