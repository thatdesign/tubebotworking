import { cn } from "@/lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md p-8 bg-background",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}