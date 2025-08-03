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
}

export type ApiResponse = AnalysisResult; 