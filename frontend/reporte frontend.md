# Reporte del Frontend

Este documento detalla la arquitectura y funcionamiento del frontend para el sistema de Gestión de Talleres. La aplicación es una SPA (Single Page Application) moderna construida con React, diseñada para consumir la API REST del backend de manera eficiente y ofrecer una experiencia de usuario fluida.

### Estructura de Carpetas

La organización de archivos sigue un patrón modular donde se separan la vista, la lógica de conexión y las definiciones de tipos.

- **`frontend/src/`**
    - `main.tsx`: **Punto de montaje**. Conecta el árbol de componentes de React con el DOM del navegador (`index.html`).
    - [`App.tsx`](http://App.tsx): **Componente Principal**. Contiene la estructura de la página, el manejo del estado global (talleres, formularios) y la orquestación de llamadas a la API.
    - `services/`
        - [`api.ts`](http://api.ts): **Capa de Servicio**. Módulo dedicado exclusivamente a comunicarse con el backend. Aquí están las funciones `fetch` (get, post, put, delete).
    - `components/ui/`: **Biblioteca de UI**. Componentes reutilizables estilizados con TailwindCSS.
        - `Card`, `Button`, `Input`, `Badge`: Bloques de construcción visuales para mantener la consistencia del diseño.
    - `types.ts`: **Definiciones TypeScript**. Interfaces que definen la forma de los datos (`Workshop`, `Student`, `Enrollment`) para evitar errores de programación.
    - `lib/utils.ts`: Utilidades para manejo de clases CSS condicionales.

---

### 1. Concepto Clave: SPA con React

- **Single Page Application**: La aplicación no recarga la página cada vez que haces clic. React actualiza solo las partes de la pantalla que cambian (ej. al agregar un taller, solo aparece la tarjeta nueva sin parpadear).
- **Hooks (`useState`, `useEffect`)**: El "cerebro" local.
    - `useEffect`: Se usa para cargar los datos del backend "al montar" la página (al inicio).
    - `useState`: Mantiene los datos en la memoria del navegador mientras el usuario interactúa (ej. lo que escribes en el formulario antes de enviar).

---

### 2. Integración con Backend (Capa de Servicios)

El frontend no "sabe" de SQL ni de bases de datos. Solo sabe pedir datos a la API.

- **Abstracción**: En `services/api.ts`, creamos funciones con nombres claros: `getWorkshops()`, `createWorkshop()`.
- **Flujo de Datos**:
    1.  El usuario llena el formulario y da clic en "Guardar".
    2.  Frontend llama a `api.createWorkshop(datos)`.
    3.  Backend responde "OK" (201).
    4.  Frontend recibe la confirmación y actualiza la lista en pantalla inmediatamente.

---

### 3. Diseño y UI (TailwindCSS)

El diseño visual es un requisito clave ("Premium Aesthetics").

- **TailwindCSS**: Usamos clases utilitarias para estilizar rápido sin escribir archivos CSS gigantes.
- **Micro-interacciones**: Efectos de `hover` y transiciones suaves para que la app se sienta "viva".
- **Glassmorphism**: Uso de transparencias y desenfoques (`backdrop-blur`) en las tarjetas para un look moderno y limpio.
- **Responsividad**: El diseño se adapta automáticamente a celulares (columnas apiladas) y escritorio (grid de 3 columnas).

---

### 4. Componentes Reutilizables

En lugar de repetir código HTML, creamos "Lego bricks" personalizados:

- **`<Card />`**: El contenedor blanco/transparente que agrupa la información de cada taller.
- **`<Badge />`**: La etiqueta pequeña de color que muestra el estado ("Activo", "Cancelado") o la categoría. Muestra visualmente la lógica del negocio.
- **`<Button />`**: Botones consistentes con variantes (primario, fantasma, destructivo).

---

### 5. Flujo de Usuario (Workflow)

Así es como la aplicación maneja las tareas del usuario:

1.  **Visualización (Dashboard)**:
    - Al entrar, el usuario ve métricas en tiempo real (cupos disponibles, talleres activos). Estas se calculan en el frontend usando `useMemo` sobre los datos crudos del backend.
2.  **Gestión (CRUD)**:
    - **Crear**: Formulario validado (no deja enviar si falta fecha).
    - **Editar**: Reutiliza el mismo formulario de creación pero precarga los datos.
    - **Eliminar**: Pide confirmación y llama a la API.
3.  **Inscripción (Lógica de Negocio en Cliente)**:
    - El formulario de inscripción valida visualmente reglas antes de enviar: "Si el taller está cancelado, deshabilita el botón". Esto mejora la experiencia de usuario (UX) antes de llegar al servidor.

---

### 6. Tecnologías Usadas

- **Lenguaje**: TypeScript (JavaScript con tipos) para mayor seguridad y menos errores.
- **Framework**: React (vía Vite para máxima velocidad).
- **Estilos**: Tailwind CSS.
- **Iconos**: Lucide React (iconos SVG ligeros y modernos).
