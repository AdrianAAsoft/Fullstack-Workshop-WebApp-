import axios from 'axios';

// Development API base — point axios to the backend port (5001 by default).
// If you use a different port, set VITE_API_URL or update this value.
axios.defaults.baseURL = 'http://localhost:5001/';
import { User } from './types';

export const registerUser = async (user: User): Promise<string | null> => {
  try {
    await axios.post('api/users', user);
    return null; // Registro exitoso
  } catch (error: any) {
    return error.response?.data?.message || 'Hubo un error al registrar el usuario';
  }
};

export const loginUser = async (email: string, password: string): Promise<string | null> => {
  try {
    const response = await axios.post('api/login', { email, password });
    const user: User = response.data.user;
    // Guardar sesión localmente para que getSessionUser funcione
    localStorage.setItem('session', JSON.stringify(user));
    return null; // Inicio de sesión exitoso
  } catch (error: any) {
    return error.response?.data?.message || 'Hubo un error al iniciar sesión';
  }
};

export const getSessionUser = () => {
  return JSON.parse(localStorage.getItem('session') || 'null');
};

export const logoutUser = () => {
  // remove any authentication-related keys
  localStorage.removeItem('session');
  localStorage.removeItem('role');
};
