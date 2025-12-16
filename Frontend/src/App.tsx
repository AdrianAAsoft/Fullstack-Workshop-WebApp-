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
    password: '',
    role: 'usuario'
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

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!form.title || !form.date || !form.time) {
      setMessage('Completa título, fecha y hora.');
      return;
    }

    (async () => {
      try {
        if (editingId) {
          // Update workshop on backend
          await axios.put(`api/workshops/${editingId}`, {
            title: form.title,
            description: form.description,
            location: form.location,
            date: form.date,
            time: form.time,
            category: form.category,
            capacity: form.capacity,
            status: form.status
          });
          setMessage('Taller actualizado con éxito.');
        } else {
          // Create workshop on backend
          await axios.post('api/workshops', {
            title: form.title,
            description: form.description,
            location: form.location,
            date: form.date,
            time: form.time,
            category: form.category,
            capacity: form.capacity,
            status: form.status
          });
          setMessage('Taller creado y publicado.');
        }

        // Refresh list from backend
        const res = await axios.get('api/workshops');
        setWorkshops(res.data);
        if (res.data && res.data.length > 0) {
          setEnrollment((prev) => ({ ...prev, workshopId: res.data[0].id }));
        }

        resetForm();
      } catch (err: any) {
        setMessage(err.response?.data?.message || 'Error guardando el taller');
      }
    })();
  };

  const handleLoginUser = async () => {
    const err = await loginUser(loginForm.email, loginForm.password);
    if (err) {
      setAuthError(err);
      return;
    }

    // legacy: store role selection (kept for compatibility)
    localStorage.setItem('role', loginForm.role);
    const sessionUser = getSessionUser();
    setIsLogged(!!sessionUser);
    setIsAdmin(sessionUser?.role === 'admin' || loginForm.role === 'admin');
  };

  const handleRegisterUser = async () => {
    const role: 'usuario' | 'admin' = registerForm.isAdmin && registerForm.adminPassword === 'markzuckemberg' ? 'admin' : 'usuario';

    if (registerForm.isAdmin && role !== 'admin') {
      alert('Contraseña de administrador incorrecta. Se registrará como usuario.');
    }

    const payload = {
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      role
    };

    const err = await registerUser(payload);
    if (err) {
      setAuthError(err);
      return;
    }

    alert('Usuario registrado');
    setIsRegistering(false);
  };

  const handleLogoutUser = () => {
    logoutUser();
    // Clear UI state and errors, then force a re-check of session
    setAuthError(null);
    setIsLogged(false);
    setIsAdmin(false);
    // reset forms
    setLoginForm({ email: '', password: '', role: 'usuario' });
    setRegisterForm({ name: '', email: '', password: '', isAdmin: false, adminPassword: '' });
    // optional: reload to fully reset app state
    // window.location.reload();
  };

  const handleEdit = (workshop: Workshop) => {
    setForm(workshop);
    setEditingId(workshop.id);
  };

  const handleCancel = (id: string) => {
    (async () => {
      try {
        await axios.put(`api/workshops/${id}`, { status: 'cancelado' });
        const res = await axios.get('api/workshops');
        setWorkshops(res.data);
      } catch (err: any) {
        setMessage(err.response?.data?.message || 'Error cancelando el taller');
      }
    })();
  };

  const handleDelete = (id: string) => {
    (async () => {
      try {
        await axios.delete(`api/workshops/${id}`);
        const res = await axios.get('api/workshops');
        setWorkshops(res.data);
        if (editingId === id) resetForm();
      } catch (err: any) {
        setMessage(err.response?.data?.message || 'Error eliminando el taller');
      }
    })();
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

  // Fetch latest workshops after login (keep UI behavior from current app)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('api/workshops');
        setWorkshops(res.data);
        if (res.data && res.data.length > 0) {
          setEnrollment((prev) => ({ ...prev, workshopId: res.data[0].id }));
        }
      } catch (err) {
        // backend unavailable: continue using initialWorkshops
      }
    };

    if (isLogged) load();
  }, [isLogged]);

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workshops</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">{getSessionUser()?.name}</div>
          <Button variant="ghost" onClick={handleLogoutUser}>Salir</Button>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cancelados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.canceled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.seats}</div>
          </CardContent>
        </Card>
      </section>

      <section className="flex items-center gap-2">
        <Badge onClick={() => setFilter('todos')} className={cn(filter === 'todos' && 'bg-slate-200')}>Todos</Badge>
        {categories.map((c) => (
          <Badge key={c} onClick={() => setFilter(c)} className={cn(filter === c && 'bg-slate-200')}>{c}</Badge>
        ))}
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {visibleWorkshops.map((w) => (
            <Card key={w.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{w.title}</h3>
                  <p className="text-sm text-slate-600">{w.description}</p>
                  <div className="text-sm text-slate-500">{w.date} · {w.time} · {w.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{w.enrolled}/{w.capacity}</div>
                  <div className="mt-2 flex flex-col gap-2">
                    {isAdmin && (
                      <>
                        <Button size="sm" onClick={() => handleEdit(w)}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(w.id)}>Eliminar</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleCancel(w.id)}>Cancelar</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <aside className="space-y-4">
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Editar taller' : 'Crear taller'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <Input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <Textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <Input placeholder="Lugar" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  <Input placeholder="Fecha" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <Input placeholder="Hora" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  <Input type="number" placeholder="Capacidad" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
                  <Button type="submit" className="w-full">{editingId ? 'Actualizar' : 'Crear'}</Button>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Inscribirse</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-2">
                <select className="w-full h-10 border rounded-md" value={enrollment.workshopId} onChange={(e) => setEnrollment({ ...enrollment, workshopId: e.target.value })}>
                  {workshops.map((w) => (
                    <option key={w.id} value={w.id}>{w.title}</option>
                  ))}
                </select>
                <Input placeholder="Nombre" value={enrollment.studentName} onChange={(e) => setEnrollment({ ...enrollment, studentName: e.target.value })} />
                <Input placeholder="Correo" value={enrollment.studentEmail} onChange={(e) => setEnrollment({ ...enrollment, studentEmail: e.target.value })} />
                <Button type="submit" className="w-full">Inscribirse</Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

export default App;
