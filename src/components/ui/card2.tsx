import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const card2Variants = cva(
  "rounded-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "backdrop-blur-xl bg-white/15 border border-white/25 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:bg-white/20 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]",
        "glass-primary": "backdrop-blur-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/25 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:from-primary/25 hover:to-secondary/25 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]",
        "glass-accent": "backdrop-blur-xl bg-gradient-to-br from-accent/20 to-primary/20 border border-white/25 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] hover:from-accent/25 hover:to-primary/25 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface Card2Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof card2Variants> {}

const Card2 = React.forwardRef<HTMLDivElement, Card2Props>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(card2Variants({ variant }), className)} {...props} />
  )
);
Card2.displayName = "Card2";

const Card2Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
Card2Header.displayName = "Card2Header";

const Card2Title = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
Card2Title.displayName = "Card2Title";

const Card2Description = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
Card2Description.displayName = "Card2Description";

const Card2Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
Card2Content.displayName = "Card2Content";

const Card2Footer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
Card2Footer.displayName = "Card2Footer";

export { Card2, Card2Header, Card2Footer, Card2Title, Card2Description, Card2Content, card2Variants };
