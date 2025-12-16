# Sistema de Gestión de Talleres de Formación Profesional

Este proyecto consiste en una aplicación web para la gestión de talleres de formación profesional (cursos técnicos, capacitaciones, etc.), permitiendo a administradores gestionar la oferta académica y a estudiantes inscribirse en las actividades.

El sistema implementa una arquitectura Cliente-Servidor con una **API RESTful** en el backend y una interfaz web para los usuarios.

## 📋 Características

### Funcionalidades Generales
*   **Gestión de Talleres (Administradores):**
    *   Crear nuevos talleres (nombre, descripción, fecha, hora, lugar, categoría).
    *   Modificar detalles de talleres existentes.
    *   Cancelar/Eliminar talleres.
*   **Participación (Estudiantes):**
    *   Visualizar lista de talleres disponibles.
    *   Ver detalles específicos de cada taller.
    *   Inscribirse/Registrarse en talleres.

### API RESTful
La aplicación expone los siguientes endpoints para la integración:

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/workshops` | Obtener todos los talleres disponibles. |
| `GET` | `/workshops/{id}` | Obtener detalles de un taller específico. |
| `POST` | `/workshops` | Crear un nuevo taller (Admin). |
| `PUT` | `/workshops/{id}` | Modificar un taller existente (Admin). |
| `DELETE` | `/workshops/{id}` | Eliminar un taller (Admin). |
| `POST` | `/workshops/{id}/register` | Registrar a un estudiante en un taller. |

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Python con Flask (Flask-RESTful).
*   **Frontend:** HTML5, CSS3, JavaScript (Opcional: Bootstrap/React).
*   **Base de Datos:** (A definir: PostgreSQL / MongoDB / MySQL).
*   **Control de Versiones:** Git & GitHub.

## 🚀 Instalación y Ejecución

Sigue estos pasos para configurar el entorno de desarrollo local.

### Prerrequisitos
*   Python 3.8 o superior
*   Gestor de paquetes `pip`
*   Motor de Base de Datos seleccionado instalado y corriendo.

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd <nombre-de-la-carpeta>
```

### 2. Configuración del Backend

Se recomienda crear un entorno virtual:

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno (Windows)
venv\Scripts\activate
# Activar entorno (macOS/Linux)
source venv/bin/activate
```

Instalar dependencias:
```bash
pip install -r requirements.txt
```

Configurar variables de entorno (crear archivo `.env`):
```env
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=tu_cadena_de_conexion
```

Iniciar el servidor:
```bash
flask run
```

### 3. Ejecución del Frontend
Abra el archivo `index.html` en su navegador o sirva la aplicación frontend utilizando un servidor local (por ejemplo, Live Server en VSCode).

## 📂 Estructura del Proyecto (Sugerida)

```
/
├── backend/
│   ├── app.py              # Punto de entrada de la aplicación Flask
│   ├── models/             # Modelos de base de datos
│   ├── routes/             # Definición de rutas y endpoints
│   ├── controllers/        # Lógica de negocio
│   └── requirements.txt    # Dependencias de Python
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
├── docs/                   # Documentación técnica adicional
└── README.md
```

## 👥 Contribución y Trabajo en Grupo

1.  **Backend:** Responsables de la API, conexión a BD y lógica del servidor.
2.  **Frontend:** Responsables de la interfaz de usuario y consumo de la API.
3.  **Base de Datos:** Diseño del esquema y mantenimiento de datos.
4.  **Documentación:** Mantenimiento de guías y documentación técnica.

## 📄 Licencia
Este proyecto es parte del curso de Programación IV (UIP - 2025 III Cuatrimestre).