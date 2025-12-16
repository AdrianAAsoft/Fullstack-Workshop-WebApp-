export interface Workshop {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    capacity: number; // backend has this
    status: string; // 'activo' | 'cancelado'
    enrolled: number;
}

export interface User {
    id: number;
    username: string;
    role: 'admin' | 'student';
}

export interface LoginCredentials {
    username: string;
    password: string;
}
