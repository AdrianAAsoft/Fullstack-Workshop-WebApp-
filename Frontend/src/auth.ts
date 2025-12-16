import axios from 'axios';
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
  localStorage.removeItem('session');
};
