export type User = {
  name: string;
  email: string;
  password: string;
};

const USERS_KEY = "users";
const SESSION_KEY = "session";

export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = (user: User): string | null => {
  const users = getUsers();

  if (users.some((u) => u.email === user.email)) {
    return "Este correo ya está registrado";
  }

  users.push(user);
  saveUsers(users);
  return null;
};

export const loginUser = (email: string, password: string): string | null => {
  const users = getUsers();

  const found = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!found) return "Correo o contraseña incorrectos";

  localStorage.setItem(SESSION_KEY, JSON.stringify(found));
  return null;
};

export const getSessionUser = () => {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};
