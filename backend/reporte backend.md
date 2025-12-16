# Reporte del Backend

Este documento detalla la estructura y funcionamiento del backend para el sistema de Gestión de Talleres, siguiendo los principios de separación de responsabilidades, uso de base de datos relacional y arquitectura REST.

### Estructura de Carpetas

La estructura se ha mantenido limpia y modular, separando la definición de datos (modelos), la lógica de rutas (recursos) y la configuración principal.

- **`backend/`**
    - `app.py`: **Punto de entrada**. Inicializa la aplicación Flask, configura la base de datos y registra las rutas (endpoints) disponibles.
    - `models.py`: **Capa de Datos**. Define las tablas de la base de datos (Taller, Estudiante, Inscripción) usando SQLAlchemy. Aquí vive la estructura de la información.
    - `resources.py`: **Capa de Lógica/Controlador**. Contiene las clases que manejan las peticiones HTTP (GET, POST, PUT, DELETE). Aquí se valida la entrada y se llama a la base de datos.
    - `requirements.txt`: Lista de dependencias necesarias (Flask, SQLAlchemy, etc.).
    - `instance/`: Carpeta generada automáticamente donde reside el archivo `workshops.db` (la base de datos SQLite).

---

### 1. Idea Clave de Base de Datos (SQLite)

- **Serverless**: Utilizamos SQLite, que funciona como un archivo local (`workshops.db`). No requiere instalar un servidor complejo como MySQL o Postgres para desarrollo, lo que facilita la portabilidad.
- **Persistencia**: La conexión se establece al iniciar la aplicación. Los datos se guardan en el archivo físico; si reinicias la aplicación, los datos perduran.

---

### 2. Modelo Relacional

El sistema se basa en tres entidades principales que reflejan el negocio:

1.  **Taller (`Workshop`)**: La entidad principal.
2.  **Estudiante (`Student`)**: Los usuarios que participan.
3.  **Inscripción (`Registration`)**: **Tabla intermedia** que resuelve la relación "Muchos a Muchos".

**Reglas Clave Implementadas:**
- Un estudiante no puede inscribirse dos veces al mismo taller (Unicidad en Taller + Estudiante).
- Un taller tiene un cupo máximo (`capacity`). Si se llena, el backend rechaza nuevas inscripciones.

---

### 3. Conexión y Gestión de Datos (SQLAlchemy)

En lugar de escribir SQL crudo manualmente, utilizamos **SQLAlchemy** (ORM). Esto centraliza la gestión de la base de datos:

- **`db = SQLAlchemy()`**: Instancia central que gestiona el "Pool" de conexiones.
- **`db.create_all()`**: Se ejecuta al inicio en `app.py` para asegurar que las tablas existan automáticamente.
- **Transacciones**: Usamos `db.session.add()` y `db.session.commit()` para asegurar que los datos se guarden correctamente o se reviertan si hay error.

---

### 4. Separación de Lógica

Siguiendo las buenas prácticas, el archivo `app.py` no contiene lógica de negocio, solo configuración.

- **`app.py`**: Orquestador. "Arranca el servidor y conecta las piezas".
- **`resources.py`**: "El Cerebro". Recibe la petición, verifica los datos (ej. ¿El email es válido? ¿Hay cupo?) y decide qué hacer.
- **`models.py`**: "El Archivo". Solo le importa cómo guardar y recuperar datos, no sabe nada de HTTP ni JSON.

---

### 5. CRUD Completo

El backend implementa las operaciones CRUD estándar a través de la clase `WorkshopResource` y `WorkshopListResource`:

- **Crear (POST)**: Recibe JSON, valida campos, crea registro en BD.
- **Listar (GET)**: Consulta todos los talleres y los convierte a JSON.
- **Detalle (GET por ID)**: Busca un taller específico. Devuelve 404 si no existe.
- **Actualizar (PUT)**: Modifica campos específicos de un taller existente.
- **Eliminar (DELETE)**: Borra el taller y, gracias a la configuración de base de datos, elimina sus inscripciones asociadas (integridad referencial).

---

### 6. Endpoints (API REST)

Estos son los puntos de conexión que consume el Frontend (React):

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/workshops` | Obtiene la lista de todos los talleres. |
| `POST` | `/workshops` | Crea un nuevo taller. |
| `GET` | `/workshops/<id>` | Obtiene detalles de un taller específico. |
| `PUT` | `/workshops/<id>` | Actualiza la información de un taller. |
| `DELETE` | `/workshops/<id>` | Elimina un taller del sistema. |
| `POST` | `/workshops/<id>/register` | **Endpoint Especial**. Registra a un estudiante en un taller, manejando cupos y creación de usuario si es nuevo. |

---

### 7. Demo de Funcionamiento

Para validar el sistema:

1.  **Arranque**: Se ejecuta `python app.py`. Se crea la carpeta `instance` si no existe.
2.  **Prueba**:
    - Se envía un `POST` para crear "Taller de Python".
    - Se verifica con un `GET` que el taller devuelve `id: 1` y `capacity: 20`.
    - Se envía un `POST` a `/register` con un estudiante.
    - Se verifica nuevamente el taller y el campo `enrolled` habrá subido a 1.
3.  **Persistencia**: Se detiene el servidor, se vuelve a arrancar, y los datos siguen ahí gracias a SQLite.
