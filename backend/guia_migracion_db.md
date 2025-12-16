# ¿Cómo cambiar la Base de Datos? (Migración)

Esta es una pregunta clásica de defensa de proyecto. La respuesta corta es: **Gracias a SQLAlchemy (ORM), solo tienes que cambiar 1 línea de código.**

## El Concepto (La Magia del ORM)

Como usaste `models.py` para definir tus clases y SQLAlchemy para gestionarlas, tu código es "agnóstico" a la base de datos.
*   No escribiste `SELECT * FROM workshops` (SQL directo).
*   Escribiste `Workshop.query.all()` (Python).

SQLAlchemy traduce ese Python al dialecto que necesites (SQLite, Postgres, MySQL, Oracle) automáticamente.

## Los Pasos para Cambiar

Si quisieras pasar de tu SQLite local a una base de datos **PostgreSQL** profesional:

### 1. Instalar el "Driver"
Necesitas la librería que permite a Python hablar con la nueva DB.
```bash
pip install psycopg2-binary
```

### 2. Cambiar la URL de Conexión en `app.py`

**Antes (SQLite):**
```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workshops.db'
```

**Después (PostgreSQL):**
```python
# Formato: postgresql://usuario:password@host:puerto/nombre_db
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:12345@localhost:5432/proyecto_final'
```

### 3. Reiniciar
Al arrancar, `db.create_all()` creará automáticamente las tablas en PostgreSQL. **¡No tienes que crear los CREATE TABLE a mano!**

## Resumen para tu Clase
"Profesor, si quisiera escalar a una base de datos real, solo necesito instalar el driver de conexión y actualizar la variable `SQLALCHEMY_DATABASE_URI` en `app.py`. Toda la lógica y modelos se mantienen intactos gracias al ORM."
