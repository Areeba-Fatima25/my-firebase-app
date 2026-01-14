import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = "md", className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        <div className={cn(
          "rounded-full border-4 border-primary/20 animate-spin",
          sizeClasses[size]
        )} style={{ borderTopColor: 'hsl(var(--primary))' }} />
        <div className={cn(
          "absolute inset-0 rounded-full border-4 border-transparent animate-ping opacity-20",
          sizeClasses[size]
        )} style={{ borderTopColor: 'hsl(var(--primary))' }} />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/30">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-primary/40 animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-card rounded-xl border p-6 space-y-4 animate-pulse">
    <div className="h-4 bg-muted rounded w-3/4" />
    <div className="h-3 bg-muted rounded w-1/2" />
    <div className="space-y-2">
      <div className="h-3 bg-muted rounded" />
      <div className="h-3 bg-muted rounded w-5/6" />
    </div>
  </div>
);
