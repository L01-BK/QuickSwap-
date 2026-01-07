export interface Post {
    id: string | number;
    userId: string | number;
    email?: string | null;
    phone?: string | null;
    user: string;
    title: string;
    time: string;
    tags: string[];
    content?: string;
    info?: string[];
    images?: string[];
}
