import { useEffect, useState } from 'react';
import { Loader2, Syringe } from 'lucide-react';

interface LoadingOverlayProps {
    isLoading: boolean;
    delay?: number; // Only show after this delay in ms
}

const LoadingOverlay = ({ isLoading, delay = 2000 }: LoadingOverlayProps) => {
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isLoading) {
            // Only show loader after the delay
            timer = setTimeout(() => {
                setShowLoader(true);
            }, delay);
        } else {
            setShowLoader(false);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isLoading, delay]);

    if (!showLoader) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-xl opacity-50 animate-pulse" />
                    <div className="relative p-6 rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl">
                        <Syringe className="h-10 w-10 text-white animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-lg font-medium text-foreground">Loading...</span>
                </div>
                <p className="text-sm text-muted-foreground">Please wait while we prepare your data</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
