import { Workshop, User, LoginCredentials } from '../types';

const API_URL = 'http://127.0.0.1:5000';

export const api = {
    // Auth
    login: async (credentials: LoginCredentials): Promise<{ message: string, user: User }> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    // Workshops
    getWorkshops: async (): Promise<Workshop[]> => {
        const response = await fetch(`${API_URL}/workshops`);
        if (!response.ok) throw new Error('Failed to fetch workshops');
        return response.json();
    },

    createWorkshop: async (workshop: Omit<Workshop, 'id' | 'enrolled'>): Promise<Workshop> => {
        const response = await fetch(`${API_URL}/workshops`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workshop),
        });
        if (!response.ok) throw new Error('Failed to create workshop');
        return response.json();
    },

    updateWorkshop: async (id: number, workshop: Partial<Workshop>): Promise<Workshop> => {
        const response = await fetch(`${API_URL}/workshops/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workshop),
        });
        if (!response.ok) throw new Error('Failed to update workshop');
        return response.json();
    },

    deleteWorkshop: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/workshops/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete workshop');
    },

    // Registration
    registerStudent: async (workshopId: number, studentData: { studentName: string, studentEmail: string }): Promise<any> => {
        const response = await fetch(`${API_URL}/workshops/${workshopId}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }
        return response.json();
    }
};
