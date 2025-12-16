# Guía de Arquitectura: Los 3 Pilares del Backend

Para tu proyecto final, es vital entender que no todo el código va junto. Separamos el código en 3 archivos principales para mantener el orden. Aquí está la analogía perfecta para tu presentación:

Imagine un **Restaurante**:

1.  **`app.py` (El Gerente / La Entrada)**
    *   **Función**: Es quien abre el restaurante, prende las luces y le dice a los clientes dónde sentarse.
    *   **En código**:
        *   Inicializa Flask (`app = Flask(...)`).
        *   Configura la conexión a Base de Datos.
        *   Define las rutas (`/workshops`, `/register`) y asigna qué "Mesero" (Resource) atiende cada una.
    *   **Utilidad**: Sin él, nada arranca. Es el punto de entrada.

2.  **`models.py` (La Despensa / Los Ingredientes)**
    *   **Función**: Define qué ES un plato. No lo cocina ni lo sirve, solo define: "Una Hamburguesa tiene pan, carne y queso".
    *   **En código**:
        *   Define las Clases (`Workshop`, `Student`).
        *   Define los Tipos de Datos (String, Integer).
        *   Define las Relaciones (Foreign Keys).
    *   **Utilidad**: Garantiza la estructura de los datos. Si intentas guardar una "Hamburguesa" sin "Carne", aquí es donde fallaría.

3.  **`resources.py` (Los Meseros / La Cocina)**
    *   **Función**: Es quien toma la orden del cliente, verifica que sea válida, va a la cocina (Base de Datos) a buscar o guardar algo, y regresa con el plato servido.
    *   **En código**:
        *   Contiene la lógica: `Calcula si hay cupo`, `Verifica si el email existe`.
        *   Ejecuta las acciones: `GET` (Traer menú), `POST` (Tomar orden).
        *   Habla con `models.py` para usar los datos.
        *   Habla con `app.py` para recibir la petición.
    *   **Utilidad**: Es el cerebro. Aquí ocurren las reglas de negocio (ej: "No inscribir si el taller está lleno").

## Resumen para la "Diapositiva"

| Archivo | Rol | Analogía | ¿Qué hace? |
| :--- | :--- | :--- | :--- |
| **app.py** | Configuración | **Gerente** | Arranca el server y conecta rutas. |
| **models.py** | Datos | **Planos/Ingredientes** | Define tablas y columnas (Estructura). |
| **resources.py** | Lógica | **Mesero/Cocinero** | Procesa peticiones y aplica reglas. |
