import { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, MapPin, Plus, Users, XCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
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

const categories = ['Tecnología', 'Emprendimiento', 'Habilidades Blandas', 'Creatividad', 'Salud'];

function App() {
  const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
  const [form, setForm] = useState<Workshop>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment>({ workshopId: initialWorkshops[0].id, studentEmail: '', studentName: '' });
  const [filter, setFilter] = useState('todos');
  const [message, setMessage] = useState<string | null>(null);

  const stats = useMemo(() => {
    const active = workshops.filter((w) => w.status === 'activo');
    const canceled = workshops.filter((w) => w.status === 'cancelado');
    const seats = active.reduce((acc, w) => acc + (w.capacity - w.enrolled), 0);
    return { total: workshops.length, active: active.length, canceled: canceled.length, seats };
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

    if (editingId) {
      setWorkshops((prev) => prev.map((item) => (item.id === editingId ? { ...form, id: editingId } : item)));
      setMessage('Taller actualizado con éxito.');
    } else {
      const newWorkshop = { ...form, id: crypto.randomUUID() };
      setWorkshops((prev) => [...prev, newWorkshop]);
      setMessage('Taller creado y publicado.');
    }

    resetForm();
  };

  const handleEdit = (workshop: Workshop) => {
    setForm(workshop);
    setEditingId(workshop.id);
  };

  const handleCancel = (id: string) => {
    setWorkshops((prev) => prev.map((w) => (w.id === id ? { ...w, status: 'cancelado' } : w)));
    setMessage('Taller cancelado.');
  };

  const handleDelete = (id: string) => {
    setWorkshops((prev) => prev.filter((w) => w.id !== id));
    setMessage('Taller eliminado.');
    if (editingId === id) resetForm();
  };

  const handleRegister = (evt: React.FormEvent) => {
    evt.preventDefault();
    const targetWorkshop = workshops.find((w) => w.id === enrollment.workshopId);
    if (!targetWorkshop) return;

    if (targetWorkshop.status === 'cancelado') {
      setMessage('No puedes inscribirte en un taller cancelado.');
      return;
    }

    if (targetWorkshop.enrolled >= targetWorkshop.capacity) {
      setMessage('El taller ya alcanzó su capacidad máxima.');
      return;
    }

    setWorkshops((prev) =>
      prev.map((w) => (w.id === enrollment.workshopId ? { ...w, enrolled: w.enrolled + 1 } : w))
    );
    setMessage('Inscripción registrada. ¡Revisa tu correo para más detalles!');
    setEnrollment((prev) => ({ ...prev, studentName: '', studentEmail: '' }));
  };

  return (
    <div className="min-h-screen text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <header className="glass-card rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Gestión de talleres profesionales
              </p>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                Diseña, publica y administra la oferta académica de tu centro.
              </h1>
              <p className="max-w-3xl text-base text-slate-600">
                Usa la consola de administración para crear talleres, monitorear cupos y registrar estudiantes en un solo lugar.
                Los cambios se reflejan de inmediato en el catálogo público.
              </p>
              <div className="flex gap-3 text-sm text-slate-500">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> API RESTful lista para conectar</div>
                <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-amber-500" /> Inscripciones en tiempo real</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-900 px-6 py-5 text-white shadow-lg">
              <div>
                <p className="text-sm text-slate-300">Talleres activos</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Cupos disponibles</p>
                <p className="text-3xl font-bold">{stats.seats}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Cancelados</p>
                <p className="text-3xl font-bold">{stats.canceled}</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">Total talleres</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 glass-card">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar taller' : 'Registrar nuevo taller'}</CardTitle>
              <CardDescription>Captura la información mínima para publicar el taller en el catálogo web.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Ej. Diseño de APIs RESTful con Flask"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <select
                    id="category"
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Selecciona</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Lugar</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Aula, laboratorio o salón"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input id="time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Cupos</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Objetivo, requisitos y actividades principales"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" /> {editingId ? 'Guardar cambios' : 'Publicar taller'}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="ghost" onClick={resetForm}>
                      Cancelar edición
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
            {message && (
              <CardFooter className="text-sm text-emerald-700">{message}</CardFooter>
            )}
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Inscribir estudiante</CardTitle>
              <CardDescription>Registra a un estudiante en cualquier taller disponible.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workshopId">Taller</Label>
                  <select
                    id="workshopId"
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={enrollment.workshopId}
                    onChange={(e) => setEnrollment({ ...enrollment, workshopId: e.target.value })}
                  >
                    {workshops.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Nombre completo</Label>
                  <Input
                    id="studentName"
                    value={enrollment.studentName}
                    onChange={(e) => setEnrollment({ ...enrollment, studentName: e.target.value })}
                    placeholder="Nombre del estudiante"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentEmail">Correo</Label>
                  <Input
                    id="studentEmail"
                    type="email"
                    value={enrollment.studentEmail}
                    onChange={(e) => setEnrollment({ ...enrollment, studentEmail: e.target.value })}
                    placeholder="estudiante@correo.com"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Registrar cupo
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Catálogo de talleres</h2>
              <p className="text-sm text-slate-500">Filtra por categoría y administra inscripciones.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['todos', ...categories].map((option) => (
                <Button
                  key={option}
                  variant={filter === option ? 'default' : 'ghost'}
                  onClick={() => setFilter(option)}
                  className="capitalize"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleWorkshops.map((workshop) => {
              const available = workshop.capacity - workshop.enrolled;
              const statusColor = workshop.status === 'cancelado' ? 'destructive' : 'default';
              return (
                <Card key={workshop.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{workshop.title}</CardTitle>
                        <CardDescription>{workshop.description}</CardDescription>
                      </div>
                      <Badge variant={statusColor}>{workshop.status === 'cancelado' ? 'Cancelado' : 'Activo'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-500" /> {workshop.date} · {workshop.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" /> {workshop.location || 'Por confirmar'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" /> {workshop.enrolled} / {workshop.capacity} inscritos
                    </div>
                    <Badge variant="outline" className="mt-1 w-fit border-primary/40 text-primary">
                      {workshop.category || 'Sin categoría'}
                    </Badge>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button variant="secondary" onClick={() => handleEdit(workshop)}>
                        Editar
                      </Button>
                      <Button variant="outline" onClick={() => handleCancel(workshop.id)} disabled={workshop.status === 'cancelado'}>
                        Cancelar
                      </Button>
                      <Button variant="ghost" className="text-destructive" onClick={() => handleDelete(workshop.id)}>
                        <XCircle className="mr-2 h-4 w-4" /> Eliminar
                      </Button>
                      <div className={cn('text-xs font-medium', available > 0 ? 'text-emerald-600' : 'text-amber-700')}>
                        {available > 0 ? `${available} cupos libres` : 'Cupo lleno'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
