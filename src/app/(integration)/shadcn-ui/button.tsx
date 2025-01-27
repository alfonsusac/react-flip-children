
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "lazy-cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-[hsl(0_0%_100%)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[hsl(222.2_47.4%_11.2%)] text-[hsl(210_40%_98%)] hover:bg-[hsl(222.2_47.4%_11.2%)]/90",
        destructive:
          "bg-[hsl(0_100%_50%)] text-[hsl(210_40%_98%)] hover:bg-[hsl(0_100%_50%)]/90",
        outline:
          "border border-[hsl(214.3_31.8%_91.4%)] bg-[hsl(0_0%_100%)] hover:bg-[hsl(210_40%_96.1%)] hover:text-[hsl(222.2_47.4%_11.2%)]",
        secondary:
          "bg-[hsl(210_40%_96.1%)] text-[hsl(222.2_47.4%_11.2%)] hover:[hsl(210_40%_96.1%)]",
        ghost: "hover:bg-[hsl(210_40%_96.1%)] hover:text-[hsl(222.2_47.4%_11.2%)]",
        link: "text-[hsl(222.2_47.4%_11.2%)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"


export interface AButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const AButton = React.forwardRef<HTMLAnchorElement, AButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <a
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
AButton.displayName = "AButton"

export { Button, AButton, buttonVariants }
