export interface Technology {
    name: string;
    description: string;
    website: string;
}

export interface Category {
    category: string;
    technologies: Technology[];
}

export interface AnalysisResult {
    url: string;
    technologies: Technology[]; // The flat list for the "All Technologies" section
    categories: Category[];   // The grouped list for the category sections
    final_url?: string;       // Set when the page redirected
    blocked?: boolean;        // The site blocked the scanner; only headers, cookies and DNS were analyzed
    message?: string;         // Why, when blocked
}

export type ApiResponse = AnalysisResult; 