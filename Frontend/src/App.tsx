import { getSessionUser, loginUser, registerUser, logoutUser } from './auth';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  Users,
  XCircle
} from 'lucide-react';
import { Button } from './components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Textarea } from './components/ui/textarea';
import { initialWorkshops } from './data/workshops';
import { Enrollment, Workshop } from './types';
import { cn } from './lib/utils';

const emptyForm: Workshop = {
  id: '',
  title: '',
  description: '',
  location: '',
  date: '',
  time: '',
  category: '',
  capacity: 20,
  enrolled: 0,
  status: 'activo'
};

const categories = [
  'Tecnología',
  'Emprendimiento',
  'Habilidades Blandas',
  'Creatividad',
  'Salud'
];

function App() {
  const [isLogged, setIsLogged] = useState<boolean>(!!getSessionUser());
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
    adminPassword: ''
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
  const [form, setForm] = useState<Workshop>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment>({
    workshopId: initialWorkshops[0].id,
    studentEmail: '',
    studentName: ''
  });
  const [filter, setFilter] = useState('todos');
  const [message, setMessage] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (sessionUser?.role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const stats = useMemo(() => {
    const active = workshops.filter((w) => w.status === 'activo');
    const canceled = workshops.filter((w) => w.status === 'cancelado');
    const seats = active.reduce(
      (acc, w) => acc + (w.capacity - w.enrolled),
      0
    );
    return {
      total: workshops.length,
      active: active.length,
      canceled: canceled.length,
      seats
    };
  }, [workshops]);

  const visibleWorkshops = useMemo(() => {
    if (filter === 'todos') return workshops;
    return workshops.filter((w) => w.category === filter);
  }, [filter, workshops]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Enviar actualización al backend
        const res = await axios.put(`api/workshops/${editingId}`, form);
        setMessage('Taller actualizado.');
      } else {
        // Crear taller en backend
        const res = await axios.post('api/workshops', form);
        setMessage('Taller creado.');
      }

      // Refrescar lista desde backend
      const list = await axios.get('api/workshops');
      setWorkshops(list.data);
      resetForm();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error al guardar el taller');
    }
  };

  const handleLoginUser = async () => {
    const err = await loginUser(loginForm.email, loginForm.password);
    if (err) {
      setAuthError(err);
      return;
    }

    // Leer la sesión real que guardó loginUser
    const sessionUser = getSessionUser();
    setIsLogged(!!sessionUser);
    setIsAdmin(sessionUser?.role === 'admin');
  };

  const handleRegisterUser = async () => {
    // Delegar la verificación y creación al backend
    const role = registerForm.isAdmin ? 'admin' : 'usuario';
    const err = await registerUser({ ...registerForm, role });
    if (err) {
      setAuthError(err);
      return;
    }

    alert('Usuario registrado');
    setIsRegistering(false);
  };

  const handleLogoutUser = () => {
    logoutUser();
    setIsLogged(false);
    setIsAdmin(false);
  };

  const handleEdit = (workshop: Workshop) => {
    setForm(workshop);
    setEditingId(workshop.id);
  };

  const handleCancel = (id: string) => {
    setWorkshops((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: 'cancelado' } : w
      )
    );
  };

  const handleDelete = (id: string) => {
    setWorkshops((prev) => prev.filter((w) => w.id !== id));
    if (editingId === id) resetForm();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `api/workshops/${enrollment.workshopId}/register`,
        {
          studentEmail: enrollment.studentEmail,
          studentName: enrollment.studentName
        }
      );

      setMessage('Registro exitoso');

      // Refrescar lista de talleres desde backend
      const list = await axios.get('api/workshops');
      setWorkshops(list.data);

      setEnrollment({
        ...enrollment,
        studentEmail: '',
        studentName: ''
      });
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Error al registrar el estudiante');
    }
  };

  /* ================= LOGIN ================= */

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
            </CardTitle>
            {authError && (
              <p className="text-red-500 text-sm">{authError}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {isRegistering ? (
              <>
                <Input
                  placeholder="Nombre"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      name: e.target.value
                    })
                  }
                />
                <Input
                  placeholder="Correo"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      email: e.target.value
                    })
                  }
                />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value
                    })
                  }
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={registerForm.isAdmin}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        isAdmin: e.target.checked
                      })
                    }
                  />
                  <Label>¿Administrador?</Label>
                </div>

                {registerForm.isAdmin && (
                  <Input
                    type="password"
                    placeholder="Password admin"
                    value={registerForm.adminPassword}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        adminPassword: e.target.value
                      })
                    }
                  />
                )}

                <Button
                  onClick={handleRegisterUser}
                  className="w-full"
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                <Input
                  placeholder="Correo"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      email: e.target.value
                    })
                  }
                />
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      password: e.target.value
                    })
                  }
                />
                {/* Role selection removed: backend determines role */}
                <Button
                  onClick={handleLoginUser}
                  className="w-full"
                >
                  Entrar
                </Button>
              </>
            )}
          </CardContent>

          <CardFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setAuthError(null);
              }}
            >
              {isRegistering
                ? 'Ya tengo cuenta'
                : 'Crear cuenta'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <div className="p-10">APP CARGADA ✔</div>;
}

export default App;
