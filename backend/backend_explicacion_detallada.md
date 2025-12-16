# Arquitectura Detallada del Backend

Esta guía desglosa técnicamente qué hace cada archivo del backend y cómo fluyen los datos a través de los métodos específicos que hemos programado.

---

## 1. `app.py`: El Orquestador

Este archivo es el punto de entrada. Su trabajo es **configurar** y **arrancar**.

### ¿Qué hace?
1.  **Inicialización de Flask**: Crea la instancia de la aplicación web (`app = Flask(__name__)`).
2.  **Configuración DB**: Define dónde se guardará el archivo SQLite (`sqlite:///workshops.db`).
3.  **Habilitar CORS**: Permite que el Frontend (React) que corre en otro puerto pueda hablar con este Backend.
4.  **Enrutamiento (Routing)**: Define el "mapa" de la API. Asocia URLs con Clases de Recursos.

### Mapa de Métodos (Rutas)
*   `api.add_resource(LoginResource, '/login')` -> Cuando alguien visite `/login`, la clase `LoginResource` lo atiende.
*   `api.add_resource(WorkshopListResource, '/workshops')` -> Para listar o crear talleres.
*   `api.add_resource(WorkshopResource, '/workshops/<id>')` -> Para ver, editar o borrar un taller específico.
*   `api.add_resource(WorkshopRegistration, '/workshops/<id>/register')` -> Lógica especial de inscripción.

---

## 2. `models.py`: La Estructura de Datos

Aquí definimos el "Esquema" de la base de datos usando SQLAlchemy. **No hay lógica, solo definiciones.**

### Clases y Métodos
*   **`class Workshop(db.Model)`**: Representa la tabla `workshop`.
    *   `to_dict()`: Método auxiliar clave. Convierte el objeto de base de datos (que Python entiende) a un Diccionario/JSON (que el Frontend entiende).
*   **`class Student(db.Model)`**: Representa la tabla `student`.
    *   Define `email` como único.
*   **`class Registration(db.Model)`**: Tabla intermedia.
    *   Conecta `workshop_id` con `student_id`.
*   **`class User(db.Model)`**: Para administradores.
    *   Guarda `username` y `password` (para el login).

---

### 3. `resources.py`: La Lógica de Negocio

Aquí es donde "piensa" la aplicación. Cada clase hereda de `Resource` de Flask-RESTful.

### Clase `LoginResource`
*   **`post(self)`**:
    1.  Recibe `username` y `password`.
    2.  Busca en la BD: `User.query.filter_by(...)`.
    3.  **Lógica**: Compara contraseñas. Si coincide, devuelve éxito (200); si no, error (401).

### Clase `WorkshopListResource`
*   **`get(self)`**: "Dame todos".
    *   Hace `Workshop.query.all()`.
    *   Devuelve una lista de JSONs.
*   **`post(self)`**: "Crea uno nuevo".
    *   `parser.parse_args()`: Valida que envíes título, fecha, etc.
    *   `db.session.add(...)`: Prepara el guardado.
    *   `db.session.commit()`: Guarda permanentemente en SQLite.

### Clase `WorkshopResource` (Opera sobre un ID específico)
*   **`get(self, workshop_id)`**:
    *   `Workshop.query.get_or_404(id)`: Busca por ID. Si no existe, corta el flujo y devuelve error 404 automáticamente.
*   **`put(self, workshop_id)`**: Recibe datos nuevos y actualiza los campos del objeto encontrado.
*   **`delete(self, workshop_id)`**: Borra el registro de la BD.

### Clase `WorkshopRegistration` (El proceso más complejo)
*   **`post(self, workshop_id)`**:
    1.  **Valida Capacidad**: Comprueba si `len(registrations) >= capacity`. Si está lleno, devuelve error 400.
    2.  **Busca o Crea Estudiante**: Busca por email. Si no existe, crea uno nuevo al vuelo (`db.session.add(student)`).
    3.  **Evita Duplicados**: Busca si ya existe una inscripción para ese par `(taller, estudiante)`.
    4.  **Registra**: Crea la fila en la tabla `Registration`.

---

## Resumen del Flujo Completo

Cuando haces clic en **"Registrar Cupo"** en el Frontend:

1.  El Frontend envía `POST /workshops/1/register` con `{email: "juan@test.com"}`.
2.  **`app.py`** recibe la petición y la envía a la clase **`WorkshopRegistration`** en **`resources.py`**.
3.  **`resources.py`** habla con **`models.py`** para verificar si el taller 1 existe y si hay cupo.
4.  Si todo está bien, **`resources.py`** ordena guardar la inscripción.
5.  **`resources.py`** responde con un JSON `{message: "Registration successful"}`.
6.  El Frontend recibe el mensaje y muestra la alerta verde.
