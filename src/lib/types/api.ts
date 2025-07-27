export interface Technology {
    name: string;
    category?: string;
}

export interface Category {
    category: string;
    technologies: string[];
}

export interface AnalysisResult {
    url: string;
    technologies: string[];
    categories: Category[];
}

export interface ApiResponse {
    url: string;
    technologies: string[];
    categories: Category[];
} 