import axios from 'axios';

export const registerUser = async (user: User): Promise<string | null> =>{
  try{
    const response = await axios.post('api/users', user);
    return null; //Registro exitoso
  }catch(error: any){
    return error.response?.data?.message || 'Hubo un error al registrar el usuario';
  }
};

export const loginUser = async (email: string, password : string): Promise<string | null> =>{
  try{
    const response = await axios.post('api/login', {email, password});
    const user = response.data.user;
    return user;
  }catch(error: any){
    return error.response?.data?.message || 'Hubo un error al registrar el usuario';
  }
};

export type User = {
  name: string;
  email: string;
  password: string;
};



export const getSessionUser = () => {
  return JSON.parse(localStorage.getItem('session') || "null");
};

export const logoutUser = () => {
  localStorage.removeItem('session');
};
