import { useState, type ChangeEvent, type ComponentProps } from "react";
import { AnimateChildren } from "../../../lib/AnimateChildren/src";
import { cn } from "lazy-cn";

export function MultiStepExample() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  // To determine which direction the animation should go from and to
  const [direction, setDirection] = useState<"left" | "right" | undefined>();

  const handleNext = () => {
    if (step >= steps.length - 1) return
    setStep((prev) => prev + 1);
    setDirection("right");
  };
  const handleRestart = () => {
    if (step <= 0) return
    setStep(0);
    setDirection("left");
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [steps[step].input]: e.target.value,
    }));
  };


  return (
    <div
      className="text-sm border rounded-lg group overflow-hidden relative "
      data-direction={direction}
    >
      <div className="flex gap-2 *:grow *:h-1 m-4 *:rounded-md">
        {
          steps.map((_, i) => {
            return (
              <div
                key={i}
                className="w-1 h-1 bg-[var(--bg-light-3)] data-[active]:bg-[var(--text-light-4)] rounded-full transition-all"
                data-active={step === i ? "" : undefined}
              />
            )
          })
        }
      </div>

      <div>
        <AnimateChildren
          useAbsolutePositionOnDelete
          disableScaleAnimation
        >
          <div
            key={step}
            className={cn(
              "p-4",

              "transform-gpu",

              "transition-all",

              "group-data-[direction=left]:data-[adding]:translate-x-full",
              "group-data-[direction=left]:data-[adding]:-translate-x-full",

              "group-data-[direction=left]:data-[deleting]:-translate-x-full",
              "group-data-[direction=left]:data-[deleting]:translate-x-full",

              "group-data-[direction=right]:data-[adding]:-translate-x-full",
              "group-data-[direction=right]:data-[adding]:translate-x-full",

              "group-data-[direction=right]:data-[deleting]:translate-x-full",
              "group-data-[direction=right]:data-[deleting]:-translate-x-full",
            )}
          >
            <h1 className="text-xs font-semibold leading-none">
              {steps[step].title}</h1>
            <p className="font-semibold">
              {steps[step].description}</p>
            <input
              type="text"
              autoComplete="off"
              autoCorrect="off"
              aria-autocomplete="none" 
              value={formData[steps[step].input]}
              onChange={handleChange}
              className={cn(
                "border p-1.5 px-3 rounded-md min-w-0 w-full"
              )}
            />
            <p className="text-xs">
              {steps[step].helperText}
            </p>
            <div className="flex gap-1 justify-end">
              <Button onClick={handleRestart}>Restart</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        </AnimateChildren>
      </div>
    </div>
  );
}


function Button(
  props: ComponentProps<"button">
) {
  return (
    <button {...props} className={cn("border border-[var(--border-light)] bg-[var(--bg-light-2)] p-2 px-4 rounded-md", props.className)} />
  )
}

const steps = [
  {
    title: "Step 1",
    description: "Enter your email",
    input: "email",
    helperText: "E-mail originated in the 1960s as a method for users of time-sharing computers to communicate, evolving into the global system we use today with the development of ARPANET in the 1970s."
  },
  {
    title: "Step 2",
    description: "Enter your username",
    input: "username",
    helperText: "Usernames originated in early multi-user computing systems as a way to uniquely identify individuals accessing shared resources. As computer networks expanded, usernames became a standard authentication method, allowing users to log in to systems securely. With the rise of the internet, they evolved into digital identities, enabling personalization, social interaction, and access control across various online platforms."
  },
  {
    title: "Step 3",
    description: "Enter your password",
    input: "password",
    helperText: "Passwords date back to ancient times as a means of authentication and were first used in computing in the 1960s for multi-user systems, evolving into a fundamental security measure for digital access."
  },
] as const;