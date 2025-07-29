export interface Technology {
    name: string;
    category?: string;
}

export interface Category {
    category: string;
    technologies: Technology[];
}

export interface AnalysisResult {
    url: string;
    technologies: Technology[];
    categories: Category[];
}

export interface ApiResponse {
    url: string;
    technologies: Technology[];
    categories: Category[];
} 