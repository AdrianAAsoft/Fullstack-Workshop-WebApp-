# Plan de Base de Datos y Backend

## 1. Entidades y Reglas
### Entidades
**1. Taller (Workshop)**
- `id`: Identificador único (Integer/UUID).
- `title`: Título del taller (String, obligatorio).
- `description`: Descripción del contenido (Text, obligatorio).
- `date`: Fecha del evento (String YYYY-MM-DD o Date, obligatorio).
- `time`: Hora del evento (String HH:MM, obligatorio).
- `location`: Lugar físico/virtual (String, obligatorio).
- `category`: Categoría (Tecnología, Habilidades Blandas, etc.) (String, obligatorio).
- `capacity`: Cupo máximo (Integer, obligatorio, default 20).
- `status`: Estado (activo, cancelado, finalizado) (String, default 'activo').
- `created_at`: Fecha de creación (Timestamp).

**2. Estudiante (Student)**
*Representa a la persona que se inscribe.*
- `id`: Identificador único.
- `name`: Nombre completo (String, obligatorio).
- `email`: Correo electrónico (String, obligatorio, único por taller).
*Nota: En este modelo simple, si un estudiante va a 2 talleres, ¿se registra 2 veces? Para un sistema robusto, deberíamos tener una tabla `User` y una tabla intermedia `Registration`. Para este MVP universitario, usaremos una tabla `Registration` que guarde los datos del estudiante por cada inscripción, o una tabla `Student` que sea "única" y una tabla pivote.*
*Mejor enfoque:* Tabla `Student` (única por email) + Tabla `Registration` (Student <-> Workshop).

**3. Inscripción (Registration)**
- `id`: ID único.
- `workshop_id`: FK a Taller.
- `student_id`: FK a Estudiante.
- `registered_at`: Fecha de inscripción.

### Relaciones
- **Taller - Inscripción**: Uno a Muchos (Un taller tiene muchas inscripciones).
- **Estudiante - Inscripción**: Uno a Muchos (Un estudiante puede inscribirse a varios talleres).
- *Implícitamente*: Taller <-> Estudiante es Muchos a Muchos.

### Reglas de Negocio
- No exceder el `capacity` del taller.
- Un estudiante (email) no puede inscribirse dos veces al mismo taller.
- No se pueden crear talleres en fechas pasadas (opcional, pero buena práctica).

## 2. Tipo de Base de Datos
- **Elegida: PostgreSQL (o SQLite para desarrollo local)**.
- *Por qué*: Tienes datos estructurados (Talleres, Estudiantes) con relaciones claras (Inscripciones). Relacional es lo correcto.
- *Stack Actual*: Python (Flask) + SQLite (perfecto iniciar, fácil migrar a Postgres luego).

## 3. Esquema Propuesto
```sql
CREATE TABLE workshop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    date VARCHAR(20),
    time VARCHAR(10),
    location VARCHAR(100),
    category VARCHAR(50),
    capacity INTEGER DEFAULT 20,
    status VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE registration (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workshop_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(workshop_id) REFERENCES workshop(id),
    FOREIGN KEY(student_id) REFERENCES student(id)
);
```

## 4. API Endpoints (Flask)
- `GET /workshops`: Listar todos.
- `GET /workshops/:id`: Detalle.
- `POST /workshops`: Crear nuevo.
- `PUT /workshops/:id`: Editar.
- `DELETE /workshops/:id`: Eliminar (o cambiar status a cancelado).
- `POST /workshops/:id/register`: Inscribir estudiante (maneja creación de estudiante si no existe).

## 5. Tecnología
- **Backend**: Python con Flask (Ligero, rápido de implementar para esta escala).
- **Base de Datos**: SQLite (Local).
- **Frontend**: React + Vite + Tailwind (Ya existente).
