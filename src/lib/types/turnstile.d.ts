declare global {
    interface Window {
        turnstile: {
            render: (selector: string, options: any) => string;
            execute: (widgetId: string) => void;
            reset: (widgetId: string) => void;
        };
    }
}

export {}; 