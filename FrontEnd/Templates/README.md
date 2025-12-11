# Frontend – Gestión de Talleres

Aplicación React creada con Vite y componentes inspirados en shadcn/ui para el sistema de gestión de talleres de formación profesional.

## Scripts principales

```bash
npm install       # Instala dependencias
npm run dev       # Levanta el entorno de desarrollo en http://localhost:5173
npm run build     # Genera la versión de producción
```

## Características

- Dashboard para administradores con métricas rápidas de talleres y cupos.
- Formulario de creación/edición de talleres con categorías y control de cupos.
- Cancelación y eliminación de talleres desde el catálogo.
- Inscripción de estudiantes con validaciones de estado y capacidad.
- Catálogo filtrable por categoría, construido con componentes reutilizables (botones, tarjetas, badges, etc.).

Los datos se mantienen en memoria dentro de la SPA para demostrar el flujo completo. La capa de API REST descrita en el proyecto puede conectarse fácilmente reemplazando las operaciones de estado locales por llamadas HTTP.
