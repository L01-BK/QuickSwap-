export interface Post {
    id: string | number;
    user: string;
    title: string;
    time: string;
    tags: string[];
    content?: string;
    info?: string[];
    images?: string[];
}
