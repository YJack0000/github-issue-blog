import React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { className, children, ...rest } = props;

    return (
        <button ref={ref} className={cn("btn", className)} {...rest}>
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button }
