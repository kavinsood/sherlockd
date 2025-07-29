declare global {
    interface Window {
        turnstile: {
            render: (selector: string, options: Record<string, unknown>) => string;
            execute: (widgetId: string) => void;
            reset: (widgetId: string) => void;
        };
    }
}

export {}; 